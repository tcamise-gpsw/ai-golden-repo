> **Note:** In a typical project this would be the root `README.md`. In this repo it lives at `README-project.md` because `README.md` is reserved for the AI infrastructure overview — the primary purpose of `ai-golden-repo`. See [README.md](README.md) for that context.

# Hello World — Multilingual

A React and FastAPI app that translates "Hello, World!" into a selected language. The browser locale determines the default; a dropdown lets you switch between ten supported languages.

## Prerequisites

- Python 3.12+, pip
- Node 20+, npm
- Docker + Docker Compose (prod only)
- Playwright browsers: `npx playwright install` (for E2E)

## Running the app

Install dependencies once:

```bash
make install
```

**Development** — hot-reloading services on `:8000` (backend) and `:5173` (frontend):

```bash
make dev
```

App available at http://localhost:5173. API reference at `make openapi-preview`.

**Production** — optimised build served by nginx on `:80`:

```bash
make build
make prod    # Ctrl-C to stop, or: make down
```

## Testing

Three independent layers; run the narrowest one that covers your change:

```bash
make test-backend   # pytest
make test-frontend  # Vitest
make test-e2e       # Playwright (starts required services automatically)
make preflight      # lint + format + all three layers — the full CI gate
```

## Make targets

Run `make` with no arguments to list all goals. Key targets:

| Target | Purpose |
|---|---|
| `make install` | Install all backend and frontend dependencies |
| `make dev` | Start both services with hot reload (Ctrl-C stops both) |
| `make prod` | Start the production stack via Docker Compose |
| `make down` | Stop the production stack |
| `make test-backend` | pytest |
| `make test-frontend` | Vitest |
| `make test-e2e` | Playwright (services auto-started) |
| `make preflight` | Full gate — lint + format + all tests |
| `make lint` / `make lint-fix` | Lint check or auto-fix (Ruff + ESLint) |
| `make format` / `make format-fix` | Format check or auto-fix (Ruff + Prettier) |
| `make openapi` | Regenerate `docs/specs/openapi.json` from FastAPI routes |
| `make openapi-preview` | Preview the API spec with Redoc (no backend required) |

## Contributing

### Before you start

Read [`AGENTS.md`](AGENTS.md) — it is the authoritative guide for how to work in this repo. It covers working flows, code conventions, logging requirements, testing standards, and what verification is required before a PR.

### Making a change

1. Work on a feature branch.
2. Follow the code conventions in [`AGENTS.md`](AGENTS.md): docstrings and JSDoc on public symbols, appropriate logging at every entry point and failure path, tests for observable behavior.
3. Run `make preflight` before opening a PR. It must pass clean.
4. Open a pull request using the template at [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). Every section must be filled in — do not leave placeholders blank.

### Standards

Rather than duplicate them here, the following are defined in [`AGENTS.md`](AGENTS.md) and apply to all contributions:

- **Testing** — what makes a test valuable, how each layer is used, and when not to write a test
- **Logging** — level conventions (verbose → debug → info → warning → error), backend and frontend patterns
- **Linting and formatting** — Ruff (Python), ESLint + Prettier (JS); `make lint` and `make format` for check-only
- **Code comments** — docstrings/JSDoc requirements, inline comment rules
- **Docs-as-code** — what goes where in `docs/`; see also [`docs/README.md`](docs/README.md)

### Pull request checklist

The PR template requires:

- All `make preflight` steps checked (lint, format, three test layers)
- Architecture docs updated if structure changed
- ADR added if the decision is architecturally significant
- All new public symbols documented
- Deferred work tracked in GitHub Issues
