# Architecture note

## Chosen slice

Pagewise is a single-process Node.js application with a small REST API and a dependency-free browser client. A JSON file serves as the persistence layer. This is intentionally a deployable vertical slice rather than a mock-only front end: the UI calls a server, the server enforces ownership and validation, and formatted document content plus sharing records survive refresh and process restart.

```
Browser UI (contenteditable + Fetch)
             │
             ▼
Node HTTP server / REST routes
             │
             ▼
JSON document store (data/db.json)
```

## Data model

`User`: `id`, `name`, `initials`, `color`  
`Document`: `id`, `title`, `content` (sanitized rich HTML), `ownerId`, `sharedWith[]`, `updatedAt`

The document list is calculated for the active demo identity as `ownerId === userId || sharedWith includes userId`. Updates and sharing are owner-only; recipients can reopen a document but cannot alter it.

## Intentional implementation choices

- **Native rich text**: `contenteditable` and browser formatting commands cover the brief with no editor dependency or setup overhead. The toolbar exposes the required formats; stored HTML preserves formatting on reopen.
- **JSON persistence**: a file-based store is transparent, zero-cost, and easy to reset for a reviewer. The store initializes seeded users/data on first run.
- **Demo identity switcher**: it makes the access-control path testable in seconds without investing assignment time in passwords, cookies, and account recovery.
- **Import scope**: `.txt` and `.md` are safely read in the browser, converted into a limited HTML subset, and saved through the normal document flow. `.docx` was intentionally deferred.
- **Defensive baseline**: titles, payload size, file type/size, permissions, and malformed request bodies have explicit errors. Persisted HTML is limited to the formatting tags the editor needs and event handlers are removed.

## Production next steps

With another 2–4 hours I would replace JSON with Postgres, add real authentication, add per-user database authorization, evolve sharing to explicit roles, use a modern editor model (for example Tiptap), sanitize with a hardened library, and add optimistic concurrency/version history. Real-time collaboration is intentionally outside this first slice because it would reduce the quality of the core create–edit–share workflow within the 4–6 hour constraint.
