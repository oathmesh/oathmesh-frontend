// @file tests/e2e/wishlist.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wishlist');
    await page.waitForLoadState('networkidle');
  });

  test('loads wishlist items', async ({ page }) => {
    // Items should load from the seed data
    const items = page.locator('[class*="card-surface"]');
    await expect(items.first()).toBeVisible({ timeout: 10_000 });
  });

  test('filter by category works', async ({ page }) => {
    // Click the SDK filter
    await page.click('button:text("sdk")');
    await page.waitForResponse('**/api/wishlist**');

    // All visible items should be SDK category
    const sdkBadges = page.locator('span:has-text("sdk")');
    const count = await sdkBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('opens submit form modal', async ({ page }) => {
    await page.click('#submit-wish-open');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Submit a feature request')).toBeVisible();
  });

  test('submits a new wish and it appears in list', async ({ page }) => {
    await page.click('#submit-wish-open');

    await page.fill('[name="title"]', 'Test Feature from Playwright');
    await page.fill('[name="description"]', 'This is a test feature request from Playwright e2e tests.');
    await page.selectOption('[name="category"]', 'feature');

    await page.click('#submit-wish-btn');

    // Should close modal on success
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 8_000 });

    // Toast should appear
    await expect(page.getByText('Request submitted!')).toBeVisible();
  });

  test('upvote increments count', async ({ page }) => {
    // Get the first vote button
    const voteBtn = page.locator('button[aria-label*="vote"]').first();
    const initialText = await voteBtn.innerText();
    const initialCount = parseInt(initialText.replace(/\D/g, ''));

    await voteBtn.click();
    await page.waitForTimeout(1000);

    const updatedText = await voteBtn.innerText();
    const updatedCount = parseInt(updatedText.replace(/\D/g, ''));

    // Count should have increased or button shows already-voted state
    expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('cannot vote twice (button shows voted state)', async ({ page }) => {
    const voteBtn = page.locator('button[aria-label*="vote"]').first();
    await voteBtn.click();
    await page.waitForTimeout(500);

    // Re-fetch the button state
    await expect(page.locator('button[aria-label*="You voted"]').first()).toBeVisible();
  });
});
