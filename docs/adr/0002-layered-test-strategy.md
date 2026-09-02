# ADR-0002: Three-layer test strategy: pytest, Vitest, Playwright

- **Status:** Accepted
- **Date:** 2025-09-02
- **Deciders:** GoPro AI golden-repo team

## Context

The application has a Python backend and a React frontend. Tests need to cover backend logic,
frontend rendering, and the full integrated stack. AI agents need to run the narrowest test that
covers a change to get fast feedback.

## Decision

We will maintain three independent test layers: backend unit tests using pytest and httpx,
frontend unit tests using Vitest and React Testing Library, and end-to-end tests using Playwright.
Each layer will be runnable through a single `make` target.

## Consequences

- Isolated changes receive fast feedback, end-to-end tests are reserved for full-stack validation,
  and each layer can fail independently.
- Three test toolchains must be maintained, and end-to-end tests require both services to be
  running.

## Alternatives considered

- **Backend and end-to-end tests only.** Rejected because frontend component regressions would not
  have an isolated test layer.
- **A single end-to-end suite only.** Rejected because it would be slow, require services to run for
  every change, and mask which layer introduced a failure.
- **Jest instead of Vitest.** Rejected because it is a heavier setup for a Vite project, while
  Vitest integrates with the existing Vite configuration.

## Related documentation

- [Containers — test targets by container](../architecture/02-containers.md)