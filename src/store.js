const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const seeded = {
  users: [
    { id: 'maya', name: 'Maya Chen', initials: 'MC', color: '#6750a4' },
    { id: 'leo', name: 'Leo Martin', initials: 'LM', color: '#0b7285' },
    { id: 'sana', name: 'Sana Patel', initials: 'SP', color: '#c65d07' }
  ],
  documents: [{ id: 'welcome', title: 'Team launch notes', content: '<h1>Welcome to Pagewise</h1><p>This is a lightweight shared workspace for clear, focused writing.</p><h2>Today’s priorities</h2><ul><li>Align on the launch brief</li><li>Capture open questions</li><li>Share the finished plan</li></ul>', ownerId: 'maya', sharedWith: ['leo'], updatedAt: '2026-08-31T09:30:00.000Z' }]
};
function validateDocument(input) {
  if (!input || typeof input.title !== 'string' || !input.title.trim()) return 'A document title is required.';
  if (input.title.trim().length > 100) return 'Titles must be 100 characters or fewer.';
  if (typeof input.content !== 'string') return 'Document content is required.';
  if (input.content.length > 500000) return 'Document content is too large.';
  return null;
}
// This editor only needs a deliberately small rich-text surface. Persisting a
// whitelist instead of arbitrary pasted HTML keeps the demo safe by default.
function sanitizeHtml(html) {
  return html
    .replace(/<\/?(script|style)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/<(?!\/?(?:p|div|h1|h2|ul|ol|li|strong|b|em|i|u|br)\b)[^>]*>/gi, '');
}
function createStore(file) {
  const ensure = () => {
    if (!fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(seeded, null, 2)); }
  };
  const read = () => { ensure(); return JSON.parse(fs.readFileSync(file, 'utf8')); };
  const write = data => fs.writeFileSync(file, JSON.stringify(data, null, 2));
  const accessible = (doc, user) => doc.ownerId === user || doc.sharedWith.includes(user);
  return {
    users: () => read().users,
    list(user) { const data = read(); return data.documents.filter(d => accessible(d, user)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
    get(id, user) { return read().documents.find(d => d.id === id && accessible(d, user)); },
    create(input) { const data = read(); const doc = { id: randomUUID(), title: input.title.trim(), content: sanitizeHtml(input.content), ownerId: input.ownerId, sharedWith: [], updatedAt: new Date().toISOString() }; data.documents.push(doc); write(data); return doc; },
    update(id, user, input) { const data = read(); const doc = data.documents.find(d => d.id === id && d.ownerId === user); if (!doc) return null; doc.title = input.title.trim(); doc.content = sanitizeHtml(input.content); doc.updatedAt = new Date().toISOString(); write(data); return doc; },
    share(id, user, teammate) { const data = read(); if (!data.users.some(u => u.id === teammate) || teammate === user) return null; const doc = data.documents.find(d => d.id === id && d.ownerId === user); if (!doc) return null; if (!doc.sharedWith.includes(teammate)) doc.sharedWith.push(teammate); write(data); return doc; }
  };
}
module.exports = { createStore, validateDocument, sanitizeHtml };
