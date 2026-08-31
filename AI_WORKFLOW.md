# AI-native workflow note

## Tools used

I used an AI coding assistant (Codex) as a paired implementation and review tool: it helped turn the prompt into a scoped delivery plan, scaffold the server/client/test structure, and identify edge cases to verify. I retained responsibility for architecture, tradeoffs, and every final change.

## Where it accelerated work

- Converting the broad assignment into a tightly scoped vertical slice and reviewer workflow.
- Drafting the repetitive wiring between the REST routes, JSON store, and UI state.
- Producing initial test cases for document sharing and validation, then running them during iteration.
- Reviewing the implementation for missing validation and persisted-HTML risks.

## What I changed or rejected

I deliberately rejected a heavier React/editor/database stack for this timebox. It would add setup and integration risk without improving the evaluable core loop. I also avoided claiming real-time collaboration or production authentication; the demo identity switcher is explicit in both the product and documentation. The initial plan to persist arbitrary editor HTML was narrowed to a small formatting allowlist so the stored content matches the supported surface.

## Verification approach

I ran the automated Node test suite, including the owner-to-recipient sharing path, validation, and HTML sanitization. I also smoke-tested API persistence and cross-user visibility. The UI is designed around a short manual reviewer path: create and format a document, refresh/reopen it, share it, then switch identity and observe the labeled read-only view. This combination was more valuable in the available time than adding unverified stretch features.
