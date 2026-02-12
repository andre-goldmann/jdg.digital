# Implement Core Reservation Operations Endpoints

## Why

The project currently has only one reservation endpoint implemented (`GET /booking/v1/reservations`) but is missing the other core reservation operations that are essential for a complete Apaleo-compliant API. Based on the Apaleo Booking API specification, the following core endpoints are missing:

1. `GET /booking/v1/reservations/$count` - Count reservations matching criteria
2. `GET /booking/v1/reservations/{id}` - Get a specific reservation by ID  
3. `PATCH /booking/v1/reservations/{id}` - Modify reservation properties

These endpoints form the foundation of reservation management and are required for any client application to perform basic reservation operations like retrieving individual reservations, counting filtered results, and updating reservation data.

## What Changes

This proposal implements the three missing core reservation operation endpoints following the Apaleo API specification:

### New Endpoints to Implement

1. **GET /booking/v1/reservations/$count**
   - Returns count of reservations matching filter criteria
   - Supports same query parameters as the main GET endpoint
   - Returns `CountModel` response

2. **GET /booking/v1/reservations/{id}**
   - Retrieves a specific reservation by ID
   - Supports `expand` query parameter for related resources
   - Returns `ReservationModel` response

3. **PATCH /booking/v1/reservations/{id}**
   - Modifies reservation properties using JSON Patch operations
   - Supports operations for Comment, GuestComment, PaymentAccount, etc.
   - Returns 204 No Content on success

### Required DTOs/Models

- `CountModel` - Response for count endpoint
- `ReservationModel` - Response for individual reservation
- JSON Patch operation support in request handling

## Impact

### Affected Specs
- `booking-api` - Enhanced with complete core reservation operations

### Affected Code
- **Modified**: `ReservationController.java` - Add three new endpoint methods
- **New**: `CountModel.java` - DTO for count responses
- **New**: `ReservationModel.java` - DTO for individual reservation responses
- **Updated**: OpenAPI documentation with new endpoints

### Dependencies
- No additional dependencies required (Spring Boot Web already included)
- Uses existing DTO infrastructure

### Breaking Changes
- None (purely additive changes)
- Existing `GET /booking/v1/reservations` endpoint remains unchanged

### Non-Goals
- No business logic implementation (returns empty/default responses)
- No database integration
- No authentication/authorization logic
- No validation beyond basic parameter presence

## Success Criteria

1. All three endpoints respond with correct HTTP status codes
2. Response models match Apaleo API specification structure
3. OpenAPI documentation is generated correctly
4. Integration tests pass for all endpoints
5. No breaking changes to existing functionality