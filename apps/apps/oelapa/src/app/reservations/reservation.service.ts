import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, from } from 'rxjs';
import { retryWhen, switchMap, catchError, map, timeout } from 'rxjs/operators';
import { resource } from '@angular/core';
import { BrowserJwtUtil, JwtPayload } from './jwt.util';

import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../environments/environment';
import {
  ReservationRequest,
  ReservationResponse,
  ReservationError
} from './reservation.models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthenticationService);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Initial retry delay in ms

  // Signal-based state for reservation requests
  private _currentReservationRequest = signal<ReservationRequest | null>(null);

  // Modern resource-based reservation creation
  public reservationResource = resource({
    params: () => this._currentReservationRequest(),
    loader: async ({ params: reservationData }): Promise<ReservationResponse | null> => {
      if (!reservationData) return null;

      try {
        this.validateReservationData(reservationData);
        const jwtToken = await this.generateJwtToken();

        console.log('Creating reservation with resource API:', {
          guestName: reservationData.guestName,
          checkInDate: reservationData.checkInDate,
          checkOutDate: reservationData.checkOutDate,
          apiUrl: environment.reservationApiUrl
        });

        const response = await fetch(environment.reservationApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify(reservationData)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as ReservationResponse;
        return this.processResponse(result);
      } catch (error) {
        console.error('Resource API request failed:', error);
        throw this.createReservationError('Failed to create reservation', error);
      }
    }
  });

  /**
   * Modern signal-based method to create a reservation
   * @param reservationData The reservation details
   */
  createReservationWithResource(reservationData: ReservationRequest): void {
    this._currentReservationRequest.set(reservationData);
  }

  /**
   * Reset the reservation resource state
   */
  resetReservationResource(): void {
    this._currentReservationRequest.set(null);
  }

  /**
   * Creates a new reservation through the API endpoint
   * @param reservationData The reservation details
   * @returns Observable<ReservationResponse>
   */
  createReservation(reservationData: ReservationRequest): Observable<ReservationResponse> {
    try {
      this.validateReservationData(reservationData);

      // Convert Promise to Observable and chain the HTTP request
      return from(this.generateJwtToken()).pipe(
        switchMap(jwtToken => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          });

          console.log('Creating reservation:', {
            guestName: reservationData.guestName,
            checkInDate: reservationData.checkInDate,
            checkOutDate: reservationData.checkOutDate,
            apiUrl: environment.reservationApiUrl
          });

          return this.httpClient.post<ReservationResponse>(
            environment.reservationApiUrl,
            reservationData,
            { headers }
          ).pipe(
            timeout(environment.apiTimeout),
            retryWhen(errors => this.retryLogic(errors)),
            map(response => {
              console.log('Raw HTTP response:', response);
              return this.processResponse(response);
            }),
            catchError(error => {
              console.error('HTTP request failed:', error);
              return this.handleError(error);
            })
          );
        }),
        catchError(error => throwError(() => this.createReservationError('JWT generation failed', error)))
      );
    } catch (error) {
      return throwError(() => this.createReservationError('Failed to create reservation', error));
    }
  }

  /**
   * Generates a JWT token for API authentication
   * @returns Promise<string> The signed JWT token
   * @private
   */
  private async generateJwtToken(): Promise<string> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    // Get user email from auth state
    let userEmail: string | null = null;
    this.authService.authState$.subscribe(state => {
      userEmail = state.user?.email || null;
    }).unsubscribe();

    if (!userEmail) {
      throw new Error('User email not available');
    }

    const accessToken = this.authService.getToken();
    if (!accessToken) {
      throw new Error('Access token not available');
    }

    const payload: JwtPayload = {
      email: userEmail,
      accessToken: accessToken
    };

    const token = await BrowserJwtUtil.generateToken(
      payload,
      environment.jwtSecret
    );

    console.log('Generated JWT token for user:', userEmail);
    return token;
  }

  /**
   * Validates reservation data before sending to API
   * @param data The reservation data to validate
   * @private
   */
  private validateReservationData(data: ReservationRequest): void {
    if (!data.guestName?.trim()) {
      throw new Error('Guest name is required');
    }
    if (!data.checkInDate) {
      throw new Error('Check-in date is required');
    }
    if (!data.checkOutDate) {
      throw new Error('Check-out date is required');
    }
    if (!data.guestCount || data.guestCount < 1) {
      throw new Error('Guest count must be at least 1');
    }

    // Validate date order
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    if (checkOut <= checkIn) {
      throw new Error('Check-out date must be after check-in date');
    }
  }

  /**
   * Implements retry logic with exponential backoff
   * @param errors The error stream
   * @private
   */
  private retryLogic(errors: Observable<unknown>) {
    return errors.pipe(
      switchMap((error, index) => {
        const shouldRetry = index < this.maxRetries && this.isRetriableError(error);

        if (!shouldRetry) {
          return throwError(() => error);
        }

        const delay = this.retryDelay * Math.pow(2, index); // Exponential backoff
        console.log(`Retrying reservation request in ${delay}ms (attempt ${index + 1}/${this.maxRetries})`);

        return timer(delay);
      })
    );
  }

  /**
   * Determines if an error is retriable
   * @param error The error to check
   * @private
   */
  private isRetriableError(error: unknown): boolean {
    // Handle timeout errors - these are retriable
    if (error instanceof Error && error.name === 'TimeoutError') {
      return true;
    }

    if (error instanceof HttpErrorResponse) {
      // Retry on network errors, timeout errors, and 5xx server errors
      // Do not retry on 4xx client errors (except 429 rate limiting)
      return error.status === 0 ||
             error.status === 429 ||
             (error.status >= 500 && error.status < 600);
    }
    return false;
  }

  /**
   * Processes successful API responses
   * @param response The API response
   * @private
   */
  private processResponse(response: ReservationResponse | null): ReservationResponse {
    console.log('Reservation API response:', response);

    // Handle null or undefined response
    if (!response) {
      console.warn('Received null or undefined response from reservation API');
      throw new Error('Invalid response from reservation API');
    }

    // Check if response indicates failure
    if (response.success === false) {
      throw new Error(response.error || 'Reservation failed');
    }

    // If success property is missing, assume success if we have a reservationId
    if (response.success === undefined && response.reservationId) {
      console.log('Response missing success property, but has reservationId - assuming success');
      return {
        ...response,
        success: true
      };
    }

    // If success property is missing and no reservationId, assume failure
    /*if (response.success === undefined) {
      console.warn('Response missing success property and reservationId');
      throw new Error('Invalid response format from reservation API');
    }*/

    return response;
  }

  /**
   * Handles errors from API calls
   * @param error The error to handle
   * @private
   */
  private handleError(error: unknown): Observable<never> {
    // Filter sensitive information from error logging
    const safeError = this.sanitizeErrorForLogging(error);
    console.error('Reservation service error:', safeError);

    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return throwError(() => this.createReservationError(
        'The reservation request timed out. Please check your connection and try again.',
        error
      ));
    }

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          return throwError(() => this.createReservationError(
            'Authentication failed. Please log in again.',
            error
          ));
        case 403:
          return throwError(() => this.createReservationError(
            'You do not have permission to make reservations.',
            error
          ));
        case 400:
          return throwError(() => this.createReservationError(
            error.error?.message || 'Invalid reservation data.',
            error
          ));
        case 429:
          return throwError(() => this.createReservationError(
            'Too many requests. Please wait a moment and try again.',
            error
          ));
        case 0:
          return throwError(() => this.createReservationError(
            'Unable to connect to the reservation service. Please check your internet connection.',
            error
          ));
        default:
          if (error.status >= 500) {
            return throwError(() => this.createReservationError(
              'The reservation service is temporarily unavailable. Please try again later.',
              error
            ));
          }
          return throwError(() => this.createReservationError(
            'An unexpected error occurred. Please try again.',
            error
          ));
      }
    }

    return throwError(() => this.createReservationError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      error
    ));
  }

  /**
   * Sanitizes error objects for logging by removing sensitive information
   * @param error The error to sanitize
   * @private
   */
  private sanitizeErrorForLogging(error: unknown): unknown {
    if (error instanceof HttpErrorResponse) {
      return {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        // Exclude potentially sensitive error body
        error: error.error ? '[Redacted]' : undefined
      };
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    return error;
  }

  /**
   * Creates a standardized reservation error
   * @param message The error message
   * @param originalError The original error
   * @private
   */
  private createReservationError(message: string, originalError?: unknown): ReservationError {
    return {
      message,
      code: originalError instanceof HttpErrorResponse ? originalError.status.toString() : undefined,
      details: originalError
    };
  }
}
