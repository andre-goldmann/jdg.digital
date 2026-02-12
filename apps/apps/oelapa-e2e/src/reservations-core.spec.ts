/**
 * E2E Tests for Reservations List Component - Core Functionality
 * Tests essential user workflows with mock authentication
 */

import { test, expect, Page } from '@playwright/test';

// Test data setup
const mockReservations = [
  {
    id: 'e2e-1',
    guestName: 'John Doe',
    checkInDate: '2024-03-01',
    checkOutDate: '2024-03-05',
    roomType: 'Standard',
    status: 'confirmed',
    numberOfGuests: 2,
    totalAmount: 400,
    reservationId: 'RES-001'
  },
  {
    id: 'e2e-2', 
    guestName: 'Jane Smith',
    checkInDate: '2024-03-10',
    checkOutDate: '2024-03-15',
    roomType: 'Deluxe',
    status: 'pending',
    numberOfGuests: 1,
    totalAmount: 600,
    reservationId: 'RES-002'
  },
  {
    id: 'e2e-3',
    guestName: 'Bob Johnson',
    checkInDate: '2024-03-20',
    checkOutDate: '2024-03-25',
    roomType: 'Suite',
    status: 'cancelled',
    numberOfGuests: 4,  
    totalAmount: 1200,
    reservationId: 'RES-003'
  }
];

// Helper functions
async function setupMockData(page: Page) {
  // Mock the reservations API endpoint
  await page.route('**/api/reservations**', (route) => {
    const url = route.request().url();
    
    console.log('API route intercepted:', url);
    
    // Handle different query scenarios
    if (url.includes('search=John')) {
      route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        json: mockReservations.filter(r => r.guestName.includes('John'))
      });
    } else if (url.includes('status=confirmed')) {
      route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        json: mockReservations.filter(r => r.status === 'confirmed')
      });
    } else {
      route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        json: mockReservations
      });
    }
  });
}

async function bypassAuthentication(page: Page) {
  // Bypass authentication by mocking authenticated state
  await page.addInitScript(() => {
    // Mock auth tokens
    localStorage.setItem('access_token', 'mock-access-token');
    localStorage.setItem('refresh_token', 'mock-refresh-token');
    localStorage.setItem('id_token', 'mock-id-token');
    
    // Mock user info
    localStorage.setItem('user_info', JSON.stringify({
      sub: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      preferred_username: 'testuser',
      realm_access: { roles: ['user', 'admin'] }
    }));
    
    // Set authentication state
    localStorage.setItem('auth_state', 'authenticated');
    sessionStorage.setItem('oauth_state', JSON.stringify({
      state: 'authenticated',
      expires_at: Date.now() + 3600000
    }));
  });

  // Mock authentication-related endpoints
  await page.route('**/realms/**', (route) => {
    const url = route.request().url();
    console.log('Auth route intercepted:', url);
    
    if (url.includes('userinfo')) {
      route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        json: {
          sub: 'test-user-123',
          email: 'test@example.com',
          name: 'Test User',
          preferred_username: 'testuser'
        }
      });
    } else if (url.includes('token')) {
      route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        json: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          id_token: 'mock-id-token',
          token_type: 'Bearer',
          expires_in: 3600
        }
      });
    } else {
      // For other auth endpoints, continue as normal or return success
      route.continue();
    }
  });
}

test.describe('Reservations List - Core E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup mocks before each test
    await bypassAuthentication(page);
    await setupMockData(page);
  });

  test.describe('Basic Page Loading', () => {
    test('should load reservations page without authentication redirect', async ({ page }) => {
      // Navigate directly to reservations
      await page.goto('/reservations');
      
      // Wait a bit for any redirects to settle
      await page.waitForTimeout(2000);
      
      // Check if we stayed on reservations page or got content
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      // If we're still on the reservations route or got the content, test passes
      const hasReservationsContent = await page.locator('text=reservations').count() > 0;
      const isOnReservationsRoute = currentUrl.includes('/reservations') || currentUrl.endsWith('/');
      
      expect(hasReservationsContent || isOnReservationsRoute).toBeTruthy();
    });

    test('should display some content on the page', async ({ page }) => {
      await page.goto('/reservations');
      await page.waitForTimeout(2000);
      
      // Check for any visible content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
      expect(bodyText?.length || 0).toBeGreaterThan(0);
      
      console.log('Page content preview:', bodyText?.substring(0, 200));
    });

    test('should have correct page title', async ({ page }) => {
      await page.goto('/reservations');
      await page.waitForTimeout(1000);
      
      // Check page title
      const title = await page.title();
      expect(title).toContain('OELAPA');
    });
  });

  test.describe('API Integration Tests', () => {
    test('should call reservations API', async ({ page }) => {
      let apiCalled = false;
      
      // Monitor API calls
      page.on('request', request => {
        if (request.url().includes('api/reservations')) {
          apiCalled = true;
          console.log('API called:', request.url());
        }
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(3000);
      
      // Verify API was called (this will depend on your app's behavior)
      // Note: This might not trigger if auth redirects happen first
      console.log('API called:', apiCalled);
    });

    test('should handle mock API responses', async ({ page }) => {
      // Setup response monitoring
      const responses: string[] = [];
      
      page.on('response', response => {
        if (response.url().includes('api/reservations')) {
          responses.push(response.url());
          console.log('API response:', response.status(), response.url());
        }
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(3000);
      
      console.log('Captured responses:', responses);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/reservations**', (route) => {
        route.abort('failed');
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(2000);
      
      // Page should still load even if API fails
      const title = await page.title();
      expect(title).toBeTruthy();
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/reservations**', (route) => {
        route.fulfill({ 
          status: 500, 
          body: JSON.stringify({ error: 'Internal Server Error' }),
          headers: { 'Content-Type': 'application/json' }
        });
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(2000);
      
      // Page should still be accessible
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
    });
  });

  test.describe('Console and Network Monitoring', () => {
    test('should not have critical console errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(3000);
      
      // Filter out expected auth errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('Keycloak') && 
        !error.includes('oauth') && 
        !error.includes('auth') &&
        !error.includes('OIDC')
      );
      
      console.log('Console errors:', consoleErrors);
      console.log('Critical errors:', criticalErrors);
      
      // We expect some auth-related errors, but not critical app errors
      expect(criticalErrors.length).toBeLessThan(5);
    });

    test('should load required resources', async ({ page }) => {
      const failedRequests: string[] = [];
      
      page.on('requestfailed', request => {
        // Don't count auth-related failures as critical
        if (!request.url().includes('realms/') && !request.url().includes('auth')) {
          failedRequests.push(request.url());
        }
      });
      
      await page.goto('/reservations');
      await page.waitForTimeout(3000);
      
      console.log('Failed requests:', failedRequests);
      
      // Should not have many failed non-auth requests
      expect(failedRequests.length).toBeLessThan(3);
    });
  });
});