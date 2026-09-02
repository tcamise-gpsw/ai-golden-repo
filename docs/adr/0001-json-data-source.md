# ADR-0001: Greeting data is stored in a static JSON file

- **Status:** Accepted
- **Date:** 2025-09-02
- **Deciders:** GoPro AI golden-repo team

## Context

The application needs a list of greetings in 10 languages. The options considered were hardcoded
Python data, a JSON file, a YAML file, SQLite, and an external API. The data is read-only, changes
infrequently, and has no relational structure.

## Decision

We will store greetings in [`backend/data/greetings.json`](../../backend/data/greetings.json) and
load them at startup into memory as a list of Pydantic `Greeting` models.

## Consequences

- Greeting data has zero infrastructure requirements, can be edited without changing Python, is
  visible in Git diffs, and is trivially testable.
- A restart is required to pick up data changes, and this approach is not suitable if the data grows
  large or becomes write-heavy.

## Alternatives considered

- **Hardcoded Python dict.** Rejected because data changes would require code changes and a
  redeploy.
- **YAML file.** Rejected because it provides no benefit over JSON for this static data shape.
- **SQLite.** Rejected because it adds infrastructure complexity with no benefit for static,
  read-only data.
- **External API (for example, a translation service).** Rejected because it introduces a network
  dependency and latency for data that never changes.

## Related documentation

- [API](../architecture/03-api.md)
- [Containers](../architecture/02-containers.md)