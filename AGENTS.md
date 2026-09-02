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

Development happens in **dev mode** by default (`make dev` — uvicorn + Vite with hot reload). Assume services are running unless instructed otherwise. Use `make prod` only when explicitly asked to work against the production stack.

### Normal work

For most changes — fixing a bug, updating a component, editing data — edit the source, run the relevant test layer, verify it passes.

```sh
make test-backend    # after any backend change
make test-frontend   # after any frontend change
```

Run both when a change crosses the backend/frontend boundary.

### Full dev loop

When a change requires observing live behavior — a rendering issue, a bug visible only in the browser, a hot-reload edge case — use the `dev-loop` skill. It covers starting services if needed, tailing logs, editing, verifying in the browser, and running targeted tests. Invoke it rather than improvising the steps.

### AI-generated plans

For larger or design-heavy work, capture the plan before implementing:

1. Create `docs/plans/NNN-<name>/` with `design.md` (what and why) and `plan.md` (tasks and sequencing). Add `notes.md` for append-only findings during the work.
2. Implement against the plan.
3. When the work ships, use the `docs-absorb-plan` skill to fold durable content into `docs/architecture/` and `docs/adr/`. The plan files stay as a historical record and are not modified.

See [docs/README.md](docs/README.md) for the full plan lifecycle.

## Tests

Three layers, each runnable independently:

```sh
make test-backend    # pytest
make test-frontend   # Vitest
make test-e2e        # Playwright — requires both services running
```

### Coverage

Strive for maximum coverage where valuable tests can be written. A test is valuable when it:

- Verifies observable behavior that would fail silently if broken
- Exercises a boundary, edge case, or invariant the happy path doesn't reach
- Catches a real class of bug — not a failure mode that cannot occur
- Documents expected behavior that is non-obvious from the code

A test is not valuable — and should not be written — when it:

- Tests implementation details rather than behavior (internal call counts, private method state)
- Duplicates an existing test without adding a new scenario
- Would pass regardless of whether the feature works correctly
- Exists only to satisfy a coverage metric

High coverage from valuable tests is the goal. High coverage from useless tests is worse than lower coverage, because it creates maintenance cost without safety.

### Test requirements and production code

Test requirements must not drive the shape of production code. Do not add hooks, seams, or escape hatches to production code solely to make it testable.

Production code should, however, be architected with testability as a natural quality: dependencies injected rather than hardcoded, logic separated from I/O, side effects isolated at boundaries. This is good design independently of tests — testability is a consequence, not the goal.

When a piece of production code is genuinely hard to test, treat it as a design signal rather than a reason to work around it.

### Deleting tests

Never delete a test without explicit permission from the user. If a test appears redundant, broken, or misguided, flag it and explain why — do not remove it unilaterally.


## Linting and formatting

All code must pass lint and format checks before committing. Run the check-only target to see issues without changing files, or the fix target to apply automatic corrections:

```sh
make lint        # check — no changes written
make lint-fix    # auto-fix what can be fixed
```

**Backend (Python):** [Ruff](https://docs.astral.sh/ruff/) handles both linting and formatting. Configuration lives in `backend/pyproject.toml` under `[tool.ruff]`.

**Frontend (JS/JSX):** [ESLint](https://eslint.org/) for lint rules, [Prettier](https://prettier.io/) for formatting. Configuration lives in `frontend/eslint.config.js` and `frontend/.prettierrc.json`.

Run `make lint` before committing. If `make lint-fix` cannot resolve an issue automatically, fix it manually — do not suppress or disable rules without explicit user approval.

## Code comments

**Docstrings and JSDoc on all non-private symbols.** Every public Python function, class, and module carries a docstring. Every exported React component carries a JSDoc block. These feed the generated API reference (`make openapi`, docstrings, JSDoc) and are not optional.

**Private symbols: comment when the intent is not obvious from the name and body alone.** A private helper that encodes a non-obvious invariant, works around a library quirk, or has a precondition the caller must satisfy needs a comment. One that does exactly what its name says does not.

**Inline comments: add only when the code cannot speak for itself.** A comment is valuable when it explains:
- *Why* — a choice that looks wrong or surprising (`# casefold not lower: handles Unicode titlecase`)
- *Precondition or invariant* — a constraint the reader needs to know to safely modify the code
- *Non-obvious consequence* — a side effect or coupling not visible at the call site

A comment is not valuable when it restates what the code already says, narrates obvious control flow, or pads for coverage.

**No commented-out code.** Dead code lives in git history, not in the source.
