---
name: audit-and-fix-logging
description: Use when verifying a branch is ready for review, after implementing a feature or fix, or whenever asked to check logging coverage. Audits whether new and changed code carries appropriate logging, adds what is missing, and verifies nothing broke. Triggered automatically by work-complete-verification and on phrases like "check logging", "add logging", "audit logs", "is logging adequate".
---

# Audit and fix logging

Logging is a first-class design concern. Every meaningful entry point, state transition, and failure path should produce a log at the appropriate level. Read the logging conventions in `AGENTS.md` (Logging section) before auditing.

## 1. Identify what changed

```sh
git diff main...HEAD -- backend/ frontend/
```

For each new or modified function, route, and component, determine whether it produces appropriate log output.

## 2. Assess coverage by layer

### Backend — Python `logging` module

**Setup pattern:**
```python
import logging
log = logging.getLogger(__name__)
```

**What should be logged:**

| Situation | Level | Example |
|---|---|---|
| Service or component starts | `info` | `log.info("Translation service ready; %d languages loaded", n)` |
| Request received (non-trivial routes) | `info` | `log.info("Translating greeting for language code %s", code)` |
| External service called | `debug` | `log.debug("Calling MyMemory API: langpair=en|%s", code)` |
| External response received | `debug` | `log.debug("MyMemory responded in %.2fs", elapsed)` |
| Expected error (e.g. 404) | `warning` | `log.warning("Unknown language code requested: %s", code)` |
| Upstream/unexpected failure | `error` | `log.error("MyMemory request failed: %s", exc)` |
| High-frequency or very low-level detail | `verbose` | use sparingly; only when debug is too noisy |

**What not to log:**
- The full request or response body unless debugging a specific issue (PII risk, log volume)
- Information already captured by uvicorn's access log (method, path, status)
- Redundant messages that repeat what the caller already logs

### Frontend — console API

**What should be logged:**

| Situation | Method | Example |
|---|---|---|
| Key app lifecycle event | `console.log` | `console.log('Languages loaded:', languages.length)` |
| Degraded but recoverable state | `console.warn` | `console.warn('Locale not matched; defaulting to English')` |
| Fetch failure or unhandled error | `console.error` | `console.error('Failed to load translation:', error)` |

**What not to log:**
- Every render (too noisy)
- Successful fetch responses in full (PII risk, volume)
- Debug calls left in from development — remove them before committing

## 3. Fix gaps

For each gap:
- **Missing info-level entry** at a route or key function → add it.
- **Missing error log** in a catch block → add it.
- **Excessive logging** (every iteration, full payloads) → remove or reduce to debug/verbose.
- **`print` in Python or development `console.log` in frontend** → replace with the appropriate logger call.

Add directly to the source file. Follow the existing import and variable-naming conventions.

## 4. Verify

Run the affected test layer to confirm logging additions compile and existing tests still pass:

```sh
make test-backend    # after backend changes
make test-frontend   # after frontend changes
```

Do not write tests specifically for log calls — log output is implementation detail. Tests should verify behavior, not that a specific string was logged.

## 5. Report

Tell the user:
- Which files were audited
- What was added, what was removed, and why
- Whether logging coverage is now adequate to proceed

## Improving this skill

If a logging pattern recurs that this skill does not cover, or the level guidance does not fit a situation:
1. Apply the closest available guidance.
2. Surface the gap and propose a specific addition to this skill.
3. Ask for approval before applying.
