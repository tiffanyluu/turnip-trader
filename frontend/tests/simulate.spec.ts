import { test, expect } from '@playwright/test';

test('simulate button creates cards and advice', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  await page.click('text=Simulate Week');

  await page.waitForTimeout(3000);
  
  await expect(page.locator('text=Pattern Type')).toBeVisible();
  await expect(page.locator('text=Buy Price')).toBeVisible();
  
  await expect(page.locator('[data-testid="isabelle-textbox"]')).toBeVisible();
  
  await expect(page.locator('text=Turnip Prices This Week')).toBeVisible();
});

test('shows error when backend is down', async ({ page }) => {
  await page.route('**/api/**', route => route.abort());
  
  await page.goto('http://localhost:5173');
  await page.click('text=Simulate Week');
  
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('text=Cannot connect to server')).toBeVisible();
});

test('works on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('http://localhost:5173');
  
  const button = page.locator('text=Simulate Week');
  await expect(button).toBeVisible();
  
  await button.click();
  
  await expect(page.locator('text=Pattern Type')).toBeVisible();
  await expect(page.locator('text=Buy Price')).toBeVisible();
  
  const body = await page.locator('body').boundingBox();
  expect(body?.width).toBeLessThanOrEqual(375);
});
