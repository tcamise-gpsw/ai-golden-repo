---
name: git-commit
description: Use when committing changes in this repository. Enforces Conventional Commits format using the project's .gitmessage template. Trigger on any request to commit, save, or record changes to git.
---

# Commit

All commits follow [Conventional Commits](https://www.conventionalcommits.org/) using the types and scopes defined in `.gitmessage`.

## Format

```
<type>(<scope>): <subject>

<body>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes:** `backend`, `frontend`, `agents`, `infra`, `docs`

Omit the scope only when a change genuinely spans all of them (e.g. initial bootstrap). Prefer the narrowest accurate scope.

**Subject:** imperative mood, lowercase, no trailing period, ≤ 72 characters total on the header line.

**Body:** required when the subject alone does not explain *why*. Separate from subject with a blank line.

## Steps

**1. Stage intentionally.**

```sh
git status --short
```

Add only the files that belong to this commit. Do not blindly stage everything unless the entire working tree is one coherent change.

**2. Write the message to a file and commit with `-F`.**

Never use `git commit -m`. Always write to a temp file:

```sh
cat > /tmp/commit-msg.txt << 'EOF'
type(scope): subject

Optional body explaining why.
EOF
git commit -F /tmp/commit-msg.txt
```

**3. Split when needed.**

If staged changes span unrelated concerns, split into separate commits. A commit should represent one coherent intent.

## Keeping .gitmessage and this skill current

`.gitmessage` is the source of truth for types and scopes. This skill reflects it. When either falls short, propose an update — but never apply one without the user's approval.

**Missing scope.** If the change doesn't fit any listed scope, do not invent one silently or omit the scope to avoid the problem. Instead:
1. Commit with the closest existing scope and note the mismatch.
2. Propose the new scope: show the exact line to add to `.gitmessage` and the corresponding update to the scope list in this skill.
3. Ask: "Should I add `<scope>` to `.gitmessage` and the commit skill?"

**Missing or wrong type.** Same process — propose the addition or correction to both `.gitmessage` and this skill, ask before applying.

**Anything else in this skill that led you wrong** — a rule that doesn't apply, a step that's missing, a better approach — resolve it, describe the gap, propose a specific edit to this file, and ask for approval.
