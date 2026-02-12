# E2E Tests for OELAPA Application

This directory contains end-to-end tests for the OELAPA Property Management System using Playwright.

## 🎯 Test Overview

The e2e tests demonstrate a complete reservation workflow:

1. **Authentication**: Login using Keycloak with credentials `soulsaver` / `Blade23`
2. **Navigation**: Navigate to the reservation form
3. **Form Filling**: Fill out all reservation details (guest name, dates, room type, etc.)
4. **Validation**: Test form validation (required fields, date order validation)
5. **Submission**: Submit the reservation and handle success/error responses

## 📁 Test Files Created

- ✅ `reservation.spec.ts` - Comprehensive reservation tests with detailed scenarios
- ✅ `reservation-simple.spec.ts` - Simplified tests using helper functions
- ✅ `standalone-test.spec.ts` - Standalone test that provides helpful feedback
- ✅ `helpers.ts` - Utility functions for common test operations
- ✅ `playwright.config.ts` - Playwright configuration for multi-browser testing
- ✅ `README.md` - This documentation file

## 🚀 Quick Start

### Prerequisites

1. **Application Server**: Start the Angular development server
   ```powershell
   cd c:\Users\andre\development\workspace\jdg.digital
   npx nx serve oelapa
   ```

2. **Keycloak Server** (Optional - for full authentication testing):
   ```powershell
   # If Docker is available
   docker compose -f docker-compose.keycloak.yml up -d
   ```

3. **Test User Setup**: Ensure user `soulsaver` with password `Blade23` exists in Keycloak

### Running Tests

```powershell
# Navigate to the app directory
cd c:\Users\andre\development\workspace\jdg.digital\apps\apps\oelapa

# Run all tests
npx playwright test

# Run specific test files
npx playwright test reservation-simple.spec.ts

# Run with visible browser (great for demonstration)
npx playwright test standalone-test.spec.ts --headed

# Run in debug mode (step through tests)
npx playwright test reservation-simple.spec.ts --debug
```

## 🧪 Test Scenarios

### 1. Complete Reservation Flow (`reservation-simple.spec.ts`)
```typescript
test('should create a reservation with soulsaver/Blade23 credentials', async ({ page }) => {
  // Login with provided credentials
  await loginUser(page, 'soulsaver', 'Blade23');
  
  // Navigate to reservation form
  await navigateToNewReservation(page);
  
  // Fill form with test data
  await fillReservationForm(page, {
    guestName: 'E2E Test Guest',
    guestCount: '3 Guests',
    roomType: 'Suite',
    specialRequests: 'E2E Test - Automated reservation'
  });
  
  // Submit and verify results
  const result = await submitReservationForm(page);
  await result.waitForResult();
});
```

### 2. Form Validation Tests
- **Required Fields**: Ensures submit button is disabled until all required fields are filled
- **Date Validation**: Validates check-out date must be after check-in date
- **Form Reset**: Tests the reset functionality

### 3. Standalone Test (`standalone-test.spec.ts`)
- Provides helpful feedback when servers are not running
- Demonstrates the complete flow when everything is set up
- Logs detailed progress for demonstration purposes

## Running the Tests

### Run All E2E Tests
```powershell
# From the project root
npx nx e2e oelapa

# Or from the oelapa app directory
cd apps/oelapa
npx playwright test
```

### Run Specific Test Files
```powershell
# Run only the simplified reservation tests
cd apps/oelapa
npx playwright test reservation-simple.spec.ts

# Run only the comprehensive reservation tests
cd apps/oelapa
npx playwright test reservation.spec.ts
```

### Run Tests in Different Browsers
```powershell
# Run in Chrome only
npx playwright test --project=chromium

# Run in Firefox only
npx playwright test --project=firefox

# Run in Safari (WebKit) only
npx playwright test --project=webkit
```

### Run Tests in Debug Mode
```powershell
# Run with headed browser (visible)
npx playwright test --headed

# Run in debug mode (step through tests)
npx playwright test --debug

# Run specific test in debug mode
npx playwright test reservation-simple.spec.ts --debug
```

## Test Files

### `reservation-simple.spec.ts`
Simplified reservation tests using helper functions:
- **Login and Create Reservation**: Tests the complete flow from login to reservation creation
- **Form Validation**: Tests required field validation
- **Date Validation**: Tests check-in/check-out date order validation
- **Reset Functionality**: Tests form reset behavior

### `reservation.spec.ts`
Comprehensive reservation tests with detailed scenarios:
- **Complete Reservation Flow**: Full end-to-end reservation creation
- **Field Validation**: Tests individual field validation
- **Date Order Validation**: Tests complex date validation scenarios

### `helpers.ts`
Utility functions for common test operations:
- `loginUser()`: Handles Keycloak authentication
- `navigateToNewReservation()`: Navigates to reservation form
- `fillReservationForm()`: Fills form with test data
- `submitReservationForm()`: Submits form and handles results

## Test Configuration

The tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:4200`
- **Test Directory**: `./e2e`
- **Browsers**: Chrome, Firefox, Safari
- **Auto-start Server**: Automatically starts `npx nx serve oelapa` if not running

## Expected Behavior

### Successful Scenarios
When the reservation API is available and working:
- Tests should pass with success messages
- Forms should reset after successful submission
- Validation should work correctly

### API Unavailable Scenarios
When the reservation API endpoint is not available:
- Tests will show error messages but still validate UI behavior
- Form validation should still work correctly
- Authentication flow should still work

## Troubleshooting

### Common Issues

1. **Keycloak Not Running**
   ```
   Error: Timeout waiting for login form
   ```
   **Solution**: Start Keycloak server with `docker-compose -f docker-compose.keycloak.yml up -d`

2. **Application Not Running**
   ```
   Error: connect ECONNREFUSED ::1:4200
   ```
   **Solution**: Start the dev server with `npx nx serve oelapa`

3. **Authentication Issues**
   ```
   Error: Login failed or timeout
   ```
   **Solution**: Verify the test user exists in Keycloak with correct credentials

4. **Reservation API Errors**
   ```
   Error: Failed to create reservation
   ```
   **Expected**: This is normal if the backend API is not running. Tests will still validate UI behavior.

### Debug Tips

- Use `--headed` flag to see the browser during test execution
- Use `--debug` flag to step through tests interactively
- Check browser console logs for additional error information
- Verify network requests in the browser's Network tab

## Adding New Tests

When adding new e2e tests:

1. Use the helper functions in `helpers.ts` for common operations
2. Follow the existing naming convention: `feature.spec.ts`
3. Include both success and error scenarios
4. Add appropriate comments and console logging
5. Test across different browsers when possible

## CI/CD Integration

For continuous integration:
- Tests retry 2 times on failure in CI environment
- HTML reports are generated for test results
- Tests run in parallel for faster execution
- Use headless mode for CI environments