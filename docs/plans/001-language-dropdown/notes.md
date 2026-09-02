# Notes

<!-- Append-only. Group entries under ### Task N: [name] headings as you go. -->

### Task 1: Curated languages endpoint

The existing greeting route tests were intentionally replaced because the approved design removes both legacy `/api/greetings` endpoints. The curated language metadata now loads from `backend/data/languages.json`.

### Task 2: MyMemory translation endpoint

Tests use `httpx.MockTransport` against the real request-building and response-parsing path. This avoids live network calls while covering query parameters, upstream connection and timeout failures, and malformed payloads. The endpoint uses a five-second timeout and maps all upstream failures to HTTP 502.

### Task 3: Locale-aware dropdown interface

Vitest's default discovery included the Playwright `e2e/greetings.spec.ts` file because both frameworks use `.spec` names. `frontend/vite.config.js` now limits Vitest discovery to `tests/**/*.{test,spec}.{js,jsx}`, keeping the unit and E2E runners isolated.
