# Notes

<!-- Append-only. Group entries under ### Task N: [name] headings as you go. -->

### Task 1: Curated languages endpoint

The existing greeting route tests were intentionally replaced because the approved design removes both legacy `/api/greetings` endpoints. The curated language metadata now loads from `backend/data/languages.json`.

### Task 2: MyMemory translation endpoint

Tests use `httpx.MockTransport` against the real request-building and response-parsing path. This avoids live network calls while covering query parameters, upstream connection and timeout failures, and malformed payloads. The endpoint uses a five-second timeout and maps all upstream failures to HTTP 502.

### Task 3: Locale-aware dropdown interface

Vitest's default discovery included the Playwright `e2e/greetings.spec.ts` file because both frameworks use `.spec` names. `frontend/vite.config.js` now limits Vitest discovery to `tests/**/*.{test,spec}.{js,jsx}`, keeping the unit and E2E runners isolated.

### Task 4: E2E and OpenAPI

The end-to-end check intentionally asserts a non-empty dynamic greeting plus the selected language label rather than an exact translation string, because MyMemory may vary punctuation or wording. The live external request completed successfully during implementation.

### Task 5: ADR and living architecture

The external API boundary also invalidated the system-context and container documents, not only the API and frontend pages named in the original plan. All four living architecture documents were updated. AI-harness language was removed from the system architecture so the app architecture remains product-focused.

### Task 6: Final validation and dev loop

Four reusable issues surfaced and were fixed:

- Prettier scanned Playwright's generated `test-results/.last-run.json`; `frontend/.prettierignore` now excludes generated output directories, and the lint-and-fix skill documents the pattern.
- Vite bound bare `localhost` on IPv6 while hub probed `127.0.0.1`; the dev-loop skill now starts Vite with `--host 0.0.0.0`, making readiness deterministic.
- Vitest discovered the Playwright `.spec.ts`; its include pattern now limits unit discovery to `frontend/tests/`, and test-and-fix documents runner overlap.
- MyMemory rejects `en|en` inside an HTTP 200 payload and returned a poor exact match for the punctuated source phrase. English is now handled locally, provider `responseStatus` is validated, and non-English requests use `Hello world`, which returned a real Japanese translation in the live dev loop.
