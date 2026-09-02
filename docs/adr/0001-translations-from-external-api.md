# ADR-0001: Translations come from an external API

- **Status:** Accepted
- **Date:** 2026-09-02
- **Deciders:** GoPro AI golden-repo team

## Context

The application originally stored complete greeting translations in a static JSON file. The language dropdown needs a bounded, predictable set of options while sourcing translation text dynamically. The example should demonstrate an external service boundary without requiring credentials or commercial infrastructure.

## Decision

We will keep curated language metadata in `backend/data/languages.json` and fetch a "Hello World" translation from the MyMemory Translation API on demand. English is rendered locally because MyMemory rejects identical source and target language pairs. The FastAPI backend owns the external integration and exposes stable application endpoints to the frontend. Upstream HTTP failures, timeouts, embedded provider error statuses, and malformed responses are returned as HTTP 502 errors.

## Consequences

Translation text is dynamic and new curated languages require metadata rather than a stored translation. The frontend remains isolated from the external provider and its response format.

The application now depends on network availability and MyMemory's latency, uptime, rate limits, and translation behavior. End-to-end tests exercise that live boundary and can fail when the provider is unavailable. Backend unit tests use an HTTP mock transport so they remain deterministic.

## Alternatives considered

**Keep static translations.** Rejected because it does not demonstrate dynamic translation and requires maintaining every translated string in the repository.

**Use a commercial translation API.** Rejected because Google Cloud Translation and DeepL require credentials and account setup that add weight to a trivial example.

**Generate translations with an LLM.** Rejected because it requires credentials, costs more, and introduces unnecessary non-determinism.

**Ask MyMemory for the language list.** Rejected because the application needs a small, predictable dropdown and should not depend on upstream availability just to render its choices.

## Related documentation

- [01 System Context](../architecture/01-system-context.md)
- [02 Containers](../architecture/02-containers.md)
- [03 API](../architecture/03-api.md)
