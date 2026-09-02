import { expect, test } from '@playwright/test';

test('displays all greetings', async ({ page }) => {
  await page.goto('/');

  const greetingItems = page.locator('[data-testid="greeting-item"]');
  await expect(greetingItems).toHaveCount(10);
  await expect(page.getByText('Hello, World!')).toBeVisible();
});
