# Create Reservation Domain DTOs

## Why
The system needs domain DTOs (Data Transfer Objects) for reservation management to provide a clean abstraction layer between the Apaleo API integration and our internal business logic. Currently, we have no reservation domain model, which limits our ability to implement reservation management features and maintain separation of concerns between external API structures and internal domain models.

## What Changes
- Create comprehensive reservation domain DTOs based on Apaleo API specifications
- Implement reservation status management with proper enumeration
- Add guest information and contact details DTOs
- Create monetary value handling DTOs with currency support
- Implement time slice management for multi-day reservations
- Add embedded entity DTOs for property, rate plan, and unit group references
- Create payment and guarantee type DTOs
- Implement external reference tracking DTOs
- Add validation annotations for data integrity
- Include comprehensive documentation and examples

## Impact
- Affected specs: New `reservation-management` capability
- Affected code: 
  - New package `jdg.digital.oelapa.domain.reservation`
  - New DTOs for Reservation, Guest, Payment, Property references
  - Foundation for future reservation service implementations
  - Basis for REST API controllers and database entity mappings