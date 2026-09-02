---
name: docs-refresh
description: Use when asked to audit, refresh, or sweep the documentation for the whole repository — not just a branch. Finds inaccuracies in living docs, removes useless content, identifies missing documentation, and folds in any shipped plans. Triggers on phrases like "refresh the docs", "sweep the docs", "doc audit", "clean up docs", "are the docs current", "fold in the plans".
---

# Docs refresh

This skill audits the repository's documentation as a whole — not scoped to a branch. Run it periodically, after a significant amount of work has accumulated on main, or when docs feel stale.

It is distinct from the branch-scoped documentation review in `work-complete-verification`. That checks docs for a specific change before a PR; this checks the repo health globally.

---

## 1. Fold in shipped plans

Check `docs/plans/` for plans whose work has landed.

```sh
ls docs/plans/
```

For each plan directory, determine whether the work has shipped:
- Is the feature present in the codebase (source files, routes, components)?
- Are the commits referenced in the plan merged to main?

For every shipped plan, invoke `docs-absorb-plan`. That skill handles moving durable content into `docs/architecture/` and `docs/adr/` and leaves the plan files as a historical record.

Leave unshipped plans untouched.

---

## 2. Check living docs for inaccuracies

Read every living doc: `docs/architecture/`, `docs/adr/`, `AGENTS.md`, `README.md`, `README-project.md`, `docs/README.md`.

For each doc, verify:

**File and path references** — every path mentioned (`backend/data/greetings.json`, `frontend/src/components/GreetingList.jsx`) exists on disk. Dead paths are inaccurate; update or remove them.

**Commands** — every `make X` target mentioned exists in the `Makefile`. Every `gh`, `pytest`, `npm` command reflects the current project setup.

**API endpoints** — endpoints mentioned in architecture docs match `docs/specs/openapi.json`. Check routes in both directions: docs mention routes that exist, and significant routes in the spec are mentioned in docs.

**Component and symbol names** — class, function, and component names mentioned in docs exist in the codebase. Renamed or deleted symbols leave docs with false claims.

**Mermaid diagrams** — data flows and component trees match the current architecture. A diagram showing a removed component or a missing external dependency is inaccurate.

Fix inaccuracies in place. If a section can no longer be stated accurately without a full rewrite, flag it to the user rather than leaving false content.

---

## 3. Remove useless content

The `docs/README.md` conventions apply: docs must earn their words. Flag or remove:

- **Counts of things in code** — "there are N routes" or "the app supports N languages" will be wrong as soon as anything changes. Replace with a link to the source of truth.
- **Exhaustive lists that duplicate code** — if a doc lists every field of a model, it is re-stating what docstrings and the OpenAPI spec already say. Replace with a link.
- **Narrated obvious facts** — sentences that restate what the code name already communicates.
- **Stale rationale** — "we chose X because Y" where X is no longer true. If the decision is worth preserving, it belongs in an ADR; otherwise remove it.

Do not remove content that explains *why* — reasoning that would otherwise be lost belongs in the doc or an ADR.

---

## 4. Identify missing docs

**Architecture changes without docs** — compare the current codebase structure to `docs/architecture/`. New components, API boundaries, or data flows that have no corresponding architecture coverage should be added.

**Decisions without ADRs** — if the codebase contains significant, hard-to-reverse patterns with no ADR recording why (e.g. a non-obvious tech choice, a deliberate constraint), note it and propose an ADR. Use `docs-create-adr` if one is clearly warranted.

**Public symbols without docstrings or JSDoc** — spot-check new or recently changed public Python functions, classes, and exported React components. Flag missing docstrings; add them if straightforward, ask the user if scope is unclear.

---

## 5. Report and commit

Summarise what changed:

- **Plans absorbed:** which plans were folded in and what content moved where
- **Inaccuracies fixed:** what was wrong and how it was corrected
- **Content removed:** what was removed and why
- **Gaps found:** what is missing, whether it was added or flagged for the user
- **Nothing found:** if docs are healthy, say so explicitly

Commit corrections using `git-commit`. Group logically: one commit for absorbed plans, one for accuracy fixes, one for removals — do not mix concerns in a single commit if they are substantial.

---

## Improving this skill

If a class of inaccuracy recurs that this skill does not check for, or the sweep misses a category of missing docs:
1. Complete the current sweep.
2. Surface the gap and propose a specific addition to this skill.
3. Ask for approval before applying.
