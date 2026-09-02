---
name: test-and-fix
description: Use when tests are failing — triggered by make test-backend, make test-frontend, make test-e2e, or make preflight reporting failures. Also use when asked to fix a broken test suite or make tests pass.
---

# Test and fix

## 1. Isolate the failure

Run the narrowest failing layer first:

```sh
make test-backend   # Python/API failures
make test-frontend  # component failures
make test-e2e       # full-stack failures
```

Read the error output carefully. Distinguish between a test correctly catching a regression (fix the code) and a test that is itself wrong (rare — flag it to the user before touching it).

## 2. Diagnose

For each failing test, determine:

- What behavior does the test expect?
- What is the code actually doing?
- Is this a code bug, a stale test, or an environment issue?

Never assume a test is wrong without evidence. The test is the contract.

## 3. Fix

Fix the production code to satisfy the test. Do not modify a test to make it pass unless the test is genuinely incorrect — and even then, flag it to the user and get explicit approval before changing it.

Never delete a test. This is a hard rule with no exceptions.

## 4. Verify

Re-run the specific failing layer. Then run `make preflight` to confirm nothing else regressed.

## 5. E2E-specific notes

E2E tests require live services. Playwright auto-starts them through the `webServer` config in `playwright.config.ts`. In CI, set `CI=true` so services always start fresh. If services fail to start, check the command in `playwright.config.ts` and ensure backend dependencies are installed.

## Improving this skill

This skill evolves through use. If a test-failure pattern recurs that this skill does not cover:

1. **Resolve first.** Fix the immediate failure; do not block on improving the skill.
2. **Surface the gap.** Tell the user what recurred and why the current guidance was insufficient.
3. **Propose a concrete update.** Draft the specific addition to `.agents/skills/test-and-fix/SKILL.md` that would cover it.
4. **Ask for approval.** Apply the update only after the user explicitly approves it.
