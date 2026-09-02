# Hello World — Multilingual

A simple React and FastAPI app that displays greetings in multiple languages.

### Prerequisites

- Python 3.12+, pip
- Node 20+, npm
- Docker + Docker Compose (prod only)
- Playwright browsers: `npx playwright install` (for E2E)

### Development

Run the following commands in separate terminals:

```bash
# Terminal 1 — backend
cd backend && pip install -e '.[dev]' && uvicorn app.main:app --reload

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

App available at http://localhost:5173. API at http://localhost:8000/api/greetings.

### Testing

```bash
# Backend unit tests
cd backend && pytest

# Frontend unit tests
cd frontend && npm test

# E2E (requires both dev services running)
cd frontend && npm run e2e
```

### Production

```bash
docker-compose up --build
```

App at http://localhost:80.
