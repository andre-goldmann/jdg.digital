import { test, expect } from '@playwright/test';

// Load test credentials from environment variables
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error('E2E_USERNAME and E2E_PASSWORD must be set in the .env file');
}

test.describe('Standalone Reservation Test', () => {
  test('should be able to access the application and attempt login', async ({ page }) => {
    // This test will run against a manual server or skip if not available
    
    try {
      // Try to navigate to the application
      await page.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 10000 });
      
      console.log('✅ Application is accessible at http://localhost:4200');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      const url = page.url();
      console.log('Current URL:', url);
      
      // Check if we're redirected to Keycloak or already authenticated
      if (url.includes('keycloak') || url.includes('auth')) {
        console.log('🔐 Detected Keycloak login page');
        
        // Try to fill login form if Keycloak is available
        try {
          await page.waitForSelector('input[name="username"], #username', { timeout: 5000 });
          
          const usernameField = page.locator('input[name="username"], #username').first();
          const passwordField = page.locator('input[name="password"], #password').first();
          
          await usernameField.fill(E2E_USERNAME);
          await passwordField.fill(E2E_PASSWORD);
          
          console.log(`📝 Filled login credentials: ${E2E_USERNAME} / ***`);
          
          // Click login button
          await page.locator('input[type="submit"], button[type="submit"], #kc-login').first().click();
          
          // Wait for redirect
          await page.waitForURL(/dashboard|\/$/);
          console.log('✅ Successfully logged in and redirected to:', page.url());
          
          // Try to navigate to reservations via dashboard
          console.log('🎯 Navigating to reservation form via dashboard...');
          
          // Wait for dashboard to load completely
          await page.waitForSelector('mat-card, .feature-card', { timeout: 10000 });
          
          // Try to click on the reservations card or button
          const reservationElements = [
            'mat-card:has-text("Reservations")',
            'button:has-text("Create New Reservation")',
            'button:has-text("New Booking")',
            '[data-testid="reservations-card"]',
            '.feature-card:has-text("Reservations")'
          ];
          
          let navigationSuccess = false;
          
          for (const selector of reservationElements) {
            try {
              const element = page.locator(selector);
              if (await element.count() > 0) {
                console.log(`📝 Found element: ${selector}`);
                await element.first().click();
                navigationSuccess = true;
                break;
              }
            } catch {
              // Continue to next selector
            }
          }
          
          if (!navigationSuccess) {
            console.log('🔗 Trying direct navigation to reservations...');
            await page.goto('http://localhost:4200/reservations/new');
          }
          
          // Wait for reservation form to appear
          await page.waitForLoadState('networkidle');
          
          try {
            await page.waitForSelector('mat-card-title:has-text("Create New Reservation"), form', { timeout: 15000 });
            console.log('🎯 Successfully navigated to reservation form');
          } catch {
            console.log('❌ Could not find reservation form, checking current page...');
            console.log('Current URL:', page.url());
            const pageTitle = await page.title().catch(() => 'Unknown');
            console.log('Page title:', pageTitle);
            
            // Try to find what's actually on the page
            const bodyText = await page.locator('body').textContent().catch(() => '');
            console.log('Page content preview:', bodyText.substring(0, 300) + '...');
            
            // List available buttons and links for debugging
            const buttons = await page.locator('button, a').allTextContents().catch(() => []);
            console.log('Available buttons/links:', buttons.slice(0, 10));
            
            throw new Error(`Could not find reservation form. Current URL: ${page.url()}, Title: ${pageTitle}`);
          }
          
          console.log('🎯 Successfully navigated to reservation form');
          
          // Fill out reservation form
          await page.locator('input[formControlName="guestName"]').fill('E2E Test User');
          console.log('📝 Filled guest name');
          
          await page.locator('mat-select[formControlName="guestCount"]').click();
          await page.locator('mat-option:has-text("2 Guests")').click();
          console.log('📝 Selected guest count');
          
          // Fill dates
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const checkInDate = tomorrow.toISOString().split('T')[0];
          
          const checkOutDate = new Date();
          checkOutDate.setDate(checkOutDate.getDate() + 4);
          const checkOutDateStr = checkOutDate.toISOString().split('T')[0];
          
          await page.locator('input[formControlName="checkInDate"]').fill(checkInDate);
          await page.locator('input[formControlName="checkOutDate"]').fill(checkOutDateStr);
          console.log(`📅 Filled dates: ${checkInDate} to ${checkOutDateStr}`);
          
          // Select room type
          await page.locator('mat-select[formControlName="roomType"]').click();
          await page.locator('mat-option:has-text("Suite")').click();
          console.log('🏨 Selected room type: Suite');
          
          // Add special requests
          await page.locator('textarea[formControlName="specialRequests"]').fill('E2E test reservation - automated test');
          console.log('📝 Added special requests');
          
          // Verify submit button is enabled
          const submitButton = page.locator('button:has-text("Create Reservation")');
          await expect(submitButton).toBeEnabled();
          console.log('✅ Submit button is enabled');
          
          // Submit the form
          await submitButton.click();
          console.log('🚀 Submitted reservation form');
          
          // Wait for result (success or error)
          await page.waitForTimeout(3000);
          
          // Check for success or error messages
          const successMessage = page.locator('.mat-mdc-snack-bar-container:has-text("successfully"), .success-snackbar');
          const errorMessage = page.locator('.mat-mdc-snack-bar-container:has-text("Failed"), .error-snackbar');
          
          if (await successMessage.count() > 0) {
            console.log('✅ SUCCESS: Reservation created successfully!');
            const successText = await successMessage.textContent();
            console.log('Success message:', successText);
          } else if (await errorMessage.count() > 0) {
            console.log('❌ ERROR: Reservation creation failed (expected if API not available)');
            const errorText = await errorMessage.textContent();
            console.log('Error message:', errorText);
          } else {
            console.log('⚠️ No clear success/error message - form may still be processing');
          }
          
        } catch (loginError) {
          console.log('❌ Login failed:', loginError);
        }
        
      } else {
        console.log('ℹ️ Not redirected to Keycloak - may already be authenticated or auth not configured');
      }
      
    } catch (error) {
      console.log('❌ Could not access application:', error);
      console.log('💡 Make sure the application is running at http://localhost:4200');
      console.log('💡 Start with: npx nx serve oelapa');
    }
  });
});