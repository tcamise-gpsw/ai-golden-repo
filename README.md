# Hello World — Multilingual

A React and FastAPI app that translates "Hello, World!" into a selected language.

### Prerequisites

- Python 3.12+, pip
- Node 20+, npm
- Docker + Docker Compose (prod only)
- Playwright browsers: `npx playwright install` (for E2E)

### Development

Install dependencies once, then start both hot-reloading services:

```bash
make install
make dev
```

The app is available at http://localhost:5173. The generated API reference is available with `make openapi-preview`; application endpoints are `GET /api/languages` and `GET /api/translate/{code}`.

### Testing

```bash
make test-backend   # pytest
make test-frontend  # Vitest
make test-e2e       # Playwright; starts required services automatically
make preflight      # lint, format, and every test layer
```

### Production

```bash
make build   # build Docker images
make prod    # start the stack (Ctrl-C to stop, or make down)
```

App at http://localhost:80.
