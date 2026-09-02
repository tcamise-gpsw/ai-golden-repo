.DEFAULT_GOAL := help
.PHONY: build dev dev-backend dev-frontend down help install openapi openapi-preview test test-backend test-e2e test-frontend up

help: ## Show available targets
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

# ── Setup ────────────────────────────────────────────────────────────────────

install: ## Install all backend and frontend dependencies
	cd backend && pip install -e '.[dev]'
	cd frontend && npm install
	cd frontend && npx playwright install --with-deps


# ── Docs ─────────────────────────────────────────────────────────────────────

openapi: ## Regenerate docs/openapi.json from FastAPI route definitions
	cd backend && python -c \
	  "import json; from app.main import app; print(json.dumps(app.openapi(), indent=2))" \
	  > ../docs/openapi.json

openapi-preview: ## Preview docs/openapi.json with Redoc in browser (no backend required)
	npx @redocly/cli preview-docs docs/openapi.json

# ── Dev ──────────────────────────────────────────────────────────────────────

dev: ## Start backend and frontend (Ctrl-C stops both; clears :8000/:5173 first)
	@-lsof -ti:8000 | xargs kill -9 2>/dev/null; true
	@-lsof -ti:5173 | xargs kill -9 2>/dev/null; true
	@trap 'kill %1 %2 2>/dev/null; exit 0' INT TERM; \
	(cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) & \
	(cd frontend && npm run dev) & \
	wait

dev-backend: ## Start backend only (uvicorn, port 8000)
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend only (vite, port 5173)
	cd frontend && npm run dev

# ── Test ─────────────────────────────────────────────────────────────────────

test: test-backend test-frontend ## Run backend and frontend unit tests

test-backend: ## Run backend pytest suite
	cd backend && pytest

test-frontend: ## Run frontend Vitest suite
	cd frontend && npm test

test-e2e: ## Run Playwright E2E tests (requires dev services running)
	cd frontend && npm run e2e

# ── Prod ─────────────────────────────────────────────────────────────────────

build: ## Build production Docker images
	docker-compose build

up: ## Start production stack via docker-compose
	docker-compose up

down: ## Stop production stack
	docker-compose down
