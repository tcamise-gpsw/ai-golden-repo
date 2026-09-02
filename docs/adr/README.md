# Architecture Decision Records

An ADR records a single architecturally significant decision and why it was made — a durable
answer to "why is it built this way?" that outlives the discussion that produced it.

## When to write one

Write an ADR when a decision:

- affects system structure, **and**
- is costly to reverse, **or** had multiple viable options worth remembering.

Do **not** write ADRs for reversible or cosmetic choices, or for anything a short
[`architecture/`](../architecture/) note already captures.

## Rules

- **Numbering** — zero-padded, chronological, append-only (`0001-short-slug.md`,
  `0002-short-slug.md`, …). Never renumber; the number is an ADR's permanent identity. This is
  distinct from the reading-order numbering in [`architecture/`](../architecture/).
- **Status lifecycle** — `Proposed` → `Accepted` → (`Deprecated` | `Superseded by ADR-NNNN`).
- **Immutable after acceptance.** To change a decision, write a new ADR that supersedes the old
  one; do not rewrite history. Small corrections may be appended as a dated note.
- **Cross-link** each ADR to the [`architecture/`](../architecture/) sections it affects, and
  link back from those sections.

## Index

| ADR | Title | Status |
|---|---|---|
| [ADR-0001](0001-translations-from-external-api.md) | Translations come from an external API | Accepted |

## Template

Copy this into `NNNN-short-slug.md` and fill it in:

```markdown
# ADR-NNNN: <short decision title>

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Deciders:** <who was in the room>

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