---
name: audit-and-fix-test-coverage
description: Use when verifying a branch is ready for review, after implementing a feature or fix, or whenever asked to check or improve test coverage. Audits whether changed code has appropriate tests, then writes any missing valuable tests and verifies they pass. Triggered automatically by work-complete-verification and on phrases like "check coverage", "audit tests", "fix coverage", "are tests adequate", "add missing tests".
---

# Audit and fix test coverage

The goal is not a coverage number — it is confidence that meaningful behavior is tested. Read the principles in `AGENTS.md` (Tests section) first; this skill adds the tool-specific patterns and the fix loop.

## 1. Identify what changed

```sh
git diff main...HEAD --stat
git diff main...HEAD -- backend/ frontend/
```

For each modified or added source file, determine:
- What observable behavior does it introduce or change?
- What boundary conditions or error paths exist?
- Is there an existing test that covers the changed behavior?

## 2. Assess coverage by layer

Work through each test layer independently.

### Backend — pytest + httpx

**Run:**
```sh
make test-backend
```

**What should be tested:**
- Every route: happy path (correct status, correct response shape), error path (404, 422, 500 where applicable)
- Boundary and edge cases: empty collections, unknown identifiers, case variations
- Any data transformation or business logic in the handler

**Patterns to use:**
```python
# Async test with ASGITransport — no live server needed
@pytest.mark.asyncio
async def test_example():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/greetings/english")
    assert response.status_code == 200
    assert response.json()["language"] == "English"

# Parametrize for case-insensitive and variant checks
@pytest.mark.parametrize("lang", ["english", "English", "ENGLISH"])
async def test_case_insensitive(lang):
    ...
```

**What not to test:**
- Pydantic model internals or field validators (trust the library)
- The JSON file format (tested implicitly by startup)
- Implementation details of how FastAPI routes are registered

### Frontend unit — Vitest + React Testing Library

**Run:**
```sh
make test-frontend
```

**What should be tested:**
- Components render the correct output given their props
- Loading, error, and empty states render correctly
- User interactions produce the expected state change or output
- `data-testid` attributes are present where tests need stable selectors

**Patterns to use:**
```jsx
// Render with mock data and assert output
it('renders all greeting items', () => {
  render(<GreetingList greetings={mockGreetings} />);
  expect(screen.getAllByTestId('greeting-item')).toHaveLength(2);
});

// Mock fetch for components that load data
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockGreetings,
  });
});

// Test error state
it('shows error on fetch failure', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false });
  render(<App />);
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});
```

**What not to test:**
- React internals or hook implementation details
- The exact DOM structure (prefer semantic queries: `getByRole`, `getByText`)
- Styles or visual appearance

### E2E — Playwright

**Run:**
```sh
make test-e2e
```

**What should be tested:**
- Full user journeys from browser load to visible output
- Critical paths that unit tests cannot exercise (real network, real DOM, real browser APIs)
- Cross-layer behavior that depends on both backend and frontend working together

**When E2E is appropriate vs. unit:**
Use E2E when the behavior requires a real browser or real HTTP. Do not write E2E tests for behavior already well-covered by unit tests — it adds overhead without proportional confidence.

**Patterns to use:**
```typescript
// Wait for data to load before asserting
await expect(page.locator('[data-testid="greeting-item"]').first()).toBeVisible();
const items = page.locator('[data-testid="greeting-item"]');
await expect(items).toHaveCount(10);
```

## 3. Fix gaps

For each gap identified:

- **Valuable test** (catches a real regression, tests observable behavior) → write it now.
- **Scope unclear** → describe the gap and proposed test to the user; get approval before writing.
- **Edge case that cannot realistically fail** → note it, skip it.
- **Implementation detail** → skip it; do not write.

Write directly into the appropriate test file following the existing conventions. Do not create new test files when an existing one covers the same component or module.

Never delete or modify an existing test to make a new one fit. Never weaken assertions to avoid failures — if a new test reveals a real bug, fix the bug.

## 4. Verify

Re-run the test layer(s) where new tests were added:

```sh
make test-backend    # if backend tests were added
make test-frontend   # if frontend tests were added
make test-e2e        # if E2E tests were added
```

All must pass. If a newly written test fails, fix it before proceeding — do not leave a failing test.

## 5. Report

Tell the user:
- What changed and what existing coverage existed
- Gaps found, what was written (with file and test name), what was skipped and why
- Whether coverage is now adequate to proceed

## Improving this skill

If a test pattern recurs that this skill doesn't document, or a gap type isn't addressed:
1. Note it during the audit.
2. Propose a specific addition to this file.
3. Ask for approval before applying.
