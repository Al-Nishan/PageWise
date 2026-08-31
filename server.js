const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createStore, validateDocument } = require('./src/store');

const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, 'public');
const store = createStore(path.join(__dirname, 'data', 'db.json'));

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
};
const body = req => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => { data += chunk; if (data.length > 1_000_000) req.destroy(); });
  req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('Invalid JSON body.')); } });
});
const userId = req => new URL(req.url, `http://${req.headers.host}`).searchParams.get('user') || 'maya';

function staticFile(res, pathname) {
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  const target = path.normalize(path.join(publicDir, file));
  if (!target.startsWith(publicDir) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) return false;
  const ext = path.extname(target);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
  send(res, 200, fs.readFileSync(target), types[ext] || 'application/octet-stream');
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/users' && req.method === 'GET') return send(res, 200, store.users());
    if (url.pathname === '/api/documents' && req.method === 'GET') return send(res, 200, store.list(userId(req)));
    if (url.pathname === '/api/documents' && req.method === 'POST') {
      const input = await body(req); const error = validateDocument(input);
      if (error) return send(res, 422, { error });
      return send(res, 201, store.create({ ...input, ownerId: userId(req) }));
    }
    const match = url.pathname.match(/^\/api\/documents\/([\w-]+)$/);
    if (match && req.method === 'GET') {
      const doc = store.get(match[1], userId(req));
      return doc ? send(res, 200, doc) : send(res, 404, { error: 'Document not found or you do not have access.' });
    }
    if (match && req.method === 'PUT') {
      const input = await body(req); const error = validateDocument(input);
      if (error) return send(res, 422, { error });
      const doc = store.update(match[1], userId(req), input);
      return doc ? send(res, 200, doc) : send(res, 403, { error: 'Only the owner can edit this document.' });
    }
    const share = url.pathname.match(/^\/api\/documents\/([\w-]+)\/share$/);
    if (share && req.method === 'POST') {
      const input = await body(req);
      if (!input.userId) return send(res, 422, { error: 'Choose a teammate to share with.' });
      const doc = store.share(share[1], userId(req), input.userId);
      return doc ? send(res, 200, doc) : send(res, 403, { error: 'Only the owner can change sharing.' });
    }
    if (staticFile(res, url.pathname)) return;
    send(res, 404, { error: 'Not found.' });
  } catch (error) { send(res, 400, { error: error.message || 'Request could not be completed.' }); }
});

if (require.main === module) server.listen(PORT, () => console.log(`Pagewise is running at http://localhost:${PORT}`));
module.exports = { server };
