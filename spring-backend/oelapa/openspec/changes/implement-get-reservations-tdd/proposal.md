# Implement GET /booking/v1/reservations with Full Business Logic using TDD

## Why

The current `GET /booking/v1/reservations` endpoint exists but only returns empty/mock data with no business logic, database integration, or filtering capabilities. The Apaleo API specification defines extensive filtering parameters and query capabilities that are not implemented, making the endpoint non-functional for real-world usage.

To deliver a production-ready reservation management system, we need:
1. **Database persistence layer** - Store and retrieve reservation data from PostgreSQL
2. **Comprehensive filtering** - Support all 20+ query parameters defined in Apaleo spec
3. **Proper pagination** - Handle large result sets efficiently
4. **Test-Driven Development** - Ensure correctness through comprehensive test coverage before implementation

## What Changes

This proposal implements the complete business logic for `GET /booking/v1/reservations` following Test-Driven Development (TDD) methodology:

### New Components

1. **Reservation Entity (JPA)**
   - PostgreSQL table schema with all required fields
   - Proper indexes for query performance
   - Relationships to Property, RatePlan, UnitGroup, etc.

2. **Repository Layer**
   - Spring Data JPA repository with custom query methods
   - JPA Specification for dynamic filtering
   - Support for all query parameters from Apaleo spec

3. **Service Layer**
   - ReservationService for business logic
   - DTO mapping (Entity ↔ DTO) using MapStruct
   - Filtering and pagination logic

4. **Controller Enhancement**
   - Add all query parameters to `getAllReservations()` method
   - Integrate with service layer
   - Proper error handling and validation

5. **Comprehensive Test Suite**
   - Unit tests for service layer (Mockito)
   - Integration tests with Testcontainers (PostgreSQL)
   - API tests for controller endpoints
   - Test coverage for all filtering scenarios

### Filtering Capabilities

The implementation will support all Apaleo-specified query parameters:
- `bookingId` - Filter by booking ID
- `propertyIds` - Filter by property IDs
- `ratePlanIds` - Filter by rate plan IDs
- `companyIds` - Filter by company IDs
- `unitIds` - Filter by assigned unit IDs
- `unitGroupIds` - Filter by unit group IDs
- `unitGroupTypes` - Filter by unit group types (BedRoom, MeetingRoom, etc.)
- `blockIds` - Filter by block IDs
- `marketSegmentIds` - Filter by market segment IDs
- `status` - Filter by reservation status (Confirmed, InHouse, CheckedOut, Canceled, NoShow)
- `dateFilter` - Date filter type (Arrival, Departure, Stay, Creation, Modification, Cancellation)
- `from` / `to` - Date range for filtering
- `channelCode` - Filter by distribution channel
- `sources` - Filter by source
- `validationMessageCategory` - Filter by validation message category
- `externalCode` - Filter by external code (prefix match)
- `textSearch` - Full-text search across multiple fields
- `balanceFilter` - Filter by balance with comparison operators
- `pageNumber` / `pageSize` - Pagination support

## Impact

### Affected Specs
- **booking-api** (new capability spec)
  - Comprehensive requirements for reservation retrieval
  - Filtering and pagination specifications
  - Data persistence requirements

### Affected Code
- **New**: `jdg.digital.oelapa.domain.reservation.Reservation.java` - JPA entity
- **New**: `jdg.digital.oelapa.repository.ReservationRepository.java` - Spring Data JPA repository
- **New**: `jdg.digital.oelapa.repository.specification.ReservationSpecification.java` - Dynamic query builder
- **New**: `jdg.digital.oelapa.service.ReservationService.java` - Business logic service
- **New**: `jdg.digital.oelapa.mapper.ReservationMapper.java` - MapStruct mapper
- **Modified**: `ReservationController.java` - Enhanced with query parameters and service integration
- **New**: Comprehensive test suite across all layers

### Dependencies
- **Spring Data JPA** - Already included, used for database access
- **Hibernate** - Already included, ORM framework
- **Testcontainers** - For integration testing with real PostgreSQL
- **MapStruct** - For DTO mapping (need to add dependency)
- **H2 Database** - Optional, for faster unit tests

### Database Changes
- **New table**: `reservations` with all required columns
- **Indexes**: On commonly queried fields (status, dates, booking_id, property_id)
- **Flyway/Liquibase migration**: Database schema version control

### Breaking Changes
- None (purely enhancing existing skeleton endpoint)

### Non-Goals
- Authentication/Authorization (handled separately by Spring Security)
- Keycloak integration (separate concern)
- Creation, update, deletion of reservations (separate endpoints)
- Payment processing integration
- Complex business rules (cancellation policies, pricing calculations)

## TDD Workflow

This implementation will strictly follow Test-Driven Development:

### Phase 1: RED - Write Failing Tests
1. Write unit tests for ReservationService (with mocked repository)
2. Write integration tests for ReservationRepository (with Testcontainers)
3. Write API tests for ReservationController (MockMvc)
4. Run tests - all should fail initially (no implementation)

### Phase 2: GREEN - Implement to Pass Tests
1. Create JPA entity and database schema
2. Implement repository with custom query methods
3. Implement service layer with filtering logic
4. Enhance controller with query parameters
5. Run tests - all should pass

### Phase 3: REFACTOR - Clean Up
1. Optimize database queries (N+1 problem prevention)
2. Extract reusable filtering logic
3. Improve code readability
4. Ensure proper exception handling
5. Run tests - all should still pass

## Success Criteria

1. ✅ 80%+ test coverage (enforced by JaCoCo)
2. ✅ All tests pass (unit, integration, API)
3. ✅ All query parameters work correctly
4. ✅ Performance: < 200ms response time for simple queries
5. ✅ Performance: < 500ms response time for complex queries with multiple filters
6. ✅ Pagination works correctly (page size limits, offset handling)
7. ✅ Database indexes prevent full table scans
8. ✅ No N+1 query problems (use JOIN FETCH where appropriate)
9. ✅ MapStruct mappers generate correctly at compile time
10. ✅ OpenAPI documentation reflects all query parameters
11. ✅ Checkstyle, PMD, SpotBugs pass without violations
12. ✅ ArchUnit rules validate architecture compliance
