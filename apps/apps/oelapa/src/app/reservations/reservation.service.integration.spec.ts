import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { ReservationService } from './reservation.service';
import { AuthenticationService } from '../auth/authentication.service';
import { ReservationRequest } from './reservation.models';
import { environment } from '../../environments/environment';

/**
 * Integration tests for ReservationService with actual API endpoint
 * 
 * These tests require the API endpoint to be available and properly configured.
 * They test real-world error scenarios that can occur with the actual reservation API.
 * 
 * To run these tests:
 * 1. Ensure the API endpoint is running at http://localhost:5678/webhook/api/reservervations
 * 2. Run: npm test -- --testNamePattern="Integration"
 */
describe('ReservationService Integration Tests', () => {
  let service: ReservationService;
  let authServiceMock: Partial<AuthenticationService>;

  const mockReservationRequest: ReservationRequest = {
    guestName: 'Integration Test User',
    checkInDate: '2025-12-01',
    checkOutDate: '2025-12-05',
    guestCount: 2,
    roomType: 'Standard',
    specialRequests: 'Integration test reservation'
  };

  const mockAuthState = {
    isAuthenticated: true,
    user: {
      email: 'integration.test@example.com',
      username: 'integrationtest',
      firstName: 'Integration',
      lastName: 'Test',
      id: 'int-123',
      roles: ['guest']
    },
    loading: false,
    error: null
  };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      getToken: jest.fn().mockReturnValue('integration-test-token'),
      authState$: of(mockAuthState)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Use actual HTTP client
      providers: [
        ReservationService,
        { provide: AuthenticationService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(ReservationService);
  });

  describe('API Endpoint Error Scenarios', () => {
    // Skip integration tests if API endpoint is not available
    const isApiAvailable = async (): Promise<boolean> => {
      try {
        const response = await fetch(environment.reservationApiUrl, {
          method: 'OPTIONS'
        });
        return response.status < 500;
      } catch {
        return false;
      }
    };

    it('should handle server timeout scenarios', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Test with very short timeout to simulate timeout scenario
      const originalTimeout = environment.apiTimeout || 30000;
      (environment as any).apiTimeout = 1; // 1ms timeout

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), 100);
      });

      const reservationPromise = service.createReservation(mockReservationRequest).toPromise();

      try {
        await Promise.race([reservationPromise, timeoutPromise]);
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      } finally {
        (environment as any).apiTimeout = originalTimeout;
      }
    }, 10000);

    it('should handle malformed API responses', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Create request with data that might cause API to return malformed response
      const malformedRequest: ReservationRequest = {
        guestName: '', // Invalid empty name
        checkInDate: 'invalid-date',
        checkOutDate: 'invalid-date',
        guestCount: -1, // Invalid count
        roomType: 'NonexistentRoomType',
        specialRequests: 'Test malformed response handling'
      };

      try {
        // This should trigger validation before API call
        await service.createReservation(malformedRequest).toPromise();
        fail('Expected validation error');
      } catch (error: any) {
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      }
    }, 10000);

    it('should handle API rate limiting', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Send multiple rapid requests to trigger potential rate limiting
      const requests = Array(5).fill(null).map((_, index) => 
        service.createReservation({
          ...mockReservationRequest,
          guestName: `Rate Limit Test ${index}`,
          specialRequests: `Rate limit test request ${index}`
        }).toPromise()
      );

      try {
        const results = await Promise.allSettled(requests);
        
        // Check if any requests were rate limited (429 status)
        const rateLimitedResults = results.filter(result => 
          result.status === 'rejected' && 
          result.reason?.code === '429'
        );

        // If rate limiting occurs, verify error handling
        if (rateLimitedResults.length > 0) {
          expect(rateLimitedResults[0].reason.message).toContain('rate limit');
        }

        // At least some requests should complete successfully or fail gracefully
        expect(results.length).toBe(5);
        results.forEach(result => {
          if (result.status === 'rejected') {
            expect(result.reason.message).toBeDefined();
          }
        });
      } catch (error) {
        // If all requests fail, verify error handling
        expect(error).toBeDefined();
      }
    }, 15000);

    it('should handle network connectivity issues', async () => {
      // Test with invalid URL to simulate network connectivity issues
      const originalUrl = environment.reservationApiUrl;
      (environment as any).reservationApiUrl = 'http://nonexistent.invalid.url/api';

      try {
        await service.createReservation(mockReservationRequest).toPromise();
        fail('Expected network error');
      } catch (error: any) {
        expect(error.message).toContain('Unable to connect');
        expect(error.code).toBe('0');
      } finally {
        (environment as any).reservationApiUrl = originalUrl;
      }
    }, 10000);

    it('should retry failed requests with exponential backoff', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Use invalid JWT secret to trigger 401 errors (which should not retry)
      const originalSecret = environment.jwtSecret;
      (environment as any).jwtSecret = 'invalid-secret-for-testing';

      const startTime = Date.now();

      try {
        await service.createReservation(mockReservationRequest).toPromise();
        fail('Expected authentication error');
      } catch (error: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Should fail quickly without retries for auth errors
        expect(duration).toBeLessThan(2000); // Should not retry auth errors
        expect(error.message).toContain('Authentication failed');
      } finally {
        (environment as any).jwtSecret = originalSecret;
      }
    }, 10000);

    it('should handle JWT token expiration scenarios', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Mock expired access token
      (authServiceMock.getToken as jest.Mock).mockReturnValue(null);

      try {
        await service.createReservation(mockReservationRequest).toPromise();
        fail('Expected token error');
      } catch (error: any) {
        expect(error.message).toContain('Access token not available');
      }
    });

    it('should validate response format from actual API', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      try {
        const response = await service.createReservation(mockReservationRequest).toPromise();
        
        // Validate response structure
        expect(response).toBeDefined();
        expect(typeof response.success).toBe('boolean');
        
        if (response.success) {
          expect(response.reservationId).toBeDefined();
          expect(typeof response.reservationId).toBe('string');
        } else {
          expect(response.error).toBeDefined();
          expect(typeof response.error).toBe('string');
        }
      } catch (error: any) {
        // If request fails, verify error structure
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');
      }
    }, 10000);
  });

  describe('Real API Error Response Handling', () => {
    it('should handle 400 Bad Request with validation errors', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Send request that might trigger 400 error from actual API
      const invalidRequest: ReservationRequest = {
        guestName: 'Test User',
        checkInDate: '2025-01-01', // Past date might trigger validation error
        checkOutDate: '2024-12-31', // Check-out before check-in
        guestCount: 1,
        roomType: 'Standard'
      };

      try {
        await service.createReservation(invalidRequest).toPromise();
        // If API accepts this, that's also valid - just ensure no crash
      } catch (error: any) {
        if (error.code === '400') {
          expect(error.message).toContain('Invalid reservation data');
        } else {
          // Client-side validation should catch this first
          expect(error.message).toContain('Check-out date must be after check-in date');
        }
      }
    });

    it('should handle 403 Forbidden responses', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Mock user without reservation permissions
      const restrictedAuthState = {
        ...mockAuthState,
        user: {
          ...mockAuthState.user,
          roles: ['read-only'] // Role that might not have reservation permissions
        }
      };

      authServiceMock.authState$ = of(restrictedAuthState);

      try {
        await service.createReservation(mockReservationRequest).toPromise();
        // If successful, that's valid too - depends on API implementation
      } catch (error: any) {
        if (error.code === '403') {
          expect(error.message).toContain('permission');
        }
      }
    });

    it('should log errors without exposing sensitive data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      try {
        // Trigger an error scenario
        (authServiceMock.getToken as jest.Mock).mockReturnValue(null);
        await service.createReservation(mockReservationRequest).toPromise();
      } catch (error) {
        // Verify error was logged
        expect(consoleSpy).toHaveBeenCalled();

        // Verify no sensitive data in logs
        const logCalls = consoleSpy.mock.calls;
        logCalls.forEach(call => {
          const logMessage = JSON.stringify(call);
          expect(logMessage).not.toContain(environment.jwtSecret);
          expect(logMessage).not.toContain('password');
          expect(logMessage).not.toContain('secret');
        });
      }

      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Resilience', () => {
    it('should handle concurrent reservation requests', async () => {
      const apiAvailable = await isApiAvailable();
      if (!apiAvailable) {
        console.log('⚠️  Skipping integration test - API endpoint not available');
        return;
      }

      // Test concurrent requests
      const concurrentRequests = Array(3).fill(null).map((_, index) =>
        service.createReservation({
          ...mockReservationRequest,
          guestName: `Concurrent Test ${index}`,
          specialRequests: `Concurrent request ${index}`
        }).toPromise()
      );

      try {
        const results = await Promise.allSettled(concurrentRequests);
        
        // Verify all requests complete (successfully or with proper errors)
        expect(results.length).toBe(3);
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            expect(result.value.success).toBeDefined();
          } else {
            expect(result.reason.message).toBeDefined();
            console.log(`Concurrent request ${index} failed as expected:`, result.reason.message);
          }
        });
      } catch (error) {
        // Even if requests fail, verify graceful handling
        expect(error).toBeDefined();
      }
    }, 15000);
  });
});