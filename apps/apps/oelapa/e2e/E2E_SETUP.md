# E2E Test Setup

This directory contains end-to-end tests for the OELAPA application.

## Environment Setup

### Required Environment Variables

The tests require login credentials to be set in environment variables for security reasons. 

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and fill in your test credentials:
   ```env
   E2E_USERNAME=your_test_username
   E2E_PASSWORD=your_test_password
   ```

### Security Notes

- The `.env` file is ignored by git to prevent credentials from being committed
- Never commit actual credentials to the repository
- Use dedicated test accounts for E2E testing

## Running Tests

Make sure you have the correct credentials in your `.env` file before running the tests:

```bash
# Run all E2E tests
npx playwright test

# Run specific test
npx playwright test dashboard-authentication.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests with debug mode
npx playwright test --debug
```

## Test Files

- `dashboard-authentication.spec.ts` - Tests authentication flows and dashboard access
- `reservation.spec.ts` - Tests reservation creation workflow  
- `reservation-simple.spec.ts` - Simplified reservation tests
- `simple-reservation.spec.ts` - Basic reservation form testing
- `standalone-test.spec.ts` - Standalone application access test
- `helpers.ts` - Shared helper functions for tests

## Helper Functions

The `helpers.ts` file contains reusable functions:

- `loginUser(page, username, password)` - Login with specific credentials
- `loginWithCredentials(page)` - Login using environment variables
- `navigateToNewReservation(page)` - Navigate to reservation form
- `fillReservationForm(page, options)` - Fill reservation form with test data
- `submitReservationForm(page)` - Submit form and handle results
- `ensureSidenavClosed(page)` - Close navigation drawer if open