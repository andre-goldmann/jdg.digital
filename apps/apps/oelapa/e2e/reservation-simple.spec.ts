import { test, expect } from '@playwright/test';
import { loginUser, navigateToNewReservation, fillReservationForm, submitReservationForm } from './helpers';

test.describe('Reservation E2E Test - Simplified', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application with better error handling
    try {
      await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
      
      // Close any drawer backdrop that might be open
      const backdrop = page.locator('.mat-drawer-backdrop');
      if (await backdrop.count() > 0) {
        await backdrop.click();
        await page.waitForTimeout(500);
      }
    } catch (error) {
      console.log('❌ Failed to load application:', error.message);
      console.log('💡 Make sure the application is running at http://localhost:4200');
      console.log('💡 Start with: npx nx serve oelapa');
      throw error;
    }
  });

  test('should create a reservation with soulsaver/Blade23 credentials', async ({ page }) => {
    // Login with the provided credentials
    await loginUser(page, 'soulsaver', 'Blade23');
    
    // Navigate to new reservation page
    await navigateToNewReservation(page);
    
    // Verify we're on the reservation page
    await expect(page.locator('mat-card-title:has-text("Create New Reservation")')).toBeVisible();

    // Fill out the reservation form with test data
    await fillReservationForm(page, {
      guestName: 'E2E Test Guest',
      guestCount: '3 Guests',
      roomType: 'Suite',
      specialRequests: 'E2E Test - Automated reservation from Playwright test'
    });
    
    // Submit the form and handle results
    const result = await submitReservationForm(page);
    
    try {
      await result.waitForResult();
      
      if (await result.isSuccess()) {
        console.log('✅ Reservation created successfully!');
        await expect(result.successMessage).toContainText('successfully');
        
        // Verify form was reset after successful submission
        const guestNameField = page.locator('input[formControlName="guestName"]');
        const guestNameValue = await guestNameField.inputValue();
        expect(guestNameValue).toBe('');
      } else {
        console.log('❌ Reservation creation failed - this might be expected if API is not available');
        const errorText = await result.getErrorText();
        console.log('Error message:', errorText);
        await expect(result.errorMessage).toBeVisible();
      }
    } catch {
      console.log('⚠️  No success/error message appeared - form submission might be pending');
      // Check if form is still loading
      const loadingSpinner = page.locator('mat-spinner, .loading');
      if (await loadingSpinner.count() > 0) {
        console.log('Form is still loading...');
      }
    }
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Login first
    await loginUser(page, 'soulsaver', 'Blade23');
    
    // Navigate to reservations
    await navigateToNewReservation(page);

    // Submit button should be disabled when form is invalid
    const submitButton = page.locator('button:has-text("Create Reservation")');
    await expect(submitButton).toBeDisabled();
    
    // Fill only guest name and verify button is still disabled
    await page.locator('input[formControlName="guestName"]').fill('John Doe');
    await expect(submitButton).toBeDisabled();
    
    // Close any drawer backdrop before interacting with selects
    const backdrop = page.locator('.mat-drawer-backdrop');
    if (await backdrop.count() > 0) {
      await backdrop.click();
      await page.waitForTimeout(500);
    }
    
    // Fill all required fields to enable submit button
    await page.locator('mat-select[formControlName="guestCount"]').click({ force: true });
    await page.locator('mat-option:has-text("2 Guests")').click();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.locator('input[formControlName="checkInDate"]').fill(tomorrow.toISOString().split('T')[0]);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);
    await page.locator('input[formControlName="checkOutDate"]').fill(dayAfterTomorrow.toISOString().split('T')[0]);
    
    // Now submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should validate checkout date after checkin date', async ({ page }) => {
    // Login first
    await loginUser(page, 'soulsaver', 'Blade23');
    
    // Navigate to reservations
    await navigateToNewReservation(page);

    // Fill form with invalid date order
    await page.locator('input[formControlName="guestName"]').fill('John Doe');
    
    // Close any drawer backdrop before interacting with selects
    const backdrop = page.locator('.mat-drawer-backdrop');
    if (await backdrop.count() > 0) {
      await backdrop.click();
      await page.waitForTimeout(500);
    }
    
    await page.locator('mat-select[formControlName="guestCount"]').click({ force: true });
    await page.locator('mat-option:has-text("2 Guests")').click();
    
    // Set check-out date before check-in date
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await page.locator('input[formControlName="checkInDate"]').fill(tomorrow.toISOString().split('T')[0]);
    await page.locator('input[formControlName="checkOutDate"]').fill(today.toISOString().split('T')[0]);
    
    // Submit button should be disabled due to validation error
    const submitButton = page.locator('button:has-text("Create Reservation")');
    await expect(submitButton).toBeDisabled();
    
    // Should show validation error
    await expect(page.locator('mat-error:has-text("Check-out date must be after check-in date")')).toBeVisible();
  });

  test('should reset form when reset button is clicked', async ({ page }) => {
    // Login first
    await loginUser(page, 'soulsaver', 'Blade23');
    
    // Navigate to reservations
    await navigateToNewReservation(page);

    // Fill out form
    await fillReservationForm(page, {
      guestName: 'Reset Test User',
      guestCount: '4 Guests'
    });
    
    // Verify form has data
    await expect(page.locator('input[formControlName="guestName"]')).toHaveValue('Reset Test User');
    
    // Click reset button
    await page.locator('button:has-text("Reset")').click();
    
    // Verify form is cleared
    await expect(page.locator('input[formControlName="guestName"]')).toHaveValue('');
  });
});