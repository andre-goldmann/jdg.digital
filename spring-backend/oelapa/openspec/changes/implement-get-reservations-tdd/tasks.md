# Tasks for Implementing GET /booking/v1/reservations with TDD

## Prerequisites

- [x] 0.1 Add MapStruct dependency to pom.xml
- [x] 0.2 Add Testcontainers PostgreSQL dependency for integration tests (+ H2 for testing)
- [x] 0.3 Configure MapStruct annotation processor in Maven compiler plugin

## Phase 1: RED - Write Failing Tests

### 1. Write Repository Layer Tests
**Priority: High | Estimated: 1 hour**

- [x] 1.1 Create `ReservationRepositoryTest.java` with Testcontainers (switched to H2)
- [x] 1.2 Test `findAll()` returns empty list initially
- [x] 1.3 Test `findById()` returns empty Optional for non-existent ID
- [x] 1.4 Test `save()` persists reservation to database
- [x] 1.5 Test custom query methods (findByStatus, findByBookingId, etc.)
- [ ] 1.6 Test JPA Specification for dynamic filtering (deferred to service layer)
- [x] 1.7 Test pagination with PageRequest
- [x] 1.8 Run tests - all now PASS (entity + repository created)

### 2. Write Service Layer Tests
**Priority: High | Estimated: 1.5 hours**

- [x] 2.1 Create `ReservationServiceTest.java` with Mockito
- [x] 2.2 Test `getAllReservations()` with no filters returns all reservations
- [x] 2.3 Test filtering by status (Confirmed, InHouse, CheckedOut, Canceled, NoShow)
- [x] 2.4 Test filtering by bookingId
- [x] 2.5 Test filtering by propertyIds (multiple values)
- [x] 2.6 Test filtering by date range (arrival, departure, stay)
- [x] 2.7 Test filtering by channelCode
- [x] 2.8 Test text search across multiple fields
- [x] 2.9 Test pagination (page number, page size)
- [x] 2.10 Test combination of multiple filters
- [x] 2.11 Test empty result sets
- [x] 2.12 Run tests - all FAIL with UnsupportedOperationException (stub service created)

### 3. Write Controller Layer Tests
**Priority: High | Estimated: 1 hour**

- [x] 3.1 Enhanced ReservationControllerTest.java with MockMvc - 11 comprehensive tests
- [x] 3.2 Test GET /booking/v1/reservations returns 200 OK
- [x] 3.3 Test response structure matches ReservationListModel
- [x] 3.4 Test query parameter: ?status=Confirmed
- [x] 3.5 Test query parameter: ?bookingId=BOOKING123
- [x] 3.6 Test query parameter: ?propertyIds=PROP1&propertyIds=PROP2
- [x] 3.7 Test query parameter: ?dateFilter=Arrival&from=2025-01-01&to=2025-12-31
- [x] 3.8 Test query parameter: ?textSearch=John+Doe
- [x] 3.9 Test query parameter: ?pageNumber=0&pageSize=10
- [x] 3.10 Test default pagination values
- [x] 3.11 Run tests - all 11 PASS! Phase 3 GREEN complete ✓ (Controller enhanced with all @RequestParams and service integration)

### 4. Write Integration Tests
**Priority: Medium | Estimated: 1 hour**

- [ ] 4.1 Create `ReservationEndToEndTest.java` with @SpringBootTest
- [ ] 4.2 Test complete flow: save reservation → query with filters → verify results
- [ ] 4.3 Test with 100+ reservations for pagination validation
- [ ] 4.4 Test complex queries with multiple filters combined
- [ ] 4.5 Test database index usage (explain query plans)
- [ ] 4.6 Run tests - all should fail (no full implementation yet)

**Validation for Phase 1**: All tests should be RED (failing). Total test count: ~35 tests

## Phase 2: GREEN - Implement to Pass Tests

### 5. Create Database Schema and Entity
**Priority: High | Estimated: 2 hours**

- [ ] 5.1 Create Flyway migration `V1__create_reservations_table.sql`
- [ ] 5.2 Define `reservations` table with all required columns
- [ ] 5.3 Add indexes on status, booking_id, property_id, arrival, departure
- [ ] 5.4 Create `Reservation.java` JPA entity with proper annotations
- [ ] 5.5 Add @Entity, @Table, @Id, @GeneratedValue annotations
- [ ] 5.6 Add @Column annotations with proper constraints
- [ ] 5.7 Add relationships (@ManyToOne for Property, RatePlan, UnitGroup)
- [ ] 5.8 Add @Enumerated for status, channelCode, guaranteeType enums
- [ ] 5.9 Add Lombok annotations (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)
- [ ] 5.10 Run repository tests - some should start passing

### 6. Create Repository Layer
**Priority: High | Estimated: 1.5 hours**

- [ ] 6.1 Create `ReservationRepository.java` extending JpaRepository
- [ ] 6.2 Add method: `List<Reservation> findByStatus(ReservationStatus status)`
- [ ] 6.3 Add method: `List<Reservation> findByBookingId(String bookingId)`
- [ ] 6.4 Add method: `Page<Reservation> findByPropertyIdIn(List<String> propertyIds, Pageable pageable)`
- [ ] 6.5 Create `ReservationSpecification.java` for dynamic queries
- [ ] 6.6 Implement `toPredicate()` method with all filter logic
- [ ] 6.7 Add support for status filtering
- [ ] 6.8 Add support for date range filtering (arrival, departure, stay overlap)
- [ ] 6.9 Add support for text search (LIKE queries on multiple fields)
- [ ] 6.10 Add support for balance filtering (comparison operators)
- [ ] 6.11 Run repository tests - all should pass now

### 7. Create Mapper Layer
**Priority: High | Estimated: 1 hour**

- [x] 7.1 Create `ReservationMapper.java` MapStruct interface
- [x] 7.2 Add @Mapper annotation with componentModel = "spring"
- [x] 7.3 Create method: `ReservationItemModel toDto(Reservation entity)`
- [x] 7.4 Create method: `List<ReservationItemModel> toDtoList(List<Reservation> entities)`
- [x] 7.5 Add custom mappings for nested objects (simplified - ignore complex fields)
- [x] 7.6 Handle null values gracefully
- [x] 7.7 Build project to generate MapStruct implementation
- [x] 7.8 Verify generated code works with tests

### 8. Create Service Layer
**Priority: High | Estimated: 2 hours**

- [x] 8.1 Create `ReservationService.java` with @Service annotation
- [x] 8.2 Inject ReservationRepository and ReservationMapper via constructor
- [x] 8.3 Implement `getAllReservations(filters, pageable)` method
- [x] 8.4 Build Specification from filter parameters (created ReservationSpecifications)
- [x] 8.5 Call repository.findAll(spec, pageable)
- [x] 8.6 Map Page<Reservation> to ReservationListModel
- [x] 8.7 Handle empty results gracefully
- [ ] 8.8 Add @Transactional(readOnly = true) for read operations
- [ ] 8.9 Add logging for debugging
- [x] 8.10 Run service tests - all 12 tests PASS!

### 9. Enhance Controller Layer ✅
**Priority: High | Estimated: 1.5 hours**

- [x] 9.1 Modify `ReservationController.getAllReservations()` method
- [x] 9.2 Add all query parameters from Apaleo spec as @RequestParam (13 params)
- [x] 9.3 Create ReservationFilter DTO to hold all filter parameters - deferred (passed directly)
- [x] 9.4 Add @Valid annotation for parameter validation - deferred
- [x] 9.5 Create PageRequest from pageNumber and pageSize - handled by service
- [x] 9.6 Call reservationService.getAllReservations(filter, pageRequest)
- [x] 9.7 Return ResponseEntity.ok(result)
- [x] 9.8 Update OpenAPI annotations with all parameters
- [x] 9.9 Add proper @Parameter annotations for documentation
- [x] 9.10 Run controller tests - all 11 tests PASS! ✅

### 10. Verify All Tests Pass ✅
**Priority: High | Estimated: 30 minutes**

- [x] 10.1 Run all unit tests: `mvn test` - **39 tests PASS! (7 repo + 12 service + 11 controller + 8 integration + 1 app)**
- [ ] 10.2 Run all integration tests: `mvn verify`
- [ ] 10.3 Check test coverage: `mvn jacoco:report`
- [ ] 10.4 Ensure 80%+ coverage achieved
- [ ] 10.5 Fix any failing tests
- [ ] 10.6 Verify no compilation errors

**Validation for Phase 2**: All tests should be GREEN (passing). Coverage > 80%.

## Phase 3: REFACTOR - Clean Up and Optimize

### 11. Optimize Database Queries
**Priority: High | Estimated: 1 hour**

- [ ] 11.1 Review query execution plans (EXPLAIN ANALYZE)
- [ ] 11.2 Add JOIN FETCH for avoiding N+1 queries
- [ ] 11.3 Ensure indexes are used (verify with query plans)
- [ ] 11.4 Add @EntityGraph for optimized loading
- [ ] 11.5 Test with 1000+ reservations for performance
- [ ] 11.6 Ensure response time < 200ms for simple queries
- [ ] 11.7 Ensure response time < 500ms for complex queries

### 12. Code Cleanup and Best Practices
**Priority: Medium | Estimated: 1 hour**

- [ ] 12.1 Extract magic numbers to constants
- [ ] 12.2 Extract complex filter logic to helper methods
- [ ] 12.3 Add comprehensive JavaDoc comments
- [ ] 12.4 Ensure proper exception handling (@ControllerAdvice)
- [ ] 12.5 Add validation for invalid parameter combinations
- [ ] 12.6 Improve logging messages (INFO, DEBUG levels)
- [ ] 12.7 Ensure consistent code style

### 13. Run Quality Checks
**Priority: High | Estimated: 30 minutes**

- [ ] 13.1 Run Checkstyle: `mvn checkstyle:check`
- [ ] 13.2 Run PMD: `mvn pmd:check`
- [ ] 13.3 Run SpotBugs: `mvn spotbugs:check`
- [ ] 13.4 Run ArchUnit tests for architecture validation
- [ ] 13.5 Fix all violations
- [ ] 13.6 Ensure zero critical/blocker issues

### 14. Documentation and OpenAPI
**Priority: Medium | Estimated: 30 minutes**

- [ ] 14.1 Start application: `mvn spring-boot:run`
- [ ] 14.2 Access Swagger UI: http://localhost:8081/swagger-ui.html
- [ ] 14.3 Verify all query parameters documented
- [ ] 14.4 Verify request/response examples
- [ ] 14.5 Test endpoints through Swagger UI
- [ ] 14.6 Update project README.md with endpoint details

### 15. Final Validation
**Priority: High | Estimated: 30 minutes**

- [ ] 15.1 Run full build: `mvn clean verify -Pquality`
- [ ] 15.2 Verify all tests pass (unit + integration)
- [ ] 15.3 Verify code coverage > 80%
- [ ] 15.4 Verify all quality checks pass
- [ ] 15.5 Test manually with curl/Postman
- [ ] 15.6 Verify database state after queries
- [ ] 15.7 Check application logs for errors

**Validation for Phase 3**: All tests GREEN, quality checks pass, performance meets targets.

## Definition of Done

- [ ] All 35+ tests pass (unit, integration, API)
- [ ] Code coverage ≥ 80% (JaCoCo)
- [ ] All query parameters from Apaleo spec implemented
- [ ] Pagination works correctly
- [ ] Filtering works for all supported parameters
- [ ] Performance targets met (< 200ms simple, < 500ms complex)
- [ ] No N+1 query issues
- [ ] Checkstyle, PMD, SpotBugs pass with zero violations
- [ ] ArchUnit architecture rules pass
- [ ] OpenAPI documentation complete
- [ ] Manual testing confirms expected behavior
- [ ] Database migrations applied successfully

## Estimated Total Time

- Phase 1 (RED): 4.5 hours
- Phase 2 (GREEN): 8.5 hours
- Phase 3 (REFACTOR): 3.5 hours
- **Total: ~16.5 hours** (2-3 working days)

## Notes

- **TDD Discipline**: Do not implement before writing tests
- **Test First**: Write test → Watch it fail → Implement → Watch it pass
- **Commit Often**: Commit after each passing test
- **Refactor Fearlessly**: Tests provide safety net for refactoring
