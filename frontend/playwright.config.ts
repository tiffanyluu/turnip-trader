import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm start',
      port: 3001,
      cwd: '../backend',
      env: {
        DATABASE_URL: 'postgresql://tiffanyluu@localhost:5432/turnip_test',
        OPENAI_API_KEY: 'mock_key_for_testing',
        NODE_ENV: 'test'
      },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      port: 5173,
      cwd: '.',
      env: {
        VITE_API_URL: 'http://localhost:3001/api'
      },
      reuseExistingServer: !process.env.CI,
    }
  ],
});
