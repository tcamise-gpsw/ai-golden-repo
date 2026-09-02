---
name: create-pr
description: Use when asked to open, create, or submit a pull request. Also use when work on a branch is complete and needs to go through review. Triggers on phrases like "open a PR", "create a PR", "submit this for review", "make a pull request".
---

# Create a pull request

Own the workflow in order: gate, document, draft, then submit. A PR is ready only when the full gate passes and its documentation reflects the branch.

## 1. Gate — run the full preflight

Run:

```sh
make preflight
```

It must pass completely before opening a PR.

- For lint or formatting failures, invoke `lint-and-fix`.
- For test failures, invoke `test-and-fix`.
- When failures span both, invoke each relevant skill.

Rerun `make preflight` after fixes and continue until it exits clean. Do not proceed with a failing preflight.

## 2. Document — review the branch changes

Review the branch against `main` before writing the PR body:

```sh
git diff main...HEAD --stat
git diff main...HEAD
```

For every meaningful change, decide:

1. **System structure:** Did it add a component, change an API boundary, or introduce a data flow? Update the relevant `docs/architecture/` file.
2. **Hard-to-reverse decision:** Were viable alternatives considered for a significant decision? Invoke `docs-create-adr` to write an ADR.
3. **Public API documentation:** Does every new public Python function or class have a docstring, and does every new exported React component have JSDoc? Add what is missing.
4. **Deferred work:** Does follow-up work need a GitHub issue? Surface it and create or link the issue when authorized.

Do not absorb material from `docs/plans/`; that is a manual, user-initiated process.

If documentation or an ADR is needed, make the updates and invoke `git-commit` to commit them before drafting the PR.

## 3. Draft — fill the PR template

Read `.github/PULL_REQUEST_TEMPLATE.md` and write the completed body to `/tmp/pr-body.md`. Fill every section:

- **Summary:** One paragraph explaining what changed and why.
- **Changes:** Intent-focused bullets grouped by `backend`, `frontend`, `docs`, `infra`, or `agents`. Remove areas with no changes.
- **Testing:** After a clean `make preflight`, check every testing box. Check only work actually run.
- **Docs and architecture:** For every item, confirm the Phase 2 action or explain why it does not apply. Leave nothing blank.
- **Notes for reviewers:** State non-obvious behavior, known limitations, and follow-up work.

## 4. Submit

Push the current branch:

```sh
git push -u origin HEAD
```

Create the PR from the completed body file:

```sh
gh pr create --title "type(scope): subject" --body-file /tmp/pr-body.md
```

Use a Conventional Commits title as defined by `git-commit`. Pass the body with `--body-file`; never use inline `--body`. Report the resulting PR URL to the user.

## Improving this skill

When the Phase 2 review misses a class of change, or a PR-template section does not fit this project:

1. Finish the immediate PR work first.
2. Surface the gap, why the current guidance failed, and how it affected the PR.
3. Propose the exact update to `.agents/skills/create-pr/SKILL.md` and, when relevant, `.github/PULL_REQUEST_TEMPLATE.md`.
4. Ask for approval before applying it.

Each deviation should make the PR workflow more reliable without interrupting the work at hand.
