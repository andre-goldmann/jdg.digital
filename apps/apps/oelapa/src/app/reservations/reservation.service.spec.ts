import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReservationService } from './reservation.service';
import { AuthenticationService } from '../auth/authentication.service';
import { ReservationRequest, ReservationResponse } from './reservation.models';
import { environment } from '../../environments/environment';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpTestingController: HttpTestingController;
  let authServiceMock: Partial<AuthenticationService>;

  const mockReservationRequest: ReservationRequest = {
    guestName: 'John Doe',
    checkInDate: '2025-11-10',
    checkOutDate: '2025-11-15',
    guestCount: 2,
    roomType: 'Standard',
    specialRequests: 'Late check-in'
  };

  const mockReservationResponse: ReservationResponse = {
    success: true,
    reservationId: 'RES123456',
    message: 'Reservation created successfully'
  };

  const mockAuthState = {
    isAuthenticated: true,
    user: {
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      id: '123',
      roles: ['guest']
    },
    loading: false,
    error: null
  };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      getToken: jest.fn().mockReturnValue('mock-access-token'),
      authState$: of(mockAuthState)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReservationService,
        { provide: AuthenticationService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(ReservationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('createReservation', () => {
    it('should create reservation successfully', (done) => {
      service.createReservation(mockReservationRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(mockReservationResponse);
          done();
        },
        error: () => {
          fail('Expected successful response');
          done();
        }
      });

      const req = httpTestingController.expectOne(environment.reservationApiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockReservationRequest);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toContain('Bearer ');

      req.flush(mockReservationResponse);
    });

    it('should validate reservation data', (done) => {
      const invalidRequest = { ...mockReservationRequest, guestName: '' };

      service.createReservation(invalidRequest).subscribe({
        next: () => {
          fail('Expected validation error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Guest name is required');
          done();
        }
      });

      httpTestingController.expectNone(environment.reservationApiUrl);
    });

    it('should validate check-in and check-out dates', (done) => {
      const invalidRequest = { 
        ...mockReservationRequest, 
        checkInDate: '2025-11-15',
        checkOutDate: '2025-11-10'
      };

      service.createReservation(invalidRequest).subscribe({
        next: () => {
          fail('Expected validation error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Check-out date must be after check-in date');
          done();
        }
      });

      httpTestingController.expectNone(environment.reservationApiUrl);
    });

    it('should validate guest count', (done) => {
      const invalidRequest = { ...mockReservationRequest, guestCount: 0 };

      service.createReservation(invalidRequest).subscribe({
        next: () => {
          fail('Expected validation error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Guest count must be at least 1');
          done();
        }
      });

      httpTestingController.expectNone(environment.reservationApiUrl);
    });
  });

  describe('JWT Token Generation', () => {
    it('should throw error when user not authenticated', (done) => {
      (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(false);

      service.createReservation(mockReservationRequest).subscribe({
        next: () => {
          fail('Expected authentication error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('User not authenticated');
          done();
        }
      });

      httpTestingController.expectNone(environment.reservationApiUrl);
    });

    it('should throw error when access token not available', (done) => {
      (authServiceMock.getToken as jest.Mock).mockReturnValue(null);

      service.createReservation(mockReservationRequest).subscribe({
        next: () => {
          fail('Expected token error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Access token not available');
          done();
        }
      });

      httpTestingController.expectNone(environment.reservationApiUrl);
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 authentication errors', (done) => {
      service.createReservation(mockReservationRequest).subscribe({
        next: () => {
          fail('Expected authentication error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Authentication failed. Please log in again.');
          expect(error.code).toBe('401');
          done();
        }
      });

      const req = httpTestingController.expectOne(environment.reservationApiUrl);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle network errors', (done) => {
      service.createReservation(mockReservationRequest).subscribe({
        next: () => {
          fail('Expected network error');
          done();
        },
        error: (error) => {
          expect(error.message).toBe('Unable to connect to the reservation service. Please check your internet connection.');
          expect(error.code).toBe('0');
          done();
        }
      });

      const req = httpTestingController.expectOne(environment.reservationApiUrl);
      req.error(new ProgressEvent('Network error'), { status: 0 });
    });
  });
});