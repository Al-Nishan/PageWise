const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createStore, validateDocument, sanitizeHtml } = require('../src/store');

test('owner can share a document and recipient can reopen it', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pagewise-')), 'db.json');
  const store = createStore(file);
  const doc = store.create({ title: 'Research brief', content: '<p>Draft</p>', ownerId: 'maya' });
  store.share(doc.id, 'maya', 'sana');
  assert.equal(store.list('sana').some(item => item.id === doc.id), true);
  assert.equal(store.get(doc.id, 'sana').title, 'Research brief');
});
test('document validation rejects an empty title', () => assert.equal(validateDocument({ title: ' ', content: '' }), 'A document title is required.'));
test('sanitization preserves editor formatting but strips event handlers', () => {
  assert.equal(sanitizeHtml('<h1 onclick="alert(1)">Title</h1><script>alert(1)</script><u>note</u>'), '<h1>Title</h1>alert(1)<u>note</u>');
});
