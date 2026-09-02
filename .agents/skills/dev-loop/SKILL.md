---
name: dev-loop
description: Use this skill when iterating on the running application in real time, especially for bug fixes or UI/API changes that need observation. Start the local services, watch hot reload and relevant logs while editing, then confirm the result in the browser before moving on.
---

# Development loop

Own the full dev → observe → fix loop. Keep each edit small, observe its effect immediately, and use the running application as the source of truth.

## 1. Start services

`make dev` is idempotent — it clears ports `:8000` and `:5173` before starting, so running it against an already-live stack is safe.

For the agent loop, start services as named background processes so logs remain independently observable. Check first to avoid duplicates:

```json
{ "op": "ps" }
```

If `backend` is not running:

```json
{
  "op": "start",
  "name": "backend",
  "application": "uvicorn",
  "args": ["app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
  "cwd": "backend/",
  "ready": { "port": 8000 }
}
```

If `frontend` is not running:

```json
{
  "op": "start",
  "name": "frontend",
  "application": "npm",
  "args": ["run", "dev"],
  "cwd": "frontend/",
  "ready": { "log": "Local:.*http", "port": 5173 }
}
```

## 2. Open and observe the app

Open `http://localhost:5173` in the browser tool. Read the accessibility tree or take a screenshot to confirm greetings render. Record the visible symptom before editing — the fix needs a concrete target.

## 3. Tail logs

Inspect the service that owns the symptom:

- **Backend** — 500 responses, Python tracebacks, API failures
- **Frontend** — rendering issues, HMR failures, client-side errors

```json
{ "op": "logs", "name": "backend" }
{ "op": "logs", "name": "frontend" }
```

To isolate reload output from startup noise, call logs with `"follow": true` and the `cursor` returned by the prior call.

## 4. Edit and hot-reload

Make the smallest source edit that addresses the observed cause. Uvicorn (`--reload`) and Vite (HMR) reload automatically — do not restart services unless logs show reload failed.

Watch logs after the edit and confirm the reload completed without new errors before continuing.

## 5. Verify in the browser

Refresh `http://localhost:5173` and read a fresh accessibility tree or screenshot. Confirm the changed behavior is present and the original symptom is gone. This observation is the evidence — a successful edit alone is not.

## 6. Run targeted tests

After a fix, run the narrowest test layer that covers the changed behavior:

```sh
make test-backend   # backend pytest suite
make test-frontend  # frontend Vitest suite
make test-e2e       # full-stack Playwright (requires both services running)
```

Reserve `make test-e2e` for full-stack validation. Prefer `make test-backend` or `make test-frontend` for faster feedback on isolated changes.

## 7. Loop

If verification exposes a new issue, return to log inspection and repeat. Keep edits independent and verify each one before making the next change — the live state and logs stay attributable to a single cause.

## Improving this skill

This skill evolves through use. When following it, if you encounter a situation it doesn't handle — a failure mode not covered, an instruction that led you wrong, or a meaningfully better approach — do this:

1. **Resolve first.** Fix the immediate problem and continue the loop. Don't block on skill improvement mid-task.
2. **Surface the gap.** Tell the user what happened, why the current guidance was insufficient or wrong, and what you did instead.
3. **Propose a concrete update.** Draft the specific change to this file (`.agents/skills/dev-loop/SKILL.md`) that would handle the case in the future. Show the before/after.
4. **Ask for approval.** "Should I update the skill to include this?" Apply the change only if the user confirms.

The goal is that every deviation from this skill's instructions either reveals a flaw worth fixing or confirms the skill is already correct. Neither outcome is wasted.
