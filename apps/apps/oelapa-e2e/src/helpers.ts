import { Page } from '@playwright/test';

// Load test credentials from environment variables
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error('E2E_USERNAME and E2E_PASSWORD must be set in the .env file');
}

/**
 * Helper function to login with the provided credentials
 */
/**
 * Helper function to ensure the sidenav is closed before interacting with elements
 */
export async function ensureSidenavClosed(page: Page) {
  // Check if the backdrop is visible (indicating sidenav is open)
  const backdrop = page.locator('.mat-drawer-backdrop');
  
  if (await backdrop.count() > 0 && await backdrop.isVisible()) {
    try {
      // Try pressing Escape key to close the sidenav
      await page.keyboard.press('Escape');
      // Wait a short time for the animation
      await page.waitForTimeout(500);
      
      // If backdrop is still there, try clicking the menu toggle button
      if (await backdrop.count() > 0 && await backdrop.isVisible()) {
        const menuToggle = page.locator('button[aria-label="Toggle navigation menu"], .menu-toggle');
        if (await menuToggle.count() > 0) {
          await menuToggle.click();
          await page.waitForTimeout(500);
        }
      }
    } catch {
      // If all else fails, try forcing the backdrop click with a small timeout
      try {
        await backdrop.click({ timeout: 2000 });
      } catch {
        // Ignore if backdrop click fails
        console.log('Could not close sidenav, continuing with test...');
      }
    }
  }
}

/**
 * Helper function to log in with specified credentials
 */
export async function loginUser(page: Page, username: string, password: string) {
  // Ensure sidenav is closed before trying to interact with elements
  await ensureSidenavClosed(page);
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  const url = page.url();
  
  // Check if we need to login or if we're already authenticated
  if (url.includes('keycloak') || url.includes('auth') || await page.locator('[data-testid="login-form"]').isVisible()) {
    console.log('Detected Keycloak login page, proceeding with authentication...');
    
    // Wait for Keycloak login form to be visible
    await page.waitForSelector('input[name="username"], #username', { timeout: 10000 });
    
    // Fill in the login credentials
    const usernameSelector = await page.locator('input[name="username"], #username').first();
    const passwordSelector = await page.locator('input[name="password"], #password').first();
    
    await usernameSelector.fill(username);
    await passwordSelector.fill(password);
    
    // Click the login button
    await page.locator('input[type="submit"], button[type="submit"], #kc-login').first().click();
    
    // Wait for redirect back to application
    await page.waitForURL(/dashboard|\/$/);
  } else {
    // If we're not on a login page, click the login button to start auth flow
    await page.locator('app-auth-status button:has-text("Login")').click();
    
    // Wait for Keycloak login page
    await page.waitForURL(/keycloak|auth/, { timeout: 10000 });
    
    // Fill in login credentials
    await page.locator('input[name="username"], #username').first().fill(username);
    await page.locator('input[name="password"], #password').first().fill(password);
    
    // Submit login form
    await page.locator('button[type="submit"], #kc-login').first().click();
    
    // Wait for redirect back to app
    await page.waitForURL(/dashboard|reservations/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  }
  
  // Ensure we're on the dashboard or a protected page
  await page.waitForSelector('[data-testid="dashboard"], h1, mat-card', { timeout: 10000 });
}

/**
 * Helper function to log in with test credentials from environment
 */
export async function loginWithCredentials(page: Page) {
  return loginUser(page, E2E_USERNAME, E2E_PASSWORD);
}

/**
 * Helper function to navigate to the new reservation page
 */
export async function navigateToNewReservation(page: Page) {
  // Ensure sidenav is closed before trying to click feature cards
  await ensureSidenavClosed(page);
  
  // Try multiple ways to get to reservations:
  // 1. Click on the reservation feature card if it exists
  const reservationCard = page.locator('.feature-card:has-text("Reservations")');
  if (await reservationCard.count() > 0) {
    await reservationCard.click();
  } else {
    // 2. Or navigate directly to the reservations URL
    await page.goto('/reservations/new');
  }

  // Wait for the reservation form to load
  await page.waitForSelector('form, mat-card:has-text("Create New Reservation")', { timeout: 10000 });
}

/**
 * Helper function to fill the reservation form with test data
 */
export async function fillReservationForm(page: Page, options: {
  guestName?: string;
  guestCount?: string;
  checkInDaysFromNow?: number;
  checkOutDaysFromNow?: number;
  roomType?: string;
  specialRequests?: string;
} = {}) {
  const {
    guestName = 'John Doe',
    guestCount = '2 Guests',
    checkInDaysFromNow = 1,
    checkOutDaysFromNow = 4,
    roomType = 'Deluxe',
    specialRequests = 'Please prepare a quiet room with a nice view'
  } = options;
  
  // Close any drawer backdrop that might interfere
  const backdrop = page.locator('.mat-drawer-backdrop');
  if (await backdrop.count() > 0) {
    await backdrop.click();
    await page.waitForTimeout(500);
  }
  
  // Fill guest name
  await page.locator('input[formControlName="guestName"]').fill(guestName);
  
  // Select guest count (force click to bypass backdrop)
  await page.locator('mat-select[formControlName="guestCount"]').click({ force: true });
  await page.locator(`mat-option:has-text("${guestCount}")`).click();
  
  // Fill in check-in date
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + checkInDaysFromNow);
  await page.locator('input[formControlName="checkInDate"]').fill(checkInDate.toISOString().split('T')[0]);
  
  // Fill in check-out date
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + checkOutDaysFromNow);
  await page.locator('input[formControlName="checkOutDate"]').fill(checkOutDate.toISOString().split('T')[0]);
  
  // Select room type if provided (force click to bypass backdrop)
  if (roomType) {
    await page.locator('mat-select[formControlName="roomType"]').click({ force: true });
    await page.locator(`mat-option:has-text("${roomType}")`).click();
  }
  
  // Add special requests
  if (specialRequests) {
    await page.locator('textarea[formControlName="specialRequests"]').fill(specialRequests);
  }
}

/**
 * Helper function to submit the reservation form and handle results
 */
export async function submitReservationForm(page: Page) {
  // Submit the form
  await page.locator('button:has-text("Create Reservation")').click();
  
  // Wait for processing
  await page.waitForTimeout(2000);
  
  // Return information about the result
  const successMessage = page.locator('.mat-mdc-snack-bar-container:has-text("successfully"), .success-snackbar');
  const errorMessage = page.locator('.mat-mdc-snack-bar-container:has-text("Failed"), .error-snackbar');
  
  return {
    successMessage,
    errorMessage,
    async waitForResult() {
      await successMessage.or(errorMessage).waitFor({ timeout: 10000 });
    },
    async isSuccess() {
      return await successMessage.count() > 0;
    },
    async getErrorText() {
      if (await errorMessage.count() > 0) {
        return await errorMessage.textContent();
      }
      return null;
    }
  };
}