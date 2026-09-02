---
name: lint-and-fix
description: Use when lint or format checks are failing — triggered by make lint or make format reporting errors, or when preflight fails on the lint/format step. Also use when asked to clean up code style or fix linting issues.
---

# Lint and format

Own the full lint + format → fix → verify loop. Record the files and rules involved so the final report explains the source changes.

## 1. Identify what is failing

Run the checks separately to isolate the failing concern:

```sh
make lint
make format
```

Note the specific files and rules reported by each command.

## 2. Auto-fix

Apply the project’s automated fixes:

```sh
make lint-fix
make format-fix
```

These resolve the majority of issues automatically.

## 3. Handle residual failures

Re-run the isolated checks:

```sh
make lint
make format
```

For anything still failing:

- **Lint:** Use the reported rule and location to fix the source. Do not add suppression comments without explicit user approval.
- **Format:** Ruff format and Prettier are fully automatic. If formatting still fails after `make format-fix`, the file may have a syntax error preventing parsing; fix the syntax first.

## 4. Verify

Run the final gate:

```sh
make lint && make format
```

Confirm both exit clean and report what was fixed.

## Improving this skill

This skill evolves through use. If a rule fires that seems wrong for this project, resolve the immediate failure, then surface the rule and propose a targeted configuration change to `pyproject.toml` or `eslint.config.js`. Never suppress a rule unilaterally. Ask for approval before changing lint configuration or this skill.
