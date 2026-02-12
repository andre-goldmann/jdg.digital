/**
 * E2E Tests for Reservations List Component
 * Tests complete user workflows for viewing and interacting with reservations
 */

import { test, expect, Page } from '@playwright/test';

// Test data setup
const mockReservations = [
  {
    id: 'e2e-1',
    guestName: 'John Doe',
    checkIn: '2024-03-01',
    checkOut: '2024-03-05',
    roomType: 'Standard',
    status: 'confirmed',
    numberOfGuests: 2,
    totalAmount: 400
  },
  {
    id: 'e2e-2', 
    guestName: 'Jane Smith',
    checkIn: '2024-03-10',
    checkOut: '2024-03-15',
    roomType: 'Deluxe',
    status: 'pending',
    numberOfGuests: 1,
    totalAmount: 600
  },
  {
    id: 'e2e-3',
    guestName: 'Bob Johnson',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
    roomType: 'Suite',
    status: 'cancelled',
    numberOfGuests: 4,  
    totalAmount: 1200
  }
];

// Helper functions
async function setupMockData(page: Page) {
  // Mock the reservations API endpoint
  await page.route('**/api/reservations**', (route) => {
    const url = route.request().url();
    
    // Handle different query scenarios
    if (url.includes('search=John')) {
      route.fulfill({
        json: mockReservations.filter(r => r.guestName.includes('John'))
      });
    } else if (url.includes('status=confirmed')) {
      route.fulfill({
        json: mockReservations.filter(r => r.status === 'confirmed')
      });
    } else {
      route.fulfill({ json: mockReservations });
    }
  });
}

async function navigateToReservations(page: Page) {
  // Navigate to reservations page
  await page.goto('/reservations');
  
  // Wait for the page to load
  await page.waitForSelector('[data-testid="reservations-table"]', { timeout: 10000 });
}

async function mockAuthentication(page: Page) {
  // Mock authentication tokens to bypass Keycloak
  await page.addInitScript(() => {
    // Mock localStorage auth data (adjust based on your app's auth implementation)
    localStorage.setItem('access_token', 'mock-jwt-token');
    localStorage.setItem('refresh_token', 'mock-refresh-token'); 
    localStorage.setItem('user_info', JSON.stringify({
      sub: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      preferred_username: 'testuser',
      permissions: ['reservations:read', 'reservations:write']
    }));
    
    // Mock any other auth-related storage your app expects
    localStorage.setItem('auth_state', 'authenticated');
    sessionStorage.setItem('oauth_state', 'valid');
  });

  // Intercept auth-related API calls to prevent actual authentication
  await page.route('**/auth/**', (route) => {
    const url = route.request().url();
    if (url.includes('userinfo')) {
      route.fulfill({
        json: {
          sub: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          preferred_username: 'testuser'
        }
      });
    } else if (url.includes('token')) {
      route.fulfill({
        json: {
          access_token: 'mock-jwt-token',
          refresh_token: 'mock-refresh-token',
          token_type: 'bearer',
          expires_in: 3600
        }
      });
    } else {
      route.continue();
    }
  });
}

test.describe('Reservations List - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authentication and mock data
    await mockAuthentication(page);
    await setupMockData(page);
  });

  test.describe('Basic Viewing Functionality', () => {
    test('should display reservations list on page load', async ({ page }) => {
      await navigateToReservations(page);

      // Verify page title
      await expect(page).toHaveTitle(/Reservations/);
      
      // Verify main elements are present
      await expect(page.locator('[data-testid="reservations-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="reservations-table"]')).toBeVisible();
      
      // Verify table headers
      await expect(page.locator('th:has-text("Guest Name")')).toBeVisible();
      await expect(page.locator('th:has-text("Dates")')).toBeVisible();
      await expect(page.locator('th:has-text("Room Type")')).toBeVisible();
      await expect(page.locator('th:has-text("Status")')).toBeVisible();
      await expect(page.locator('th:has-text("Actions")')).toBeVisible();
    });

    test('should display correct number of reservations', async ({ page }) => {
      await navigateToReservations(page);

      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(3);
    });

    test('should display reservation data correctly', async ({ page }) => {
      await navigateToReservations(page);

      // Check first reservation data
      const firstRow = page.locator('[data-testid="reservation-row"]').first();
      await expect(firstRow.locator('[data-testid="guest-name"]')).toContainText('John Doe');
      await expect(firstRow.locator('[data-testid="room-type"]')).toContainText('Standard');
      await expect(firstRow.locator('[data-testid="status"]')).toContainText('confirmed');
    });

    test('should handle loading states', async ({ page }) => {
      // Delay the API response to see loading state
      await page.route('**/api/reservations**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        route.fulfill({ json: mockReservations });
      });

      await page.goto('/reservations');

      // Verify loading indicator appears
      await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
      
      // Wait for loading to complete
      await page.waitForSelector('[data-testid="reservations-table"]');
      await expect(page.locator('[data-testid="loading-indicator"]')).not.toBeVisible();
    });

    test('should handle empty state', async ({ page }) => {
      // Mock empty response
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ json: [] });
      });

      await navigateToReservations(page);

      // Verify empty state message
      await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
      await expect(page.locator('text=No reservations found')).toBeVisible();
    });

    test('should handle error states', async ({ page }) => {
      // Mock API error
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ status: 500, body: 'Server Error' });
      });

      await navigateToReservations(page);

      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('text=Error loading reservations')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should search reservations by guest name', async ({ page }) => {
      await navigateToReservations(page);

      // Enter search term
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');

      // Wait for search results
      await page.waitForTimeout(500);

      // Verify filtered results
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(1);
      await expect(rows.first().locator('[data-testid="guest-name"]')).toContainText('John Doe');
    });

    test('should clear search results', async ({ page }) => {
      await navigateToReservations(page);

      // Perform search
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Clear search
      await searchInput.clear();
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Verify all results returned
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(3);
    });

    test('should handle no search results', async ({ page }) => {
      await page.route('**/api/reservations**', (route) => {
        const url = route.request().url();
        if (url.includes('search=NonExistent')) {
          route.fulfill({ json: [] });
        } else {
          route.fulfill({ json: mockReservations });
        }
      });

      await navigateToReservations(page);

      // Search for non-existent guest
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('NonExistent');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Verify no results message
      await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
      await expect(page.locator('text=No reservations match your search')).toBeVisible();
    });
  });

  test.describe('Status Filtering', () => {
    test('should filter by status', async ({ page }) => {
      await navigateToReservations(page);

      // Open status filter dropdown
      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.click();

      // Select confirmed status
      await page.locator('[data-testid="status-option-confirmed"]').click();
      
      // Close dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify filtered results
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(1);
      await expect(rows.first().locator('[data-testid="status"]')).toContainText('confirmed');
    });

    test('should support multiple status selection', async ({ page }) => {
      await page.route('**/api/reservations**', (route) => {
        const url = route.request().url();
        if (url.includes('status=confirmed') || url.includes('status=pending')) {
          route.fulfill({
            json: mockReservations.filter(r => r.status === 'confirmed' || r.status === 'pending')
          });
        } else {
          route.fulfill({ json: mockReservations });
        }
      });

      await navigateToReservations(page);

      // Open status filter
      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.click();

      // Select multiple statuses
      await page.locator('[data-testid="status-option-confirmed"]').click();
      await page.locator('[data-testid="status-option-pending"]').click();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verify filtered results include both statuses
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(2);
    });

    test('should clear status filters', async ({ page }) => {
      await navigateToReservations(page);

      // Apply status filter
      const statusFilter = page.locator('[data-testid="status-filter"]');
      await statusFilter.click();
      await page.locator('[data-testid="status-option-confirmed"]').click();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Clear filters
      const clearButton = page.locator('[data-testid="clear-filters"]');
      await clearButton.click();
      await page.waitForTimeout(500);

      // Verify all results returned
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(3);
    });
  });

  test.describe('Date Range Filtering', () => {
    test('should filter by check-in date range', async ({ page }) => {
      await navigateToReservations(page);

      // Open date filter
      const dateFilter = page.locator('[data-testid="date-filter"]');
      await dateFilter.click();

      // Set date range
      await page.locator('[data-testid="start-date"]').fill('2024-03-01');
      await page.locator('[data-testid="end-date"]').fill('2024-03-10');
      
      // Apply filter
      await page.locator('[data-testid="apply-date-filter"]').click();
      await page.waitForTimeout(500);

      // Verify filtered results
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(2); // John Doe and Jane Smith
    });

    test('should validate date range inputs', async ({ page }) => {
      await navigateToReservations(page);

      // Open date filter
      const dateFilter = page.locator('[data-testid="date-filter"]');
      await dateFilter.click();

      // Set invalid date range (end before start)
      await page.locator('[data-testid="start-date"]').fill('2024-03-10');
      await page.locator('[data-testid="end-date"]').fill('2024-03-01');
      
      // Try to apply filter
      await page.locator('[data-testid="apply-date-filter"]').click();

      // Verify validation error
      await expect(page.locator('[data-testid="date-error"]')).toBeVisible();
      await expect(page.locator('text=End date must be after start date')).toBeVisible();
    });
  });

  test.describe('Table Interactions', () => {
    test('should sort by guest name', async ({ page }) => {
      await navigateToReservations(page);

      // Click guest name header to sort
      const guestNameHeader = page.locator('th:has-text("Guest Name")');
      await guestNameHeader.click();
      await page.waitForTimeout(500);

      // Verify sorting (ascending)
      const firstRow = page.locator('[data-testid="reservation-row"]').first();
      await expect(firstRow.locator('[data-testid="guest-name"]')).toContainText('Bob Johnson');

      // Click again for descending sort
      await guestNameHeader.click();
      await page.waitForTimeout(500);

      // Verify descending sort
      await expect(firstRow.locator('[data-testid="guest-name"]')).toContainText('John Doe');
    });

    test('should expand row for details', async ({ page }) => {
      await navigateToReservations(page);

      // Click expand button on first row
      const expandButton = page.locator('[data-testid="expand-row"]').first();
      await expandButton.click();

      // Verify expanded details are visible
      await expect(page.locator('[data-testid="row-details"]').first()).toBeVisible();
      await expect(page.locator('text=Number of Guests')).toBeVisible();
      await expect(page.locator('text=Total Amount')).toBeVisible();
    });

    test('should show action buttons', async ({ page }) => {
      await navigateToReservations(page);

      // Verify action buttons are present
      const firstRow = page.locator('[data-testid="reservation-row"]').first();
      await expect(firstRow.locator('[data-testid="view-action"]')).toBeVisible();
      await expect(firstRow.locator('[data-testid="edit-action"]')).toBeVisible();
    });
  });

  test.describe('Navigation and URL State', () => {
    test('should update URL with search parameters', async ({ page }) => {
      await navigateToReservations(page);

      // Perform search
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Verify URL contains search parameter
      expect(page.url()).toContain('search=John');
    });

    test('should restore state from URL parameters', async ({ page }) => {
      // Navigate with search parameter
      await page.goto('/reservations?search=John');
      await page.waitForSelector('[data-testid="reservations-table"]');

      // Verify search input has correct value
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveValue('John');

      // Verify filtered results
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(1);
    });

    test('should handle browser back/forward navigation', async ({ page }) => {
      await navigateToReservations(page);

      // Perform search
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Navigate to another page
      await page.goto('/dashboard');
      
      // Go back
      await page.goBack();
      await page.waitForSelector('[data-testid="reservations-table"]');

      // Verify search state is restored
      await expect(searchInput).toHaveValue('John');
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(1);
    });
  });

  test.describe('Performance and UX', () => {
    test('should load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();
      
      await navigateToReservations(page);
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second threshold
    });

    test('should debounce search input', async ({ page }) => {
      await navigateToReservations(page);

      const searchInput = page.locator('[data-testid="search-input"]');
      
      // Type rapidly
      await searchInput.type('Joh', { delay: 50 });
      
      // Wait for debounce
      await page.waitForTimeout(500);
      
      // Verify search was performed with final value
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(1);
    });

    test('should show loading states during operations', async ({ page }) => {
      // Slow down API response
      await page.route('**/api/reservations**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        route.fulfill({ json: mockReservations });
      });

      await navigateToReservations(page);

      // Perform search that triggers loading
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');

      // Verify loading indicator appears
      await expect(page.locator('[data-testid="search-loading"]')).toBeVisible();
      
      // Wait for completion
      await page.waitForSelector('[data-testid="reservation-row"]');
      await expect(page.locator('[data-testid="search-loading"]')).not.toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ status: 500, json: { error: 'Internal Server Error' } });
      });

      await navigateToReservations(page);

      // Verify error handling
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      
      // Verify retry functionality
      const retryButton = page.locator('[data-testid="retry-button"]');
      await expect(retryButton).toBeVisible();
    });

    test('should handle network failures', async ({ page }) => {
      await navigateToReservations(page);

      // Simulate network failure during search
      await page.route('**/api/reservations**', (route) => {
        route.abort('failed');
      });

      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');

      // Verify network error handling
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
      await expect(page.locator('text=Connection failed')).toBeVisible();
    });

    test('should recover from errors', async ({ page }) => {
      // Start with error
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ status: 500 });
      });

      await navigateToReservations(page);
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

      // Fix the API
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ json: mockReservations });
      });

      // Retry
      await page.locator('[data-testid="retry-button"]').click();

      // Verify recovery
      await page.waitForSelector('[data-testid="reservations-table"]');
      const rows = page.locator('[data-testid="reservation-row"]');
      await expect(rows).toHaveCount(3);
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await navigateToReservations(page);

      // Tab through interactive elements
      await page.keyboard.press('Tab'); // Search input
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();

      await page.keyboard.press('Tab'); // Status filter
      await expect(page.locator('[data-testid="status-filter"]')).toBeFocused();

      await page.keyboard.press('Tab'); // Date filter
      await expect(page.locator('[data-testid="date-filter"]')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await navigateToReservations(page);

      // Check ARIA labels
      const table = page.locator('[data-testid="reservations-table"]');
      await expect(table).toHaveAttribute('role', 'table');

      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveAttribute('aria-label', 'Search reservations');
    });

    test('should work with screen readers', async ({ page }) => {
      await navigateToReservations(page);

      // Verify screen reader announcements
      const liveRegion = page.locator('[aria-live="polite"]');
      await expect(liveRegion).toBeAttached();
      
      // Perform search
      const searchInput = page.locator('[data-testid="search-input"]');
      await searchInput.fill('John');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);

      // Verify announcement
      await expect(liveRegion).toContainText('1 reservation found');
    });
  });
});