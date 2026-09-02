# README-META

> **This file is the only file in this repository written from a meta perspective.**
> Everything else belongs to the example project itself.

## What This Repo Is

`ai-golden-repo` is a reference implementation showing how AI infrastructure can be woven into a real software project at GoPro. The example project is deliberately trivial — the point is the infrastructure around it, not the code.

Use this repo as a template and a conversation starter: fork it, adapt the tooling, and carry the patterns into your own team's work.

## What "AI Infrastructure" Means Here

AI infrastructure is the set of files, conventions, and workflows that make a codebase legible and actionable to an AI agent — regardless of which AI tool or harness your team uses.

This repo demonstrates four patterns:

**Agent entry point (`AGENTS.md`)** — A top-level file that orients any AI agent to the repo: layout, API contracts, how to start services, where tests live, and which runbooks exist. An agent that reads this file first can act without asking questions.

**Operational runbooks (`.agents/skills/`)** — Focused, step-by-step playbooks for workflows that recur or require precise sequencing — things like the dev→observe→fix loop. Runbooks encode institutional knowledge in a form agents can follow reliably. They are also self-healing: when an agent hits a gap or a better approach mid-task, it surfaces the finding, proposes a specific update to the runbook, and asks the engineer to approve it. Every edge case becomes a permanent improvement.

**Unified command surface (`Makefile`)** — A single, documented entry point for every lifecycle action: install, dev, test, build, deploy. Any agent (or human) can run `make` to see all available goals. Commands here are the canonical source of truth — runbooks and docs reference them rather than repeating raw commands.

**Layered test framework** — Backend unit tests (pytest), frontend unit tests (Vitest + React Testing Library), and end-to-end tests (Playwright). An agent can run each layer independently to verify a change before marking work complete.

## Who This Is For

Engineers and team leads who want to adopt AI-assisted development practices. This repo gives you a concrete, working example to study, fork, and adapt — not a theoretical framework.

## How to Use This Repo

Study the AI infrastructure files alongside the trivial application code. The application is intentionally simple so the infrastructure patterns are visible without noise.

Carry the patterns into your own team's repo:
- Add an `AGENTS.md` oriented to your project's layout and conventions
- Add operational runbooks for recurring or high-stakes workflows
- Consolidate commands behind `make` (or your team's equivalent)
- Ensure your test layers can each be invoked in a single command

## Guiding Principles

**Harness agnostic.** The patterns here — entry points, runbooks, unified commands, test layers — work with any AI coding tool. Avoid baking in tool-specific syntax where a general convention serves equally well.

**One source of truth.** Runbooks and docs reference `make` targets; they don't repeat raw commands. When a command changes, one place changes.

**Living docs only.** `AGENTS.md` and runbooks stay in sync with the code. Historical plans and one-time decisions don't belong here.

**Earn your prose.** Every sentence in an agent-facing file should help an agent act correctly. Remove anything that doesn't.

**Self-healing infrastructure.** Operational runbooks improve through use. When an agent encounters a situation a runbook doesn't handle, it resolves the immediate problem, proposes a concrete update, and asks for approval before applying it. The runbook gets better every time it falls short.
