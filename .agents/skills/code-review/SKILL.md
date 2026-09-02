---
name: code-review
description: Use when verifying a branch is ready for review, or whenever asked to review code quality against project conventions. Checks changed code against the domain-specific patterns defined in AGENTS.md — things lint and format cannot catch. Triggered automatically by work-complete-verification and on phrases like "review my code", "check the implementation", "is this code correct", "code review".
---

# Code review

This skill applies the domain-specific review conventions from `AGENTS.md` (Code review section) to the changed code, and cross-checks the change against the living architecture docs and ADRs. It catches things lint and format cannot: missing error handling, wrong abstraction level, inconsistent naming, architecture violations, and missed test hooks.

Read the Code review section of `AGENTS.md` before starting — it is the authoritative source for project-level conventions. The architecture docs and ADRs are the authoritative source for architectural constraints.

## 1. Identify what changed

```sh
git diff main...HEAD --stat
git diff main...HEAD -- backend/ frontend/
```

Focus on new and modified source files. Skip generated files (`docs/specs/openapi.json`, `package-lock.json`).

## 2. Check for architecture violations

Read the living architecture docs and ADRs for any area the change touches:

```sh
ls docs/architecture/
ls docs/adr/
```

Read the relevant files — not everything, only the docs that describe the components being changed. Then check the diff against them:

**Architecture docs (`docs/architecture/`)** — Do the changed components still match the described structure? Look for:
- A new external dependency introduced without updating the boundary described in `02-containers.md`
- A component that no longer matches the tree in `04-frontend.md`
- An API endpoint that differs from `03-api.md` in shape, error codes, or responsibility
- A data flow that contradicts a sequence or flowchart diagram

**ADRs (`docs/adr/`)** — Does the change contradict a recorded decision? Look for:
- Adding something an ADR explicitly rejected as an alternative
- Undoing a constraint an ADR imposed (e.g. the external API boundary, the curated language list, the test strategy)
- A new architectural choice that should itself be recorded in a new ADR — if so, flag it for `docs-create-adr` rather than silently accepting it

If a violation is found, flag it clearly: which doc or ADR is contradicted, what the change does, and what the options are. Do not silently accept architectural drift.

## 3. Review backend changes

For each changed Python file, check:

**Routes:**
- `response_model` declared on the decorator and return type annotated on the function
- All error paths use `HTTPException` — no bare exceptions escape to the client
- External HTTP calls: `httpx.AsyncClient` with a bounded timeout, wrapped and mapped to application errors
- Route logic is appropriately thin — complex logic extracted to a named helper

**Models and structure:**
- Public models, functions, and modules have docstrings
- Private helpers are commented where intent is non-obvious
- No `print` statements; logging follows project conventions

**Red flags:**
- A `try/except Exception` that swallows errors silently
- Business logic embedded in a Pydantic validator
- An external call with no timeout

## 4. Review frontend changes

For each changed JS/JSX file, check:

**Components:**
- Exported component has a JSDoc block (`@param` props, `@returns {JSX.Element}`)
- Elements that tests need to locate carry `data-testid`
- Fetch errors are caught and rendered in an element with `role="alert"` — no silent failures
- No `console.log` left in production code

**State:**
- State derived from props is not stored in `useState` — compute it instead
- Loading and error states are handled and rendered, not ignored

**Red flags:**
- A `.catch(() => {})` or empty catch block
- A component missing its JSDoc block
- A fetch with no error branch

## 5. Review general concerns

For any changed file:

- No commented-out code
- No `TODO` or `FIXME` without a linked GitHub issue number
- Naming is precise and consistent with the surrounding file
- No logic copy-pasted across files when a shared helper would serve — but flag over-extraction too

## 6. Fix or flag

For each issue found:

- **Fixable** (missing docstring, bare `console.log`, missing `data-testid`) → fix it directly.
- **Requires judgment** (wrong abstraction, inconsistent naming, missing error handling with unclear correct behavior) → flag it clearly to the user: what the issue is, where it is, and what the options are.
- **Architectural** (a pattern that contradicts the project's design) → surface it and propose a follow-up task or issue rather than patching in place.

## 7. Report

Tell the user:
- Architecture and ADR checks: violations found, flagged, or confirmed clean
- Files reviewed
- Issues found: what, where, and how each was resolved or why it was flagged
- Whether the code is ready to proceed or requires human judgment on any items

## Improving this skill

If a pattern recurs that this skill does not check for, or the conventions in `AGENTS.md` do not cover a situation encountered during review:
1. Complete the current review.
2. Surface the gap and propose a specific addition to `AGENTS.md` (Code review section) and this skill.
3. Ask for approval before applying.
