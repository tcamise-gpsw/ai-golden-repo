import { expect, test } from '@playwright/test';

test('selects a language and displays its dynamic greeting', async ({
  page,
}) => {
  await page.goto('/');

  const selector = page.getByTestId('language-selector');
  await expect(selector).toBeVisible();
  await expect(selector.locator('option')).toHaveCount(10);

  const display = page.getByTestId('greeting-display');
  await expect(display.locator('h1')).not.toHaveText('');

  await selector.selectOption('ja');

  await expect(selector).toHaveValue('ja');
  await expect(display.getByText('Japanese — 日本語')).toBeVisible();
  await expect(display.locator('h1')).not.toHaveText('');
});
