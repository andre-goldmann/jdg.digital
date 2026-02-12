# Booking API - GET /booking/v1/reservations Implementation

## ADDED Requirements

### Requirement: Reservation Data Persistence
The system SHALL persist reservation data in a PostgreSQL database using JPA entities.

#### Scenario: Reservation entity maps to database table
- **WHEN** the application starts
- **THEN** the `reservations` table is created with all required columns
- **AND** proper indexes exist on frequently queried fields (status, booking_id, property_id, arrival, departure)
- **AND** foreign key constraints exist for relationships (property, rate_plan, unit_group)

#### Scenario: Reservation data is persisted correctly
- **GIVEN** a valid reservation entity
- **WHEN** the entity is saved using the repository
- **THEN** the data is persisted to the database
- **AND** the entity is assigned a generated ID
- **AND** audit fields (created, modified) are populated

### Requirement: Reservation Retrieval Without Filters
The system SHALL return all reservations when no filter parameters are provided via GET /booking/v1/reservations.

#### Scenario: Retrieve all reservations with no filters
- **GIVEN** 10 reservations exist in the database
- **WHEN** GET /booking/v1/reservations is called without query parameters
- **THEN** HTTP 200 OK is returned
- **AND** the response contains a list of 10 reservation items
- **AND** the count field equals 10
- **AND** each reservation contains all required fields (id, bookingId, status, arrival, departure, etc.)

#### Scenario: Retrieve empty result set
- **GIVEN** no reservations exist in the database
- **WHEN** GET /booking/v1/reservations is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains an empty list
- **AND** the count field equals 0

### Requirement: Filter Reservations by Status
The system SHALL filter reservations by status when the status query parameter is provided.

#### Scenario: Filter by single status
- **GIVEN** 5 Confirmed, 3 InHouse, and 2 CheckedOut reservations exist
- **WHEN** GET /booking/v1/reservations?status=Confirmed is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 5 reservations
- **AND** all returned reservations have status = Confirmed

#### Scenario: Filter by multiple statuses
- **GIVEN** 5 Confirmed, 3 InHouse, and 2 CheckedOut reservations exist
- **WHEN** GET /booking/v1/reservations?status=Confirmed&status=InHouse is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 8 reservations
- **AND** all returned reservations have status = Confirmed OR InHouse

#### Scenario: Filter returns no results
- **GIVEN** no Canceled reservations exist
- **WHEN** GET /booking/v1/reservations?status=Canceled is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains an empty list
- **AND** the count field equals 0

### Requirement: Filter Reservations by Booking ID
The system SHALL filter reservations by booking ID when the bookingId query parameter is provided.

#### Scenario: Filter by exact booking ID
- **GIVEN** reservations exist with bookingId "BOOKING123"
- **WHEN** GET /booking/v1/reservations?bookingId=BOOKING123 is called
- **THEN** HTTP 200 OK is returned
- **AND** all returned reservations have bookingId = "BOOKING123"

#### Scenario: Filter returns no matching booking ID
- **GIVEN** no reservations exist with bookingId "NONEXISTENT"
- **WHEN** GET /booking/v1/reservations?bookingId=NONEXISTENT is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains an empty list

### Requirement: Filter Reservations by Property IDs
The system SHALL filter reservations by property IDs when the propertyIds query parameter is provided.

#### Scenario: Filter by single property ID
- **GIVEN** 7 reservations exist for property "PROP1" and 3 for property "PROP2"
- **WHEN** GET /booking/v1/reservations?propertyIds=PROP1 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 7 reservations
- **AND** all returned reservations have property.id = "PROP1"

#### Scenario: Filter by multiple property IDs
- **GIVEN** 7 reservations exist for property "PROP1" and 3 for property "PROP2"
- **WHEN** GET /booking/v1/reservations?propertyIds=PROP1&propertyIds=PROP2 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 10 reservations

### Requirement: Filter Reservations by Date Range
The system SHALL filter reservations by date range when dateFilter, from, and to query parameters are provided.

#### Scenario: Filter by arrival date range
- **GIVEN** reservations exist with arrival dates between 2025-01-01 and 2025-12-31
- **WHEN** GET /booking/v1/reservations?dateFilter=Arrival&from=2025-06-01&to=2025-06-30 is called
- **THEN** HTTP 200 OK is returned
- **AND** all returned reservations have arrival date >= 2025-06-01 and < 2025-06-30

#### Scenario: Filter by departure date range
- **GIVEN** reservations exist with departure dates between 2025-01-01 and 2025-12-31
- **WHEN** GET /booking/v1/reservations?dateFilter=Departure&from=2025-06-01&to=2025-06-30 is called
- **THEN** HTTP 200 OK is returned
- **AND** all returned reservations have departure date >= 2025-06-01 and < 2025-06-30

#### Scenario: Filter by stay overlap
- **GIVEN** a reservation with arrival 2025-06-10 and departure 2025-06-15
- **WHEN** GET /booking/v1/reservations?dateFilter=Stay&from=2025-06-12&to=2025-06-14 is called
- **THEN** HTTP 200 OK is returned
- **AND** the reservation is included in results (overlapping dates)

#### Scenario: Date range validation
- **GIVEN** invalid date range where to < from
- **WHEN** GET /booking/v1/reservations?dateFilter=Arrival&from=2025-12-31&to=2025-01-01 is called
- **THEN** HTTP 400 Bad Request is returned
- **AND** error message indicates invalid date range

### Requirement: Filter Reservations by Channel Code
The system SHALL filter reservations by channel code when the channelCode query parameter is provided.

#### Scenario: Filter by single channel code
- **GIVEN** 15 Direct reservations and 10 BookingCom reservations exist
- **WHEN** GET /booking/v1/reservations?channelCode=Direct is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 15 reservations
- **AND** all returned reservations have channelCode = Direct

#### Scenario: Filter by multiple channel codes
- **GIVEN** 15 Direct, 10 BookingCom, and 5 Expedia reservations exist
- **WHEN** GET /booking/v1/reservations?channelCode=Direct&channelCode=BookingCom is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 25 reservations

### Requirement: Full-Text Search Across Reservation Fields
The system SHALL support text search across multiple reservation fields when the textSearch query parameter is provided.

#### Scenario: Search by guest name
- **GIVEN** a reservation exists with primaryGuest.firstName = "John" and lastName = "Doe"
- **WHEN** GET /booking/v1/reservations?textSearch=John is called
- **THEN** HTTP 200 OK is returned
- **AND** the reservation is included in results

#### Scenario: Search by email
- **GIVEN** a reservation exists with primaryGuest.email = "[email protected]"
- **WHEN** GET /booking/v1/reservations?textSearch=john is called
- **THEN** HTTP 200 OK is returned
- **AND** the reservation is included in results

#### Scenario: Search by external code
- **GIVEN** a reservation exists with externalCode = "EXT-12345"
- **WHEN** GET /booking/v1/reservations?textSearch=EXT-12345 is called
- **THEN** HTTP 200 OK is returned
- **AND** the reservation is included in results

#### Scenario: Case-insensitive search
- **GIVEN** a reservation exists with primaryGuest.firstName = "John"
- **WHEN** GET /booking/v1/reservations?textSearch=john is called (lowercase)
- **THEN** HTTP 200 OK is returned
- **AND** the reservation is included in results

### Requirement: Pagination Support
The system SHALL support pagination using pageNumber and pageSize query parameters.

#### Scenario: First page with default page size
- **GIVEN** 50 reservations exist in the database
- **WHEN** GET /booking/v1/reservations?pageNumber=0&pageSize=10 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 10 reservations
- **AND** the count field equals 50 (total count)

#### Scenario: Second page
- **GIVEN** 50 reservations exist in the database
- **WHEN** GET /booking/v1/reservations?pageNumber=1&pageSize=10 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 10 reservations (items 11-20)

#### Scenario: Last page with partial results
- **GIVEN** 25 reservations exist in the database
- **WHEN** GET /booking/v1/reservations?pageNumber=2&pageSize=10 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 5 reservations (items 21-25)

#### Scenario: Page beyond available data
- **GIVEN** 10 reservations exist in the database
- **WHEN** GET /booking/v1/reservations?pageNumber=5&pageSize=10 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains an empty list
- **AND** the count field equals 10 (total count unchanged)

#### Scenario: Invalid page size
- **GIVEN** any reservations exist
- **WHEN** GET /booking/v1/reservations?pageSize=-1 is called
- **THEN** HTTP 400 Bad Request is returned
- **AND** error message indicates invalid page size

### Requirement: Combined Filter Queries
The system SHALL support combining multiple filter parameters in a single query.

#### Scenario: Filter by status AND date range
- **GIVEN** various reservations exist
- **WHEN** GET /booking/v1/reservations?status=Confirmed&dateFilter=Arrival&from=2025-06-01&to=2025-06-30 is called
- **THEN** HTTP 200 OK is returned
- **AND** all returned reservations have status = Confirmed
- **AND** all returned reservations have arrival date within range

#### Scenario: Filter by property, status, AND channel
- **GIVEN** various reservations exist
- **WHEN** GET /booking/v1/reservations?propertyIds=PROP1&status=InHouse&channelCode=Direct is called
- **THEN** HTTP 200 OK is returned
- **AND** all returned reservations match ALL three criteria

#### Scenario: Complex query with pagination
- **GIVEN** 100 reservations exist matching filter criteria
- **WHEN** GET /booking/v1/reservations?status=Confirmed&propertyIds=PROP1&pageNumber=0&pageSize=20 is called
- **THEN** HTTP 200 OK is returned
- **AND** the response contains exactly 20 reservations
- **AND** all match the filter criteria
- **AND** the count field shows total matching records (not just page size)

### Requirement: Performance and Optimization
The system SHALL ensure efficient query execution and prevent common performance issues.

#### Scenario: No N+1 query problem
- **GIVEN** 100 reservations exist with relationships to property, ratePlan, unitGroup
- **WHEN** GET /booking/v1/reservations is called
- **THEN** all data is loaded with a single query (or minimal queries using JOIN FETCH)
- **AND** no additional queries are executed per reservation item

#### Scenario: Index utilization
- **GIVEN** database indexes exist on status, booking_id, property_id, arrival, departure
- **WHEN** queries use these fields as filters
- **THEN** database query plans show index scans (not sequential scans)

#### Scenario: Response time for simple queries
- **GIVEN** any number of reservations exist
- **WHEN** GET /booking/v1/reservations?status=Confirmed is called
- **THEN** response time is less than 200 milliseconds

#### Scenario: Response time for complex queries
- **GIVEN** 1000+ reservations exist
- **WHEN** GET /booking/v1/reservations with multiple filters is called
- **THEN** response time is less than 500 milliseconds

### Requirement: Error Handling and Validation
The system SHALL validate input parameters and return appropriate error responses.

#### Scenario: Invalid status value
- **WHEN** GET /booking/v1/reservations?status=InvalidStatus is called
- **THEN** HTTP 400 Bad Request is returned
- **AND** error message indicates invalid status value

#### Scenario: Invalid date format
- **WHEN** GET /booking/v1/reservations?dateFilter=Arrival&from=invalid-date is called
- **THEN** HTTP 400 Bad Request is returned
- **AND** error message indicates invalid date format

#### Scenario: Missing required date filter parameter
- **WHEN** GET /booking/v1/reservations?from=2025-01-01&to=2025-12-31 is called (missing dateFilter)
- **THEN** HTTP 400 Bad Request is returned
- **AND** error message indicates dateFilter is required when using from/to

#### Scenario: Server error handling
- **GIVEN** database connection fails
- **WHEN** GET /booking/v1/reservations is called
- **THEN** HTTP 500 Internal Server Error is returned
- **AND** error is logged
- **AND** generic error message is returned (no sensitive details exposed)

### Requirement: OpenAPI Documentation
The system SHALL provide complete OpenAPI documentation for the GET /booking/v1/reservations endpoint.

#### Scenario: All query parameters documented
- **WHEN** Swagger UI is accessed
- **THEN** all query parameters are listed (bookingId, propertyIds, status, dateFilter, from, to, channelCode, textSearch, pageNumber, pageSize, etc.)
- **AND** each parameter has description, type, and example values
- **AND** enum values are listed for status, channelCode, dateFilter

#### Scenario: Response schema documented
- **WHEN** Swagger UI shows the response schema
- **THEN** ReservationListModel structure is documented
- **AND** nested objects (EmbeddedProperty, MonetaryValue, etc.) are documented
- **AND** example responses are provided
