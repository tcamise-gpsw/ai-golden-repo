---
name: docs-create-adr
description: Use this skill whenever a significant architectural decision needs to be recorded — a new dependency, a pipeline boundary change, a data-storage choice, a test strategy decision, or any choice that is costly to reverse or had multiple viable options. Trigger on phrases like "write an ADR", "record this decision", "should we ADR this", or whenever structural changes ship that lack a decision record. When in doubt, write the ADR.
---

# Create an Architecture Decision Record

ADRs are append-only and immutable. The goal is a durable, honest record of what was decided and why — not a justification document. Write for a reader who wasn't in the room.

## 1. Determine the next ADR number

List `docs/adr/` and find the highest `NNNN` prefix among existing ADR files. The new ADR is `NNNN+1`, zero-padded to four digits.

```sh
ls docs/adr/*.md | grep -oE '[0-9]{4}' | sort | tail -1
```

## 2. Gather context

Before writing, you need:

- **The decision** — what was chosen, in one unambiguous sentence.
- **The context** — what problem or constraint forced this decision. Facts and pressures, not the solution.
- **Alternatives** — every option that was genuinely on the table, and the specific reason each was rejected.
- **Consequences** — what becomes easier and what becomes harder; new obligations or risks.
- **Affected architecture docs** — which files in `docs/architecture/` describe the parts of the system this decision touches.

If any of these are unclear, ask before writing. A vague ADR is worse than no ADR.

## 3. Choose a slug

The filename slug is lowercase, hyphen-separated, and describes the decision in 3–6 words:

- Good: `0003-sqlite-session-store`, `0002-layered-test-strategy`
- Avoid: `0003-decision`, `0003-we-chose-sqlite-because-of-reasons`

## 4. Write the ADR

Create `docs/adr/NNNN-<slug>.md` using this template exactly:

```markdown
# ADR-NNNN: <short decision title>

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Deciders:** <who was involved>

## Context

The forces at play: the problem, constraints, and requirements that make this decision
necessary. State facts and pressures, not the choice itself.

## Decision

The change being made, in the active voice: "We will …". Be specific and unambiguous.

## Consequences

What becomes easier and what becomes harder as a result — new obligations, risks, and
follow-on work included. Cover the good and the bad honestly.

## Alternatives considered

Each option that was genuinely on the table, and why it was not chosen.
```

Status starts as `Proposed`. Change to `Accepted` only after the decision is confirmed — either explicitly by the engineer or because the work has already shipped.

## 5. Update the index

Add a row to the index table in `docs/adr/README.md`:

```markdown
| [ADR-NNNN](NNNN-<slug>.md) | <short title> | Proposed |
```

Keep the table sorted by ADR number.

## 6. Cross-link

In the new ADR, add a `## Related documentation` section linking to any `docs/architecture/` pages the decision affects.

In those architecture pages, add a back-link to the ADR where the relevant section appears. Use real markdown links; do not use bare paths in backticks.

## 7. Accept or defer

If the decision has already shipped and is not in question, change status to `Accepted` before committing. If it is still under discussion, leave it as `Proposed` and note that in your response to the engineer.

## Improving this skill

If you encounter a situation this skill doesn't handle — a decision type with an unusual template, a cross-link pattern that doesn't fit — resolve it, surface the gap, and propose a specific update to this file. Ask the engineer before applying.
