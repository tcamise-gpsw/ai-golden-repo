---
name: audit-test-coverage
description: Use when verifying a branch is ready for review, after implementing a feature or fix, or whenever asked to check test coverage. Audits whether the changed code has appropriate tests — not just that tests pass, but that the right things are tested. Triggered automatically by work-complete-verification and on phrases like "check coverage", "audit tests", "are tests adequate".
---

# Audit test coverage

The goal is not a coverage number — it is confidence that meaningful behavior is tested. Read the principles in `AGENTS.md` (Tests section) first; this skill adds the tool-specific patterns.

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

## 3. Determine what is missing

For each gap, decide:
- Is this a valuable test (see AGENTS.md definition)? If yes, write it.
- Is this an edge case that cannot realistically fail? Note it but skip.
- Is this implementation detail testing? Skip.

Write only tests that would catch a real regression. Propose the tests to the user if the scope is unclear — do not add tests unilaterally to pass a coverage metric.

## 4. Report

Tell the user:
- What changed and what test coverage exists for it
- Any gaps and whether you filled them or skipped them (and why)
- Whether coverage is adequate to proceed

## Improving this skill

If a test pattern recurs that this skill doesn't document, or a coverage gap type isn't addressed:
1. Note it during the audit.
2. Propose a specific addition to this file.
3. Ask for approval before applying.
