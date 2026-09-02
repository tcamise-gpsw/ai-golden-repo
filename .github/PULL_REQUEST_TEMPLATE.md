## Summary

<!-- One paragraph: what changes and why. -->

## Changes

<!-- Bullet list grouped by area. Focus on intent, not mechanics — the diff shows the mechanics. -->

- **backend** —
- **frontend** —
- **docs** —
- **infra** —
- **agents** —

<!-- Remove areas that did not change. -->

## Testing

<!-- Every checked item must have been actually run. -->

- [ ] `make lint`
- [ ] `make format`
- [ ] `make test-backend`
- [ ] `make test-frontend`
- [ ] `make test-e2e`
- [ ] `make preflight` (full pass)

## Docs and architecture

<!-- docs/README.md rule: a change is not done until the docs that describe it are current.
     For each item, confirm it was updated or explain why it does not apply. Do not leave blank. -->

**`docs/architecture/`** — updated if any structure changed (new component, API boundary change, data flow change, etc.).
- [ ] Updated / not applicable because: <!-- explain -->

**`docs/adr/`** — required when a decision is architecturally significant and costly to reverse, or had multiple viable options worth remembering.
- [ ] Added ADR-NNNN / not applicable because: <!-- explain -->

**Docstrings and JSDoc** — every new public Python function, class, or module has a docstring; every new exported React component has a JSDoc block.
- [ ] All new public symbols documented / not applicable because: <!-- explain -->

**GitHub Issues** — deferred work surfaced by this PR but not resolved must be tracked in the backlog.
- [ ] Added / linked #NN / not applicable because: <!-- explain -->

## Notes for reviewers

<!-- Anything to focus on, known limitations, or follow-up work. -->
