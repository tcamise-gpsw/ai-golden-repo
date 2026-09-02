---
name: work-complete-verification
description: Use before marking any work complete, before opening a PR, or whenever asked to verify a branch is ready. Runs the full preflight gate, reviews docs for completeness, and commits any corrections. Triggers on phrases like "verify my work", "is this ready", "check before PR", "run preflight", or as a first step inside create-pr.
---

# Work-complete verification

Run this before declaring work done or opening a PR. It owns four concerns in order: the technical gate, coverage audit, logging audit, then documentation review.

## 1. Gate — make preflight

```sh
make preflight
```

`make preflight` runs lint, format, and all three test layers. It must exit clean before proceeding.

- Lint or format failures → invoke `lint-and-fix`
- Test failures → invoke `test-and-fix`
- Re-run `make preflight` after fixes; repeat until clean

Do not move to the coverage audit while the gate is failing.

## 2. Coverage audit

Invoke `audit-and-fix-test-coverage`. It diffs the branch, assesses coverage across all three test layers, writes any missing valuable tests, and verifies they pass before proceeding.

Do not move to the logging audit while coverage gaps remain unaddressed.

## 3. Logging audit

Invoke `audit-and-fix-logging`. It diffs the branch, checks that new and changed code carries appropriate logging at the right levels, adds what is missing, and verifies tests still pass.

Do not move to the documentation review while logging gaps remain unaddressed.

## 4. Documentation review

Diff the branch against `main`:

```sh
git diff main...HEAD --stat
git diff main...HEAD
```

For every meaningful change, work through these four checks:

**Structure** — Did the change add a component, modify an API boundary, or alter a data flow? If so, update the relevant `docs/architecture/` file. Living docs move with the code.

**Decision** — Was a significant, hard-to-reverse decision made with alternatives considered? If so, invoke `docs-create-adr`. Not every change warrants an ADR — only decisions that are architecturally significant and costly to reverse.

**Public API documentation** — Does every new public Python function or class carry a docstring? Does every new exported React component carry a JSDoc block? Add what is missing.

**Deferred work** — Does follow-up work surface that this branch does not resolve? Flag it to the user; create or link a GitHub issue when authorized.

Do not absorb content from `docs/plans/` — that is a separate, user-initiated process via `docs-absorb-plan`.

If any of these checks result in changes, commit them using `git-commit` before the verification is considered complete.

## 4. Report

- Gate: passed / what failed and how it was fixed
- Coverage: what gaps existed, what was written, what was skipped and why
- Logging: what was added, what was removed, and why
- Docs: what was updated, what ADRs were written, what was flagged
- Whether the branch is ready to proceed (PR or further work)

## Improving this skill

If a check in the documentation review misses a class of change, or the gate reveals a failure mode not covered:
1. Finish the immediate verification.
2. Surface the gap and what it caused.
3. Propose a specific edit to this file.
4. Ask for approval before applying it.
