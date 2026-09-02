---
name: create-pr
description: Use when asked to open, create, or submit a pull request. Triggers on phrases like "open a PR", "create a PR", "submit this for review", "make a pull request". Runs work-complete-verification first, then drafts and submits the PR.
---

# Create a pull request

## 1. Verify

Invoke `work-complete-verification`. It runs the full preflight gate and documentation review. Do not proceed until it reports the branch clean.

## 2. Draft — fill the PR template

Read `.github/PULL_REQUEST_TEMPLATE.md` and write the completed body to `/tmp/pr-body.md`:

- **Summary:** one paragraph — what changed and why.
- **Changes:** intent-focused bullets grouped by area (`backend`, `frontend`, `docs`, `infra`, `agents`). Remove areas with no changes.
- **Testing:** after a clean `make preflight`, check every testing box. Only check work actually run.
- **Docs and architecture:** for every item, state what was done in the verification step or explain why it does not apply. Leave nothing blank.
- **Notes for reviewers:** non-obvious behavior, known limitations, follow-up work.

## 3. Submit

Push the branch:

```sh
git push -u origin HEAD
```

Create the PR:

```sh
gh pr create --title "type(scope): subject" --body-file /tmp/pr-body.md
```

Title follows Conventional Commits format (see `git-commit` skill). Always use `--body-file`; never inline `--body`. Report the PR URL to the user.

## Improving this skill

If the draft template doesn't fit a change, or the submit step fails:
1. Finish the immediate PR work.
2. Surface the gap and propose a specific edit to this file or `.github/PULL_REQUEST_TEMPLATE.md`.
3. Ask for approval before applying.
