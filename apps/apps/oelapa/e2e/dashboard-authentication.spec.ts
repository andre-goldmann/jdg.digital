import { test, expect } from '@playwright/test';
import { ensureSidenavClosed } from './helpers';

// Load test credentials from environment variables
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error('E2E_USERNAME and E2E_PASSWORD must be set in the .env file');
}

test.describe('Dashboard Authentication Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Ensure sidenav is closed to prevent backdrop interference
    await ensureSidenavClosed(page);
  });

  test('should allow unauthenticated users to access dashboard', async ({ page }) => {
    // Verify we're on the dashboard (not redirected to login)
    await expect(page).toHaveURL(/dashboard/);
    
    // Should show the welcome card
    await expect(page.locator('mat-card-title:has-text("Welcome to OELAPA")')).toBeVisible();
    
    // Should show guest welcome message for unauthenticated users
    await expect(page.locator('h3:has-text("Welcome, Guest!")')).toBeVisible();
    
    // Should show login button in guest welcome section
    await expect(page.locator('button:has-text("Log In")')).toBeVisible();
    
    // Should show login button in header auth status
    await expect(page.locator('app-auth-status button:has-text("Login")')).toBeVisible();
  });

  test('should show "Login required" indicators for protected features', async ({ page }) => {
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Should show feature cards with more specific selectors
    await expect(page.locator('.feature-card:has-text("Reservations")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("Properties")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("Invoicing")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("Reports")')).toBeVisible();
    
    // All feature cards should show "Login required" for unauthenticated users
    const loginRequiredIndicators = page.locator('small:has-text("* Login required")');
    await expect(loginRequiredIndicators).toHaveCount(4);
    
    // Reservation button should show "Login to Create Reservation"
    await expect(page.locator('button:has-text("Login to Create Reservation")')).toBeVisible();
  });

  test('should trigger login flow when clicking protected features', async ({ page }) => {
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Ensure sidenav is closed before clicking
    await ensureSidenavClosed(page);
    
    // Click on the reservations feature card (use more specific selector)
    await page.locator('.feature-card:has-text("Reservations")').click();
    
    // Should be redirected to Keycloak login page
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    // Should show Keycloak login form
    await expect(page.locator('input[name="username"], #username')).toBeVisible();
    await expect(page.locator('input[name="password"], #password')).toBeVisible();
    await expect(page.locator('button[type="submit"], #kc-login')).toBeVisible();
  });

  test('should trigger login flow when clicking login buttons', async ({ page }) => {
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Ensure sidenav is closed before clicking
    await ensureSidenavClosed(page);
    
    // Click on the login button in the header (use more specific selector)
    await page.locator('app-auth-status button:has-text("Login")').click();
    
    // Should be redirected to Keycloak login page
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    // Should show Keycloak login form
    await expect(page.locator('input[name="username"], #username')).toBeVisible();
    await expect(page.locator('input[name="password"], #password')).toBeVisible();
    await expect(page.locator('button[type="submit"], #kc-login')).toBeVisible();
  });

  test('should show different content after successful login', async ({ page }) => {
    // First verify we're on the dashboard as guest
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h3:has-text("Welcome, Guest!")')).toBeVisible();
    
    // Ensure sidenav is closed before clicking
    await ensureSidenavClosed(page);
    
    // Click login button to start authentication flow (use more specific selector)
    await page.locator('app-auth-status button:has-text("Login")').click();
    
    // Wait for Keycloak login page
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    // Fill in login credentials
    await page.locator('input[name="username"], #username').first().fill(E2E_USERNAME);
    await page.locator('input[name="password"], #password').first().fill(E2E_PASSWORD);
    
    // Submit login form
    await page.locator('button[type="submit"], #kc-login').first().click();
    
    // Wait for redirect back to dashboard
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // After successful login, should show user information instead of guest welcome
    await expect(page.locator('h3:has-text("User Information")')).toBeVisible();
    
    // Should NOT show guest welcome message
    await expect(page.locator('h3:has-text("Welcome, Guest!")')).not.toBeVisible();
    
    // Should NOT show "Login required" indicators
    await expect(page.locator('small:has-text("* Login required")')).not.toBeVisible();
    
    // Reservation button should show "Create New Reservation" instead of "Login to Create Reservation"
    await expect(page.locator('button:has-text("Create New Reservation")')).toBeVisible();
    await expect(page.locator('button:has-text("Login to Create Reservation")')).not.toBeVisible();
    
    // Header should show welcome message and logout button instead of login button
    await expect(page.locator('span:has-text("Welcome, André!")')).toBeVisible();
    await expect(page.locator('button[aria-label="Logout"]')).toBeVisible();
    await expect(page.locator('app-auth-status button:has-text("Login")')).not.toBeVisible();
  });

  test('should allow authenticated users to access reservations directly', async ({ page }) => {
    // Ensure sidenav is closed before starting
    await ensureSidenavClosed(page);
    
    // First login (use more specific selector)
    await page.locator('app-auth-status button:has-text("Login")').click();
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    await page.locator('input[name="username"], #username').first().fill(E2E_USERNAME);
    await page.locator('input[name="password"], #password').first().fill(E2E_PASSWORD);
    await page.locator('button[type="submit"], #kc-login').first().click();
    
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Now click on reservations (use more specific selector)
    await ensureSidenavClosed(page);
    await page.locator('.feature-card:has-text("Reservations")').click();
    
    // Should navigate to reservations page without being redirected to login
    await page.waitForURL(/reservations/, { timeout: 10000 });
    
    // Should show reservation form
    await expect(page.locator('mat-card-title:has-text("Create New Reservation")')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });

  test('should protect reservations route for unauthenticated users', async ({ page }) => {
    // Try to navigate directly to reservations route
    await page.goto('/reservations/new');
    
    // Should be redirected to Keycloak login page
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    // Should show Keycloak login form
    await expect(page.locator('input[name="username"], #username')).toBeVisible();
    await expect(page.locator('input[name="password"], #password')).toBeVisible();
  });

  test('should handle logout correctly', async ({ page }) => {
    // Ensure sidenav is closed before starting
    await ensureSidenavClosed(page);
    
    // First login (use more specific selector)
    await page.locator('app-auth-status button:has-text("Login")').click();
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    await page.locator('input[name="username"], #username').first().fill(E2E_USERNAME);
    await page.locator('input[name="password"], #password').first().fill(E2E_PASSWORD);
    await page.locator('button[type="submit"], #kc-login').first().click();
    
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Verify we're logged in
    await expect(page.locator('h3:has-text("User Information")')).toBeVisible();
    
    // Click logout button
    await page.locator('button[aria-label="Logout"]').click();
    
    // Should be redirected to Keycloak logout or back to dashboard as guest
    await page.waitForLoadState('networkidle');
    
    // After logout, should show guest welcome again
    await expect(page.locator('h3:has-text("Welcome, Guest!")')).toBeVisible();
    await expect(page.locator('h3:has-text("User Information")')).not.toBeVisible();
    
    // Should show login required indicators again
    await expect(page.locator('small:has-text("* Login required")')).toHaveCount(4);
  });
});