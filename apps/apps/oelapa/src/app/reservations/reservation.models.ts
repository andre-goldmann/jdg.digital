/**
 * Core reservation data structure for API communication
 */
export interface ReservationRequest {
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType?: string;
  specialRequests?: string;
}

/**
 * API response structure for reservation operations
 */
export interface ReservationResponse {
  success: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
}

/**
 * JWT payload structure for API authentication
 */
export interface JwtPayload {
  email: string;
  accessToken: string;
  iat?: number;
  exp?: number;
}

/**
 * Error interface for reservation operations
 */
export interface ReservationError {
  message: string;
  code?: string;
  details?: unknown;
}