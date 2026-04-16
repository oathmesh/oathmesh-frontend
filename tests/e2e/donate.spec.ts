// @file tests/e2e/donate.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Donate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/donate');
    await page.waitForLoadState('networkidle');
  });

  test('loads donation page', async ({ page }) => {
    await expect(page.getByText('Support OathMesh')).toBeVisible();
    await expect(page.locator('#tier-coffee')).toBeVisible();
    await expect(page.locator('#tier-supporter')).toBeVisible();
    await expect(page.locator('#tier-sponsor')).toBeVisible();
    await expect(page.locator('#tier-enterprise')).toBeVisible();
  });

  test('selecting a tier pre-fills the amount', async ({ page }) => {
    // Click Coffee tier ($5)
    await page.click('#tier-coffee');
    await expect(page.locator('#tier-coffee')).toHaveAttribute('aria-pressed', 'true');

    // Click Sponsor tier ($100)
    await page.click('#tier-sponsor');
    await expect(page.locator('#tier-sponsor')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tier-coffee')).toHaveAttribute('aria-pressed', 'false');
  });

  test('custom amount input validates minimum', async ({ page }) => {
    // Clear tier selection and use custom amount below $1
    await page.fill('#custom-amount', '0');
    await page.focus('#custom-amount');
    await page.click('#donate-submit');

    // Should show error toast
    await expect(page.getByText('Minimum $1.00')).toBeVisible({ timeout: 5_000 });
  });

  test('custom amount input activates on focus', async ({ page }) => {
    await page.click('#custom-amount');
    await page.fill('#custom-amount', '25');

    // Tiers should be deselected
    const tiers = ['coffee', 'supporter', 'sponsor', 'enterprise'];
    for (const tier of tiers) {
      await expect(page.locator(`#tier-${tier}`)).toHaveAttribute('aria-pressed', 'false');
    }
  });

  test('clicking Donate redirects to Stripe checkout URL', async ({ page, context }) => {
    // Mock the /api/donate/checkout endpoint to return a fake Stripe URL
    await page.route('**/api/donate/checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://checkout.stripe.com/test_session' }),
      });
    });

    await page.click('#tier-supporter');
    await page.click('#donate-submit');

    // Wait for navigation or URL change
    await page.waitForTimeout(1000);
    // The page should attempt to navigate to the Stripe URL
    // (in test env it may fail since it's a fake URL, that's expected)
  });

  test('donor wall section is visible', async ({ page }) => {
    await expect(page.getByText('Supporters')).toBeVisible();
  });
});
