## ADDED Requirements

### Requirement: Monetary Value Representation
The system SHALL provide a standardized way to represent monetary values with currency information.

#### Scenario: Monetary value creation
- **WHEN** a monetary amount needs to be represented
- **THEN** it SHALL include both amount and currency code
- **AND** support decimal precision appropriate for financial calculations

#### Scenario: Currency validation
- **WHEN** a monetary value is created with invalid currency
- **THEN** validation SHALL reject the value with appropriate error message

### Requirement: Guest Information Management
The system SHALL maintain comprehensive guest information including personal details and contact information.

#### Scenario: Guest creation with complete information
- **WHEN** a guest is created with full details
- **THEN** it SHALL include title, gender, names, email, phone, and address
- **AND** optionally include vehicle registration information

#### Scenario: Guest contact validation
- **WHEN** guest contact information is provided
- **THEN** email format SHALL be validated
- **AND** phone number format SHALL be validated

### Requirement: Address Information Storage
The system SHALL store guest address information with international support.

#### Scenario: International address support
- **WHEN** an address is created
- **THEN** it SHALL support multiple address lines, postal code, city, and country code
- **AND** country code SHALL be validated against ISO standards

### Requirement: Reservation Status Management
The system SHALL track reservation status through its lifecycle with proper state validation.

#### Scenario: Valid status transitions
- **WHEN** reservation status is updated
- **THEN** it SHALL only allow valid status values: Confirmed, InHouse, CheckedOut, Canceled, NoShow
- **AND** maintain audit trail of status changes

#### Scenario: Status-dependent operations
- **WHEN** operations are performed on reservations
- **THEN** system SHALL validate operations are allowed for current status
- **AND** prevent invalid state transitions

### Requirement: Embedded Entity References
The system SHALL provide lightweight reference objects for related entities without full entity loading.

#### Scenario: Property reference
- **WHEN** a reservation references a property
- **THEN** embedded reference SHALL include id, code, name, and description
- **AND** avoid loading full property entity unless needed

#### Scenario: Rate plan reference
- **WHEN** a reservation references a rate plan
- **THEN** embedded reference SHALL include id, code, name, description, and city tax flag
- **AND** maintain referential integrity with actual rate plan

### Requirement: Time Slice Management
The system SHALL break down multi-day reservations into daily time slices for detailed pricing and service tracking.

#### Scenario: Multi-day reservation breakdown
- **WHEN** a reservation spans multiple days
- **THEN** each day SHALL be represented as a separate time slice
- **AND** each time slice SHALL include from/to dates, service date, and pricing details

#### Scenario: Time slice service inclusion
- **WHEN** services are included in a time slice
- **THEN** each service SHALL include service details, count, amount, and booking status
- **AND** support both included and extra services

### Requirement: Payment and Guarantee Tracking
The system SHALL track payment methods and guarantee information for reservations.

#### Scenario: Payment account storage
- **WHEN** payment information is stored
- **THEN** sensitive data SHALL be properly masked or tokenized
- **AND** include payment method, expiry, and status information

#### Scenario: Guarantee type validation
- **WHEN** guarantee type is specified
- **THEN** it SHALL be validated against supported guarantee types
- **AND** ensure appropriate payment information is provided

### Requirement: External System Integration
The system SHALL maintain references to external systems for integration and synchronization purposes.

#### Scenario: External reference tracking
- **WHEN** reservations are synchronized with external systems
- **THEN** external references SHALL be stored for GDS, OTA, CRS, and other systems
- **AND** support bidirectional synchronization using these references

### Requirement: Fee and Commission Management
The system SHALL track cancellation fees, no-show fees, and commission information.

#### Scenario: Cancellation fee calculation
- **WHEN** cancellation fees apply to a reservation
- **THEN** fee details SHALL include policy reference, due date, and fee amount
- **AND** support different cancellation policies based on booking terms

#### Scenario: Commission tracking
- **WHEN** reservations include commission
- **THEN** commission SHALL include both commission amount and pre-commission amount
- **AND** support commission calculations for different booking channels

### Requirement: Data Validation and Integrity
The system SHALL validate all DTO fields according to business rules and data constraints.

#### Scenario: Required field validation
- **WHEN** DTOs are created or updated
- **THEN** all required fields SHALL be validated for presence and format
- **AND** provide clear validation error messages for field violations

#### Scenario: Business rule validation
- **WHEN** complex business rules apply
- **THEN** cross-field validation SHALL be performed
- **AND** ensure data consistency across related fields