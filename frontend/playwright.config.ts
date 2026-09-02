import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
});
