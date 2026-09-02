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

## Code comments

**Docstrings and JSDoc on all non-private symbols.** Every public Python function, class, and module carries a docstring. Every exported React component carries a JSDoc block. These feed the generated API reference (`make openapi`, docstrings, JSDoc) and are not optional.

**Private symbols: comment when the intent is not obvious from the name and body alone.** A private helper named `_normalise_key` that does exactly that needs nothing. A private helper that encodes a non-obvious invariant, works around a library quirk, or has a precondition the caller must satisfy needs a comment.

**Inline comments: add only when the code cannot speak for itself.** A comment is valuable when it explains one of:
- *Why* — the reason a choice was made that looks wrong or surprising ("casefold not lower: handles Unicode titlecase")
- *Precondition or invariant* — a constraint the reader needs to know to modify the code safely
- *Non-obvious consequence* — a side effect or coupling that is not visible at the call site

A comment is not valuable when it restates what the code already says (`# increment counter`), narrates obvious control flow, or pads for the sake of coverage.

**No commented-out code.** Dead code lives in git history, not in the source.
