# Pagewise

Pagewise is a deliberately scoped collaborative document editor built for the Ajaia AI-Native Full Stack Developer assignment. It focuses on the core loop: create a document, write with a small rich-text toolkit, save it, reopen it, import text, and share it with a teammate.

## Review quickly

1. Start the app and open `http://localhost:3000`.
2. Create a document, add formatting, and save it.
3. Import a `.txt` or `.md` file; it opens as a new editable document.
4. Share an owned document with Leo or Sana.
5. Use **Viewing as** in the sidebar to switch to that teammate. The document appears under **Shared with me** and is intentionally read-only.

The first launch creates a local data file with three demo identities and a shared starter document:

| User | Demo role |
| --- | --- |
| Maya Chen | Default owner; owns the starter document |
| Leo Martin | Has read access to the starter document |
| Sana Patel | Available to demonstrate a new share |

## Local setup

Prerequisite: Node.js 20 or later.

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

Run the automated tests:

```bash
npm test
```

No package installation or external service is required. Runtime data is written to `data/db.json`, which is created on first run and ignored by Git. To reset the demo data, stop the server and delete that file.

## Included behavior

- Create, rename, edit, save, and reopen documents.
- Rich text through browser-native editing: bold, italic, underline, heading/subheading/body, bullet lists, and numbered lists.
- `.txt` and `.md` import (up to 500 KB) into a new editable document. Markdown supports headings, bullets, bold, and italic on import.
- Owner-only sharing; shared documents are visible, labeled, and read-only to recipients.
- JSON-file persistence with server-side validation and a narrow rich-text HTML allowlist.

## Deployment

The repository includes a `Dockerfile`, so it can deploy unchanged to any Docker-capable host (for example Render, Railway, Fly.io, or a VM): set the service port to `3000` or provide `PORT`.

For a static-free demo host, deploy this repository as a Docker web service and ensure its disk is persistent if data must survive redeploys. The current JSON store is intentional for the assignment’s timebox; production would replace it with Postgres and authenticated sessions.

Set the public URL after deployment in [SUBMISSION.md](SUBMISSION.md).

## Scope decisions

This is not a real-time Google Docs clone. Authentication, concurrent cursors/conflict resolution, fine-grained permissions, comments, binary Office import, and version history were consciously deferred in favor of a reliable end-to-end core flow. See [ARCHITECTURE.md](ARCHITECTURE.md) for rationale.
