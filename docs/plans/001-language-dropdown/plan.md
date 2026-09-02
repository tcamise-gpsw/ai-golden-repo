# Language Dropdown with Dynamic Translations — Implementation Plan

**Goal:** Replace the static greeting list with a language dropdown that shows a single prominent "Hello, World!" greeting, translated on demand from the MyMemory Translation API, defaulting to the browser's locale.

**Architecture:** The backend keeps a curated language list in a static JSON file and exposes two endpoints — one to list languages, one to translate "Hello, World!" into a chosen language via MyMemory. The frontend fetches the language list, detects the browser locale to pick a default, and renders a dropdown plus a single-greeting display that re-fetches on each selection.

**Tech Stack:** FastAPI + httpx (backend), React 18 + Vite (frontend), pytest + Vitest + Playwright (tests), Ruff + ESLint + Prettier (quality). External: MyMemory Translation API (`https://api.mymemory.translated.net/get`).

**Reference:** Requirements in [design.md](design.md). Commands come from [AGENTS.md](../../../AGENTS.md) — do not invent them.

---

### Task 1: Backend — curated language list and `GET /api/languages`

**Files:**
- Create: `backend/data/languages.json` — curated language list (English name, native name, ISO code) for the 10 supported languages. Content per the design's data-model section.
- Delete: `backend/data/greetings.json` — replaced by `languages.json`.
- Modify: `backend/app/main.py` — add the `Language` Pydantic model, load `languages.json` at startup, add the `GET /api/languages` route. Update the module docstring to describe the new data source.

**Interface:**
- `Language(BaseModel)` with fields `language: str`, `native_name: str`, `code: str`, each carrying a `Field(description=...)`.
- Startup loads `languages.json` relative to the file (not cwd), parsing into `list[Language]`.
- `GET /api/languages` → `list[Language]`, HTTP 200. No external calls.

**Behavior:**
- The language list is fixed at startup; the route returns it verbatim.
- Codes are ISO 639-1 except Mandarin Chinese, which uses `zh-CN` (BCP 47) — MyMemory expects this form.

**Checklist** *(executing agent: check these off in the file as you complete them)*:
- [ ] `languages.json` created with all 10 languages and correct codes (`en`, `es`, `fr`, `de`, `ja`, `zh-CN`, `ar`, `pt`, `ru`, `ko`)
- [ ] `greetings.json` deleted
- [ ] `Language` model added with field descriptions
- [ ] Data loaded at startup, path resolved relative to the module file
- [ ] `GET /api/languages` returns the full list
- [ ] Module docstring updated

**Tests:**
- [ ] Run `make test-backend`
- [ ] Add/update tests covering: `/api/languages` returns 200, a list of 10, each item has `language`/`native_name`/`code`; verify at least one known code (e.g. `zh-CN`) is present

**Commit & document:**
- [ ] Read `skill://commit`, stage relevant untracked files, commit with `git commit -m` in Conventional Commits format. Then `git push`.
- [ ] Append to `notes.md` under a `### Task 1` heading. Write `N/A` if nothing worth recording.
- [ ] All above checked — call `todo done` to advance.

### Task 2: Backend — MyMemory translation and `GET /api/translate/{code}`

**Files:**
- Modify: `backend/app/main.py` — add the `TranslatedGreeting` model, add the `GET /api/translate/{code}` route with MyMemory integration, remove the old `GET /api/greetings` and `GET /api/greetings/{language}` routes.
- Modify: `backend/pyproject.toml` — `httpx` is already a dependency; confirm it is present in `dependencies` (not only `dev`) since it is now used in production code.

**Interface:**
- `TranslatedGreeting(BaseModel)` with fields `language: str`, `native_name: str`, `code: str`, `greeting: str`, each with a `Field(description=...)`.
- `GET /api/translate/{code}` → `TranslatedGreeting`, HTTP 200 on success.
- MyMemory call: `GET https://api.mymemory.translated.net/get` with query params `q="Hello, World!"` and `langpair=f"en|{code}"`, using an async `httpx.AsyncClient`. Extract `responseData.translatedText`.
- The MyMemory base URL must be a module-level constant so tests can monkeypatch or the client can be mocked.

**Behavior:**
- Look up `code` in the curated list (case-sensitive match on `code`). If absent → HTTP 404 `{"detail": "Language not found"}`.
- On success, return the matched language's `language`/`native_name`/`code` plus the translated `greeting`.
- If the HTTP call raises, times out, returns a non-2xx status, or the payload lacks a usable `responseData.translatedText` → HTTP 502 `{"detail": "Translation service unavailable"}`.
- English (`en`): still call MyMemory for consistency (en→en returns the input). Do not special-case it.
- Use a bounded request timeout (e.g. 5s) so a hung upstream does not hang the endpoint.

**Checklist** *(executing agent: check these off in the file as you complete them)*:
- [ ] `TranslatedGreeting` model added with field descriptions
- [ ] MyMemory base URL is a module-level constant
- [ ] `GET /api/translate/{code}` returns translated greeting on success
- [ ] Unknown code → 404 with the documented detail
- [ ] Upstream failure/timeout/bad-payload → 502 with the documented detail
- [ ] Request timeout is bounded
- [ ] Old `/api/greetings` and `/api/greetings/{language}` routes removed
- [ ] `httpx` confirmed in production `dependencies`

**Tests:**
- [ ] Run `make test-backend`
- [ ] Add/update tests covering: successful translation (MyMemory mocked, assert 200 + full shape + greeting value); unknown code → 404; upstream error → 502; upstream timeout → 502; malformed payload → 502. Mock MyMemory — no live network calls in unit tests.

**Commit & document:**
- [ ] Read `skill://commit`, stage relevant untracked files, commit with `git commit -m` in Conventional Commits format. Then `git push`.
- [ ] Append to `notes.md` under a `### Task 2` heading. Write `N/A` if nothing worth recording.
- [ ] All above checked — call `todo done` to advance.

### Task 3: Frontend — dropdown, greeting display, and locale-aware App

**Files:**
- Create: `frontend/src/components/LanguageSelector.jsx` — controlled `<select>` dropdown.
- Create: `frontend/src/components/GreetingDisplay.jsx` — single prominent greeting with loading/error states.
- Create: `frontend/src/locale.js` — pure helper that maps a browser locale string to a curated language code.
- Modify: `frontend/src/App.jsx` — two-step data flow (list languages, then translate), locale-based default, wiring the two components.
- Delete: `frontend/src/components/GreetingList.jsx` — replaced by `GreetingDisplay`.
- Create: `frontend/tests/LanguageSelector.test.jsx`, `frontend/tests/GreetingDisplay.test.jsx`, `frontend/tests/locale.test.js` — unit tests for the new units.
- Delete: `frontend/tests/GreetingList.test.jsx` — its component is removed.

**Interface:**
- `LanguageSelector({ languages, selected, onSelect })`: renders one `<option>` per language (label shows `language` and `native_name`, value is `code`); calls `onSelect(code)` on change. Root element carries `data-testid="language-selector"`. JSDoc required.
- `GreetingDisplay({ greeting, nativeName, language, isLoading, error })`: shows the greeting text prominently with `language` + `nativeName` as subtitle; renders a loading indicator when `isLoading`, and an `role="alert"` message when `error`. Root carries `data-testid="greeting-display"`. JSDoc required.
- `resolveLocale(navigatorLanguage, codes)` in `locale.js`: returns the best-matching code from `codes`. JSDoc required. Pure function, no globals — takes `navigator.language` value as an argument for testability.

**Behavior:**
- App on mount: `GET /api/languages`; on success, compute the default via `resolveLocale(navigator.language, availableCodes)`; then `GET /api/translate/{defaultCode}`.
- On dropdown change: `GET /api/translate/{code}`, showing the loading state on `GreetingDisplay` while in flight.
- Locale matching rules: exact code match wins (`ja` → `ja`); otherwise strip region and match base (`ja-JP` → `ja`); Chinese variants (`zh`, `zh-TW`, `zh-HK`, `zh-CN`) all map to `zh-CN`; no match → `en`.
- Error handling: a failed `/api/languages` fetch shows the existing top-level "Unable to load" message; a failed `/api/translate` shows the error state within `GreetingDisplay` without losing the dropdown.

**Checklist** *(executing agent: check these off in the file as you complete them)*:
- [ ] `LanguageSelector` renders options from props and fires `onSelect` with the code
- [ ] `GreetingDisplay` renders greeting, language, native name; handles loading and error
- [ ] `resolveLocale` implements exact → base → Chinese-variant → English fallback
- [ ] `App` fetches languages, picks locale default, fetches translation, wires components
- [ ] Dropdown change re-fetches translation and shows loading meanwhile
- [ ] `GreetingList.jsx` and `GreetingList.test.jsx` deleted
- [ ] All new components/functions carry JSDoc

**Tests:**
- [ ] Run `make test-frontend`
- [ ] Add/update tests covering: `LanguageSelector` renders all options and fires `onSelect`; `GreetingDisplay` renders greeting/loading/error states; `resolveLocale` for `ja-JP`→`ja`, `zh-TW`→`zh-CN`, `en-US`→`en`, unknown→`en`; `App` selects locale default and renders translated greeting (fetch mocked for both endpoints)

**Commit & document:**
- [ ] Read `'/Users/tcamise/.claude/skills/commit'`, stage relevant untracked files, commit with `git commit -m` in Conventional Commits format. Then `git push`.
- [ ] Append to `notes.md` under a `### Task 3` heading. Write `N/A` if nothing worth recording.
- [ ] All above checked — call `todo done` to advance.

### Task 4: E2E tests and OpenAPI regeneration

**Files:**
- Modify: `frontend/e2e/greetings.spec.ts` — rewrite for the dropdown + single-greeting flow.
- Regenerate: `docs/specs/openapi.json` — via `make openapi` (reflects the new routes and models).

**Interface:**
- E2E uses the existing Playwright `webServer` config (auto-starts backend and frontend). Selectors: `data-testid="language-selector"` and `data-testid="greeting-display"`.

**Behavior:**
- E2E assertions: on load, the dropdown is visible and contains 10 options; a greeting is displayed (default from locale); selecting a different language changes the displayed greeting.
- Because E2E hits the real MyMemory API, assert on structural facts (a non-empty greeting appears, the language subtitle updates) rather than exact translated strings, which may vary.
- `make openapi` must be run after Task 2 so the spec reflects `/api/languages` and `/api/translate/{code}` and no longer references the removed routes.

**Checklist** *(executing agent: check these off in the file as you complete them)*:
- [ ] E2E spec updated to the dropdown flow with correct `data-testid` selectors
- [ ] E2E asserts 10 options, a default greeting, and a change on new selection
- [ ] E2E avoids asserting exact translated text (structural assertions only)
- [ ] `docs/specs/openapi.json` regenerated via `make openapi`; old routes absent, new routes present

**Tests:**
- [ ] Run `make test-e2e` (services auto-start; set `CI=true` to always start fresh)

**Commit & document:**
- [ ] Read `'/Users/tcamise/.claude/skills/commit'`, stage relevant untracked files, commit with `git commit -m` in Conventional Commits format. Then `git push`.
- [ ] Append to `notes.md` under a `### Task 4` heading. Write `N/A` if nothing worth recording.
- [ ] All above checked — call `todo done` to advance.

### Task 5: ADR and living architecture docs

**Files:**
- Create: `docs/adr/0001-translations-from-external-api.md` — records the decision to fetch translations from MyMemory instead of hardcoding them.
- Modify: `docs/adr/README.md` — add ADR-0001 to the index table.
- Modify: `docs/architecture/03-api.md` — replace the old `/api/greetings` contract with `/api/languages` and `/api/translate/{code}`, including the MyMemory dependency and error responses; update the sequence diagram.
- Modify: `docs/architecture/04-frontend.md` — update the component tree (`App → LanguageSelector` + `GreetingDisplay`), the two-step data flow, and locale detection; remove references to `GreetingList`.

**Interface:**
- Use the `docs-create-adr` skill to author ADR-0001. Status `Accepted`. Follow the template in [docs/adr/README.md](../../adr/README.md).
- Cross-link ADR-0001 to `docs/architecture/03-api.md`, and add a reciprocal link back from that page.

**Behavior:**
- ADR content: **Context** — data was hardcoded in a JSON file; the app should source translations dynamically. **Decision** — fetch "Hello, World!" from the MyMemory API on demand, keyed by a curated language code list. **Consequences** — dynamic translations, extensible language set, at the cost of a runtime network dependency and possible upstream latency/failure (handled via 502). **Alternatives considered** — commercial APIs (need keys), LLM generation (non-deterministic, key required), keeping the static file (not dynamic).
- Architecture docs must follow `docs/README.md` conventions: no rot-prone counts, Mermaid diagrams, real markdown links, one source of truth (link to `docs/specs/openapi.json`, do not duplicate the schema).

**Checklist** *(executing agent: check these off in the file as you complete them)*:
- [ ] ADR-0001 written via `docs-create-adr`, status Accepted, using the template
- [ ] ADR-0001 added to the `docs/adr/README.md` index
- [ ] ADR cross-linked to `03-api.md` and back
- [ ] `03-api.md` updated: new endpoints, MyMemory dependency, error responses, updated sequence diagram
- [ ] `04-frontend.md` updated: new component tree, data flow, locale detection; no `GreetingList` references

**Tests:**
- [ ] N/A (documentation only) — verify all internal markdown links resolve

**Commit & document:**
- [ ] Read `'/Users/tcamise/.claude/skills/commit'`, stage relevant untracked files, commit with `git commit -m` in Conventional Commits format. Then `git push`.
- [ ] Append to `notes.md` under a `### Task 5` heading. Write `N/A` if nothing worth recording.
- [ ] All above checked — call `todo done` to advance.

### Task 6: Final Validation

**Checks:**
- [ ] Full gate passes: `make preflight` (lint + format + backend + frontend + E2E) exits clean
- [ ] Code quality clean: `make lint` and `make format` pass (fix via `make lint-fix` / `make format-fix` if needed)
- [ ] All acceptance criteria from Tasks 1–5 verified end-to-end
- [ ] `docs/specs/openapi.json` matches the implemented routes (no stale `/api/greetings`)
- [ ] All internal markdown links in changed docs resolve
- [ ] No regressions: the old greeting endpoints and `GreetingList` are fully removed with no dangling references
- [ ] All above checked — call `todo done` to close.
