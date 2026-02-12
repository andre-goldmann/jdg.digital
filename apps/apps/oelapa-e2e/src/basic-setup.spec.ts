/**
 * Simple E2E test to verify basic functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Basic E2E Setup Test', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we can see the application title
    await expect(page).toHaveTitle(/OELAPA Property Management/);
  });

  test('should redirect to Keycloak for authentication', async ({ page }) => {
    await page.goto('/reservations');
    
    // Wait for redirect to complete
    await page.waitForLoadState('networkidle');
    
    // Check that we're redirected to Keycloak for authentication
    expect(page.url()).toContain('realms/oelapa/protocol/openid-connect/auth');
  });
});