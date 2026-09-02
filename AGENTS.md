# AI Agent Guide

## Repo layout

```text
.
├── backend/              # FastAPI service
├── frontend/             # React application built with Vite
├── docker/               # Production nginx configuration
├── .agents/skills/       # Project-local OMP skills
├── docker-compose.yml    # Production service composition
└── README.md             # Project overview and setup
```

## API contract

- `GET /api/greetings` returns the complete greeting collection:

  ```json
  [
    {
      "language": "string",
      "native_name": "string",
      "greeting": "string"
    }
  ]
  ```

- `GET /api/greetings/{language}` returns one greeting object with the same fields, or `404` when the language is unknown:

  ```json
  {
    "language": "string",
    "native_name": "string",
    "greeting": "string"
  }
  ```

## Starting services (dev)

Start services with the `hub` tool using these JSON payloads:

**Backend**

```json
{
  "i": "Starting backend service",
  "op": "start",
  "name": "backend",
  "application": "uvicorn",
  "args": ["app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
  "cwd": "backend/",
  "ready": {"port": 8000}
}
```

**Frontend**

```json
{
  "i": "Starting frontend service",
  "op": "start",
  "name": "frontend",
  "application": "npm",
  "args": ["run", "dev"],
  "cwd": "frontend/",
  "ready": {"log": "Local:.*http", "port": 5173}
}
```

## Viewing output

After both services are ready, use the `browser` tool to open `http://localhost:5173`.

## Reading logs

Use `hub` logs for the service you are diagnosing:

- `{"i":"Reading backend logs","op":"logs","name":"backend"}`
- `{"i":"Reading frontend logs","op":"logs","name":"frontend"}`

## Running tests

Run each layer from its own directory:

```sh
cd backend && pytest
cd frontend && npm test
cd frontend && npm run e2e
```

The E2E suite requires both backend and frontend services to be running.

## Skills

| Skill | Description |
| --- | --- |
| `dev-loop` | Own the start, observe, fix, hot-reload, and targeted-verification loop for this application. |
