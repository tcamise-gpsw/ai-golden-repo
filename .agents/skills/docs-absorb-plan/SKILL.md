---
name: docs-absorb-plan
description: Use this skill when a plan in docs/plans/ has shipped and its durable content needs to fold into the living docs. Trigger on phrases like "absorb the plan", "the plan shipped", "fold this into the docs", "close out the plan", or when a feature is complete and docs/plans/NNN-name/ exists for it. Also use when asked to update architecture docs or write ADRs after a significant change lands.
---

# Absorb a Shipped Plan into Living Docs

Plans are point-in-time records — they are not kept in sync after work ships. The durable content lives on in `docs/architecture/` (structure) and `docs/adr/` (decisions). This skill does that transfer.

The plan files are never deleted or modified. They become historical the moment the work ships.

## 1. Read the plan

Read all files present in `docs/plans/NNN-<name>/`:

- `design.md` — what was built and why; the intended architecture
- `plan.md` — the task breakdown and sequencing
- `notes.md` — append-only findings made during the work; often contains the most important surprises

Notes take priority when they contradict design.md — they reflect what actually happened.

## 2. Triage: structure vs. decision vs. neither

For each meaningful piece of content, classify it:

| Type | Destination |
|---|---|
| How the system is now structured, or how a component works | `docs/architecture/` |
| A significant decision that was made, with alternatives considered | `docs/adr/` (new ADR) |
| Implementation detail that belongs in code comments or docstrings | Source files |
| Task sequencing, intermediate states, abandoned approaches | Historical only — stays in the plan |

When uncertain, ask. Absorbing noise into living docs creates rot.

## 3. Update architecture docs

For each structural change the plan introduced:

- Identify the relevant `docs/architecture/` file(s).
- Update or extend the affected sections. Add Mermaid diagrams where the structure changed visibly.
- If the change adds a new subsystem with no existing architecture doc, create a new numbered file at the end of the reading order.
- Follow the conventions in `docs/README.md`: no counts, no copy-pasted signatures, real markdown links, one source of truth.

Do not create a new architecture doc for changes that fit naturally into an existing one.

## 4. Write ADRs for decisions

For each decision surfaced in the plan that:
- Affected system structure, **and**
- Was costly to reverse, or had multiple viable options

Use the `docs-create-adr` skill (or follow its steps inline) to write the ADR. Cross-link the new ADR to the architecture doc(s) it affects, and add reciprocal links back.

Not every plan warrants a new ADR. A plan that implemented a decision already recorded in an existing ADR needs no new one — just verify the existing ADR is still accurate.

## 5. Check existing ADRs

Scan `docs/adr/` for any ADR that the shipped work supersedes or makes stale. If found:
- Do not edit the old ADR.
- Write a new ADR that supersedes it, referencing the old one.
- Update the old ADR's status line to `Superseded by ADR-NNNN`.

## 6. Update the docs map

If new architecture files or ADRs were created, update:
- The reading-order table in `docs/README.md` (architecture section)
- The index table in `docs/adr/README.md`

## 7. Verify no dead links

After all edits, check that every cross-reference you touched resolves to a real file. Pay particular attention to links between architecture docs and ADRs — these are the most commonly broken by absorption work.

## 8. Report to the engineer

Summarise what changed:
- Architecture docs updated (which files, what changed)
- ADRs written (numbers and titles)
- Anything left in the plan that was intentionally not absorbed, and why

## Improving this skill

If the plan's structure differs from `design.md / plan.md / notes.md` (e.g. a single-file plan or a different naming convention), adapt and note the variation. If the triage categories above don't cover a content type you encounter, resolve it, surface the gap, and propose a specific update to this file. Ask before applying.
