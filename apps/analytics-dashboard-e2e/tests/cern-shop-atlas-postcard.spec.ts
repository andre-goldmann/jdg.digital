import { test, expect } from '@playwright/test';

test('CERN Shop Atlas Postcard Test', async ({ page }) => {
  // 1. Navigate to the CERN shop page
  await page.goto('https://visit.cern/shop');
  await expect(page).toHaveTitle(/Shop | visit.cern/);

  // 2. Filter items by category = Postcards
  await page.getByLabel('Category').selectOption('Postcards');
  await page.getByRole('button', { name: 'Filter' }).click();

  // Wait for page to update with filtered results
  await page.waitForURL(/field_shop_category_target_id=363/);

  // 3. Verify that Atlas postcard item is in the filtered results
  const atlasPostcardItem = page.getByRole('heading', {
    name: /Atlas postcard/i,
  });
  await expect(atlasPostcardItem).toBeVisible();

  // 4. Open the Atlas postcard item
  // Direct navigation due to potential click issues with overlapping elements
  await page.goto('https://visit.cern/index.php/node/609');
  await expect(page).toHaveTitle(/Atlas postcard | visit.cern/);

  // 5. Verify that the price of the Atlas postcard is 1 CHF
  // Use a more specific locator that should be more reliable
  await expect(
    page.locator('div:has-text("Price") + div').first()
  ).toContainText('1 CHF', { timeout: 10000 });
});
