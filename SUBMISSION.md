# Ajaia assignment submission — Pagewise

## Links to complete before submitting

- **Google Drive folder:** `PASTE_GOOGLE_DRIVE_FOLDER_URL_HERE`
- **Live product:** `PASTE_DEPLOYED_PRODUCT_URL_HERE`
- **Walkthrough video:** see [WALKTHROUGH_URL.txt](WALKTHROUGH_URL.txt)

## Included materials

- Source code for the Pagewise document editor.
- [README.md](README.md) — setup, demo accounts, feature list, and deployment path.
- [ARCHITECTURE.md](ARCHITECTURE.md) — architecture and timebox tradeoffs.
- [AI_WORKFLOW.md](AI_WORKFLOW.md) — AI use and verification approach.
- [WALKTHROUGH_URL.txt](WALKTHROUGH_URL.txt) — URL placeholder and suggested recording outline.
- Automated tests in `tests/store.test.js`.

## Reviewer credentials and flow

There are no passwords. Use the in-product **Viewing as** dropdown:

- Start as **Maya Chen** to create, edit, import, and share.
- Switch to **Leo Martin** to see the seeded shared document.
- Share a Maya-owned document with **Sana Patel**, then switch to Sana to see the new shared, read-only document.

## Working / incomplete

Working end to end: document creation, edit/rename, rich formatting, save/reopen persistence, `.txt`/`.md` import, owner sharing, visible owned/shared categories, and basic server-side validation.

Intentionally not included: production authentication, concurrent editing, comment threads, role variants beyond owner/read-only, `.docx` import, and version history. The next investment would be Postgres/auth plus optimistic versioning before any real-time features.
