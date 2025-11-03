# Design: Reservation Functionality

## Architecture Overview
The reservation functionality follows Angular service patterns with JWT-based API authentication. The design prioritizes simplicity and security while integrating with the existing Keycloak authentication system.

## Component Architecture

### ReservationService
- **Purpose**: Handle reservation API communication and JWT token generation
- **Dependencies**: AuthenticationService, HttpClient
- **Key Methods**:
  - `createReservation(reservationData)`: Main booking method
  - `generateJwtToken()`: Create signed JWT for API authentication
  - Private methods for HTTP communication and error handling

### JWT Token Generation
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Payload Structure**:
  ```json
  {
    "email": "user@example.com",
    "token": "access_token_from_keycloak"
  }
  ```
- **Security Considerations**: 
  - Secret is environment-configurable but hardcoded for development
  - Token includes user context (email) and auth proof (access token)

### API Integration
- **Endpoint**: `http://localhost:5678/webhook/api/reservervations` (POST)
- **Authentication**: Bearer token (JWT)
- **Request Flow**:
  1. User initiates reservation
  2. Service generates JWT token
  3. HTTP POST request with JWT as Bearer token
  4. Handle response/errors

## Data Models

### ReservationRequest
Core reservation data structure for API communication:
```typescript
interface ReservationRequest {
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType?: string;
  specialRequests?: string;
}
```

### ReservationResponse
API response structure:
```typescript
interface ReservationResponse {
  success: boolean;
  reservationId?: string;
  message?: string;
  error?: string;
}
```

## Security Design

### JWT Token Security
- **Signing**: HMAC SHA-256 with configurable secret
- **Claims**: User email and access token for identity verification
- **Scope**: Single-use tokens for individual API calls
- **Expiration**: Short-lived (consider 15-minute expiry for production)

### Error Handling Strategy
1. **Network Errors**: Retry logic with exponential backoff
2. **Authentication Errors**: Redirect to login or token refresh
3. **Validation Errors**: Surface API validation messages to user
4. **Server Errors**: Generic error message with logging

## Development Considerations

### Environment Configuration
```typescript
// environment.ts
export const environment = {
  production: false,
  reservationApiUrl: 'http://localhost:5678/webhook/api/reservervations',
  jwtSecret: 'a-string-secret-at-least-256-bits-long'
};
```

### Testing Strategy
- **Unit Tests**: Mock HTTP calls and JWT generation
- **Integration Tests**: Test with actual JWT validation
- **Error Scenarios**: Test network failures and invalid responses

## Future Extensibility
- **Reservation Management**: This service can be extended with CRUD operations
- **Validation**: Add client-side validation before API calls
- **Caching**: Implement reservation data caching for performance
- **Offline Support**: Queue reservations when network is unavailable