import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:5173';
const reuseExistingServer = process.env.GITHUB_ACTIONS !== 'true';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command:
        'cd ../backend && uvicorn app.main:app --host 0.0.0.0 --port 8000',
      port: 8000,
      reuseExistingServer,
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer,
    },
  ],
});
