## 1. Domain Model Implementation
- [x] 1.1 Create `MonetaryValue` DTO with amount and currency support
- [x] 1.2 Create `Address` DTO for guest address information
- [x] 1.3 Create `GuestContact` DTO for guest contact details
- [x] 1.4 Create `VehicleRegistration` DTO for guest vehicle information
- [x] 1.5 Create `Guest` DTO with personal information and contact details
- [x] 1.6 Create `PaymentAccount` DTO for payment method information
- [x] 1.7 Create `CancellationFee` and `NoShowFee` DTOs for fee management
- [x] 1.8 Create `Commission` DTO for commission tracking

## 2. Embedded Entity DTOs
- [x] 2.1 Create `EmbeddedProperty` DTO for property references
- [x] 2.2 Create `EmbeddedRatePlan` DTO for rate plan references
- [x] 2.3 Create `EmbeddedUnitGroup` DTO for unit group references
- [x] 2.4 Create `EmbeddedUnit` DTO for unit references
- [x] 2.5 Create `EmbeddedService` DTO for service references
- [x] 2.6 Create `EmbeddedCompany` DTO for company references

## 3. Time Slice and Service DTOs
- [x] 3.1 Create `TimeSlice` DTO for daily reservation breakdown
- [x] 3.2 Create `IncludedService` DTO for services included in time slices
- [x] 3.3 Create `BaseAmount` DTO for pricing breakdown with VAT details

## 4. Core Reservation DTOs
- [x] 4.1 Create `ReservationStatus` enumeration with Apaleo status values
- [x] 4.2 Create `GuaranteeType` enumeration for guarantee types
- [x] 4.3 Create `ChannelCode` enumeration for booking channels
- [x] 4.4 Create `ExternalReferences` DTO for external system references
- [x] 4.5 Create main `Reservation` DTO with all properties and relationships
- [x] 4.6 Create `ReservationItem` DTO for list representations

## 5. Validation and Documentation
- [x] 5.1 Add Jakarta Bean Validation annotations to all DTOs
- [x] 5.2 Add comprehensive JavaDoc documentation
- [x] 5.3 Create example JSON representations in documentation
- [x] 5.4 Add unit tests for DTO validation rules
- [x] 5.5 Verify all DTOs compile and pass quality checks