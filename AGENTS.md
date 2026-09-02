# AI Agent Guide

## Project summary

This repository is a deliberately trivial multilingual Hello World app — a Python/FastAPI backend and a React/Vite frontend — used as a reference implementation for AI-assisted development patterns at GoPro. The application is not the point; the infrastructure around it is. Read [README-META.md](README-META.md) for the full rationale.

## Repo layout

```text
.
├── backend/              # FastAPI service (port 8000)
├── frontend/             # React/Vite application (port 5173 in dev)
├── docker/               # Production nginx configuration
├── docs/                 # Documentation (architecture, ADRs, specs, plans)
├── .agents/skills/       # Project-local agent skills
├── docker-compose.yml    # Production service composition
├── Makefile              # Unified command surface — run `make` to see all goals
└── README.md             # End-user setup and usage
```

## Docs-as-code

This project follows a doc-as-code discipline: documentation is versioned with the code and kept in sync with it. Read [docs/README.md](docs/README.md) before making any documentation changes — it defines what goes where, which docs are living versus point-in-time, and the conventions for diagrams, links, and prose.

Short version: `docs/architecture/` and `docs/adr/` are living and must stay current; `docs/plans/` is historical and is never edited after work ships.

## Working flows

### Normal work

For most changes — adding a language, fixing a bug, updating a component — run the relevant test layer after editing and verify it passes. No running services required.

```sh
make test-backend    # after any backend change
make test-frontend   # after any frontend change
```

Run both when a change touches the boundary between them.

### Full dev loop

When a change requires observing live behavior — a rendering issue, a hot-reload edge case, a bug visible only in the browser — use the `dev-loop` skill. It covers starting services, tailing logs, editing with hot-reload active, verifying in the browser, and running targeted tests. Invoke it rather than improvising the steps.

### AI-generated plans

For larger or design-heavy work, capture the plan before implementing:

1. Create `docs/plans/NNN-<name>/` with `design.md` (what and why) and `plan.md` (tasks and sequencing). Add `notes.md` for append-only findings during the work.
2. Implement against the plan.
3. When the work ships, use the `docs-absorb-plan` skill to fold durable content into `docs/architecture/` and `docs/adr/`. The plan files stay as a historical record and are not modified.

See [docs/README.md](docs/README.md) for the full plan lifecycle.

## Tests

*Test conventions to be defined.*

Three layers exist: backend unit (pytest), frontend unit (Vitest + RTL), and E2E (Playwright). Each is runnable independently:

```sh
make test-backend    # pytest
make test-frontend   # Vitest
make test-e2e        # Playwright — requires both services running
```

## Code comments

**Docstrings and JSDoc on all non-private symbols.** Every public Python function, class, and module carries a docstring. Every exported React component carries a JSDoc block. These feed the generated API reference (`make openapi`, docstrings, JSDoc) and are not optional.

**Private symbols: comment when the intent is not obvious from the name and body alone.** A private helper that encodes a non-obvious invariant, works around a library quirk, or has a precondition the caller must satisfy needs a comment. One that does exactly what its name says does not.

**Inline comments: add only when the code cannot speak for itself.** A comment is valuable when it explains:
- *Why* — a choice that looks wrong or surprising (`# casefold not lower: handles Unicode titlecase`)
- *Precondition or invariant* — a constraint the reader needs to know to safely modify the code
- *Non-obvious consequence* — a side effect or coupling not visible at the call site

A comment is not valuable when it restates what the code already says, narrates obvious control flow, or pads for coverage.

**No commented-out code.** Dead code lives in git history, not in the source.
