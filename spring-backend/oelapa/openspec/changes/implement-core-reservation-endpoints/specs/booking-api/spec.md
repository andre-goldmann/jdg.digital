# Booking API - Core Reservation Operations

## ADDED Requirements

### Requirement: Count Reservations Endpoint
The system SHALL provide an endpoint to count reservations matching filter criteria without returning the full reservation data.

#### Scenario: Count all reservations
**Given** the reservation system is operational  
**When** a client makes a GET request to `/booking/v1/reservations/$count`  
**Then** the system SHALL return HTTP 200 OK  
**And** the response SHALL contain a `CountModel` with a count field  
**When** no reservations exist  
**Then** the count SHALL be 0  

#### Scenario: Count filtered reservations  
**Given** the reservation system is operational  
**When** a client makes a GET request to `/booking/v1/reservations/$count` with query parameters  
**Then** the system SHALL accept the same query parameters as the main reservations list endpoint  
**And** the system SHALL return HTTP 200 OK  
**And** the response SHALL contain a `CountModel` with the filtered count  

### Requirement: Individual Reservation Retrieval
The system SHALL provide an endpoint to retrieve a specific reservation by its unique identifier.

#### Scenario: Get existing reservation by ID
**Given** the reservation system is operational  
**When** a client makes a GET request to `/booking/v1/reservations/{id}` with a valid reservation ID  
**Then** the system SHALL return HTTP 200 OK  
**And** the response SHALL contain a `ReservationModel` with reservation details  

#### Scenario: Get reservation with expandable resources
**Given** the reservation system is operational  
**When** a client makes a GET request to `/booking/v1/reservations/{id}` with expand parameter  
**Then** the system SHALL accept expand parameter with values: timeSlices, services, booker, actions, company, assignedUnits  
**And** the system SHALL return HTTP 200 OK  
**And** the response SHALL include the requested expanded resources  

#### Scenario: Handle non-existent reservation  
**Given** the reservation system is operational  
**When** a client makes a GET request to `/booking/v1/reservations/{id}` with non-existent ID  
**Then** the system SHALL return HTTP 404 Not Found  

### Requirement: Reservation Property Modification
The system SHALL provide an endpoint to modify specific reservation properties using JSON Patch operations.

#### Scenario: Update reservation properties
**Given** the reservation system is operational  
**And** a reservation exists with the given ID  
**When** a client makes a PATCH request to `/booking/v1/reservations/{id}` with valid JSON Patch operations  
**Then** the system SHALL return HTTP 204 No Content  
**And** the reservation properties SHALL be updated according to the patch operations  

#### Scenario: Support specific patch operations
**Given** the reservation system is operational  
**When** a client sends JSON Patch operations for supported fields  
**Then** the system SHALL support operations for:  
- Comment (add, replace, remove)  
- GuestComment (add, replace, remove)  
- PaymentAccount (add, replace, remove)  
- TravelPurpose (add, replace, remove)  
- AdditionalGuests (add, replace, remove)  
- Commission (add, replace, remove)  
- MarketSegment (add, replace, remove)  
- PrimaryGuest (replace)  
- IsOpenForCharges (replace)  
- IsPreCheckedIn (replace)  
- ValidationMessages (remove)  

#### Scenario: Handle invalid patch operations  
**Given** the reservation system is operational  
**When** a client makes a PATCH request with invalid JSON Patch format  
**Then** the system SHALL return HTTP 400 Bad Request  
**And** the response SHALL include validation error details  

#### Scenario: Handle non-existent reservation for patch  
**Given** the reservation system is operational  
**When** a client makes a PATCH request to `/booking/v1/reservations/{id}` with non-existent ID  
**Then** the system SHALL return HTTP 404 Not Found  

## ADDED Data Models

### CountModel
```java
@Data
@Builder
@Schema(description = "Count of items matching filter criteria")
public class CountModel {
    @JsonProperty("count")
    @Schema(description = "Number of items that match the filter criteria", required = true)
    private Long count;
}
```

### ReservationModel  
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Individual reservation details")
public class ReservationModel {
    @JsonProperty("id")
    @Schema(description = "Unique reservation identifier", required = true)
    private String id;
    
    @JsonProperty("bookingId")
    @Schema(description = "Booking identifier that groups related reservations")
    private String bookingId;
    
    @JsonProperty("status")
    @Schema(description = "Current reservation status", required = true)
    private ReservationStatus status;
    
    @JsonProperty("arrival")
    @Schema(description = "Arrival date and time")
    private LocalDateTime arrival;
    
    @JsonProperty("departure") 
    @Schema(description = "Departure date and time")
    private LocalDateTime departure;
    
    @JsonProperty("primaryGuest")
    @Schema(description = "Primary guest information")
    private Guest primaryGuest;
    
    @JsonProperty("totalGrossAmount")
    @Schema(description = "Total gross amount for the reservation")
    private MonetaryAmount totalGrossAmount;
    
    // Expandable resources
    @JsonProperty("timeSlices")
    @Schema(description = "Time slices for the reservation (expandable)")
    private List<TimeSlice> timeSlices;
    
    @JsonProperty("services")
    @Schema(description = "Services associated with the reservation (expandable)")
    private List<ServiceModel> services;
    
    @JsonProperty("booker")
    @Schema(description = "Booker information (expandable)")
    private BookerModel booker;
    
    @JsonProperty("actions")
    @Schema(description = "Available actions for the reservation (expandable)")
    private List<ActionModel> actions;
    
    @JsonProperty("company")
    @Schema(description = "Company information (expandable)")
    private CompanyModel company;
    
    @JsonProperty("assignedUnits")
    @Schema(description = "Assigned units for the reservation (expandable)")
    private List<AssignedUnitModel> assignedUnits;
}
```

## ADDED API Endpoints

### GET /booking/v1/reservations/$count
- **Summary**: Returns the number of reservations fulfilling the criteria
- **Parameters**: Same query parameters as main reservations endpoint
- **Response**: 200 OK with CountModel
- **Error Responses**: 400 Bad Request, 500 Internal Server Error

### GET /booking/v1/reservations/{id}
- **Summary**: Returns a specific reservation by ID
- **Parameters**: 
  - `id` (path): Reservation identifier
  - `expand` (query): List of resources to expand
- **Response**: 200 OK with ReservationModel
- **Error Responses**: 404 Not Found, 400 Bad Request, 500 Internal Server Error

### PATCH /booking/v1/reservations/{id}
- **Summary**: Modify reservation properties using JSON Patch
- **Parameters**:
  - `id` (path): Reservation identifier  
  - Request body: Array of JSON Patch operations
- **Response**: 204 No Content
- **Error Responses**: 404 Not Found, 400 Bad Request, 422 Unprocessable Entity, 500 Internal Server Error