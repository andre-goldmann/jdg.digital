# Tasks for Implementing Core Reservation Operations Endpoints

## Implementation Tasks

### 1. Create Required DTO Models
**Priority: High**
**Estimated Time: 30 minutes**

- [ ] Create `CountModel.java` for count endpoint responses
  - Long count field with JSON property annotation
  - Lombok annotations for builder pattern
  - OpenAPI schema documentation
- [ ] Create `ReservationModel.java` for individual reservation responses  
  - Based on existing `ReservationItemModel` structure
  - Add fields for expandable resources (timeSlices, services, booker, actions, company, assignedUnits)
  - Include all required fields from Apaleo specification
  - Proper Jackson annotations for JSON serialization

**Validation**: DTOs compile without errors and follow project patterns

### 2. Extend ReservationController with New Endpoints
**Priority: High** 
**Estimated Time: 45 minutes**

- [ ] Add `GET /booking/v1/reservations/$count` endpoint method
  - Accept same query parameters as main GET endpoint (for future filtering support)
  - Return `ResponseEntity<CountModel>` with count of 0
  - Add proper OpenAPI annotations (@Operation, @ApiResponses)
  - Add logging statement
- [ ] Add `GET /booking/v1/reservations/{id}` endpoint method
  - Accept `@PathVariable String id` parameter
  - Accept optional `@RequestParam List<String> expand` parameter
  - Return `ResponseEntity<ReservationModel>` with empty/default reservation
  - Add proper OpenAPI annotations 
  - Add logging statement
  - Handle 404 case (return empty optional for now)
- [ ] Add `PATCH /booking/v1/reservations/{id}` endpoint method
  - Accept `@PathVariable String id` parameter
  - Accept `@RequestBody List<Operation>` for JSON Patch operations (Spring Boot has built-in support)
  - Return `ResponseEntity<Void>` with 204 No Content
  - Add proper OpenAPI annotations
  - Add logging statement

**Dependencies**: Requires DTO models from Task 1

**Validation**: 
- All endpoints compile and return appropriate response types
- OpenAPI documentation generates correctly 
- Logging statements appear in console during development testing

### 3. Add Integration Tests
**Priority: Medium**
**Estimated Time: 30 minutes**

- [ ] Add test methods to existing `ReservationControllerIntegrationTest`
  - Test `GET /booking/v1/reservations/$count` returns 200 with CountModel
  - Test `GET /booking/v1/reservations/{id}` returns 200 with ReservationModel  
  - Test `PATCH /booking/v1/reservations/{id}` returns 204 No Content
  - Test appropriate HTTP status codes
  - Test basic request/response structure
- [ ] Ensure all tests pass with current empty implementation

**Dependencies**: Requires Tasks 1 and 2 to be completed

**Validation**: All integration tests pass with `mvn test`

### 4. Verify OpenAPI Documentation
**Priority: Low**
**Estimated Time: 15 minutes**  

- [ ] Start application and access Swagger UI
- [ ] Verify all three new endpoints appear in documentation
- [ ] Verify request/response models are documented correctly
- [ ] Test endpoints through Swagger UI interface
- [ ] Confirm response structures match expectations

**Dependencies**: Requires Tasks 1, 2, and 3 to be completed

**Validation**: Swagger UI shows complete API documentation for all endpoints

## Verification Tasks

### Manual Testing
- [ ] Start Spring Boot application
- [ ] Make HTTP requests to all three endpoints using curl or Postman
- [ ] Verify response status codes and content types
- [ ] Confirm logging output appears correctly

### Automated Testing
- [ ] Run `mvn clean test` to ensure all tests pass
- [ ] Run `mvn spring-boot:run` to verify application starts successfully
- [ ] Run integration tests specifically: `mvn test -Dtest=ReservationControllerIntegrationTest`

### Code Quality
- [ ] Run `mvn checkstyle:check` to verify code style compliance
- [ ] Ensure consistent patterns with existing `getAllReservations` method
- [ ] Verify proper error handling structure is in place (even if not implemented)

## Notes

- **No Business Logic**: All endpoints should return empty/default responses as per requirements
- **Consistency**: Follow patterns established in existing `getAllReservations` method
- **Future-Proofing**: Structure responses to accommodate future business logic implementation
- **Apaleo Compliance**: Ensure response structures match Apaleo API specification exactly

## Definition of Done

- [ ] All three endpoints implemented and functional
- [ ] Integration tests passing 
- [ ] OpenAPI documentation complete and accurate
- [ ] Code follows project style guidelines
- [ ] Manual testing confirms expected behavior
- [ ] No breaking changes to existing functionality