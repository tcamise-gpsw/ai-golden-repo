---
name: create-github-issue
description: Use when asked to create a GitHub issue, or when work surfaces a bug, deferred task, or follow-up that falls outside the current scope. Triggers on phrases like "open an issue", "track this", "file a bug", "create a ticket", or when the PR template's GitHub Issues section requires an issue to be created.
---

# Create a GitHub issue

Issues track bugs not fixed in the current task, work deferred from a PR, and scope that exceeds the task boundary. Never create an issue without user authorization unless the user has already granted it in the current conversation.

## 1. Decide whether an issue is warranted

Create an issue when:
- A bug is found whose fix falls outside the current task's scope
- The PR template's GitHub Issues section surfaces deferred follow-up
- Scope creep is identified and the user explicitly wants it tracked

Do **not** create an issue for:
- Work already captured in the current task or PR
- Hypothetical bugs with no concrete evidence
- Implementation todos that should be tracked in code comments

## 2. Choose the right template

| Situation | Template to use |
|---|---|
| Something is broken | Bug report |
| Work deferred from a PR | Deferred work |
| New capability requested | Feature request |

### Bug report

```
**Describe the bug**
A clear description of what is wrong and what was expected.

**Steps to reproduce**
1. ...
2. ...

**Environment**
- Branch / commit:
- Python / Node version:

**Additional context**
Logs, screenshots, or related code.
```

### Deferred work

```
**Context**
Why this work was identified and what PR or task surfaced it.

**What needs to happen**
A concrete description of the work — specific enough to act on.

**Why deferred**
Why this was not resolved in the originating task.
```

### Feature request

```
**Problem**
What problem this feature solves.

**Proposed solution**
What the feature would look like.

**Alternatives considered**
What else was evaluated.
```

## 3. Choose labels

Apply at least one label. Use the narrowest accurate label.

| Label | When |
|---|---|
| `bug` | Something is not working as intended |
| `enhancement` | New capability or improvement |
| `deferred` | Work intentionally deferred from another task |
| `needs-investigation` | Root cause or scope is not yet understood |
| `good-first-issue` | Well-scoped, low-risk; suitable for onboarding |

## 4. Write the issue

Fill the template with specific, actionable content. Vague issues create noise. Titles should be imperative and concrete.

Good: `Translate endpoint returns HTTP 200 with untranslated text for identical language pairs`
Bad: `Translation doesn't work sometimes`

## 5. Create via the CLI

Write the body to a temp file and create with `gh`:

```sh
gh issue create \
  --title "imperative title here" \
  --body-file /tmp/issue-body.md \
  --label "bug" \
  --assignee "@me"
```

Include `--assignee "@me"` unless the user specifies otherwise. Report the resulting issue URL.

## Improving this skill

If a label is missing from the taxonomy above, or a situation arises that none of the templates cover:
1. Create the issue using the closest available template and label.
2. Surface the gap and propose an addition to this file.
3. Ask for approval before updating the skill.
