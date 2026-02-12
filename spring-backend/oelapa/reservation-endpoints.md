# Apaleo Booking API - Reservation Endpoints

This document lists all reservation-related endpoints from the Apaleo Booking API specification (`apaleo.booking.api.json`).

## **Main Reservation Endpoints**

### **Core Reservation Operations**

1. **`GET /booking/v1/reservations`**
   - **Summary**: Returns a list of all reservations, filtered by the specified parameters
   - **Description**: Returns a list of all reservations, filtered by the specified parameters. If no parameters are set, returns the entire list.
   - **Required Scopes**: `reservations.read`, `reservations.manage`
   - **Key Features**: Extensive filtering options including booking ID, property IDs, rate plans, unit groups, status, date filters, channel codes, text search, and more

2. **`GET /booking/v1/reservations/$count`**
   - **Summary**: Returns the number of reservations fulfilling the criteria specified in the parameters
   - **Description**: If no parameters are set, returns the total count of reservations.
   - **Required Scopes**: `reservations.read`, `reservations.manage`
   - **Purpose**: Count reservations matching filter criteria without retrieving full data

3. **`GET /booking/v1/reservations/{id}`**
   - **Summary**: Returns a specific reservation
   - **Description**: Retrieves a reservation, specified by its ID.
   - **Required Scopes**: `reservations.read`, `reservations.manage`
   - **Expandable Resources**: `timeSlices`, `services`, `booker`, `actions`, `company`, `assignedUnits`

4. **`PATCH /booking/v1/reservations/{id}`**
   - **Summary**: Allows to modify certain reservation properties
   - **Description**: Supports JSON Patch operations for modifying reservation properties
   - **Required Scopes**: `reservations.manage`
   - **Supported Operations**: 
     - Add, replace, remove: Comment, GuestComment, PaymentAccount, TravelPurpose, AdditionalGuests, Commission, MarketSegment
     - Add company (if not already set)
     - Replace: PrimaryGuest, IsOpenForCharges, IsPreCheckedIn
     - Remove: ValidationMessages

### **Reservation Offers & Services**

5. **`GET /booking/v1/reservations/{id}/offers`**
   - **Summary**: Returns offers for one specific reservation
   - **Description**: Calculates and returns offers for amending a specific reservation.
   - **Required Scopes**: `offers.read`, `reservations.manage`
   - **Parameters**: arrival, departure, adults, childrenAges, channelCode, promoCode, requote, includeUnavailable, unitGroupIds

6. **`GET /booking/v1/reservations/{id}/service-offers`**
   - **Summary**: Returns service offers for one specific reservation
   - **Description**: Calculates and returns service offers for a specific reservation.
   - **Required Scopes**: `offers.read`, `reservations.manage`
   - **Parameters**: channelCode, onlyDefaultDates, includeUnavailable

7. **`GET /booking/v1/reservations/{id}/services`**
   - **Summary**: Returns the services booked for a specific reservation
   - **Description**: Returns the services booked for a specific reservation.
   - **Required Scopes**: `reservations.read`, `reservations.manage`

8. **`DELETE /booking/v1/reservations/{id}/services`**
   - **Summary**: Removes a service from a reservation
   - **Description**: Removes a service from a reservation. The service will not be removed if it is mandatory, already posted or if the service date is in the past.
   - **Required Scopes**: `reservations.manage`
   - **Parameters**: serviceId (required)

### **Booking-Related Reservation Endpoints**

9. **`POST /booking/v1/bookings/{id}/reservations`**
   - **Summary**: Add one or multiple reservations to an existing booking
   - **Description**: Creates new reservations and adds them to an existing booking taking a list of reservations as input
   - **Required Scopes**: `reservations.create`, `reservations.manage`
   - **Features**: Supports Idempotency-Key header

10. **`POST /booking/v1/bookings/{id}/reservations/$force`**
    - **Summary**: Add one or multiple reservations to an existing booking regardless of availability or restrictions
    - **Description**: Creates new reservations and adds them to an existing booking taking a list of reservations as input
    - **Required Scopes**: `reservations.force-create`, `reservations.force-manage`
    - **Features**: Bypasses availability and restriction checks

### **Group-Related Reservation Endpoints**

11. **`POST /booking/v1/groups/{id}/reservations`**
    - **Summary**: Add one or multiple reservations to an existing group booking using blocked inventory
    - **Description**: Creates new reservations and adds them to an existing group booking taking a list of reservations as input
    - **Required Scopes**: `groups.manage`, `reservations.manage`
    - **Features**: Uses blocked inventory from group bookings

## **Reservation Action Endpoints**

### **Unit Assignment Actions**

12. **`PUT /booking/v1/reservation-actions/{id}/assign-unit`**
    - **Summary**: Assign a unit to a reservation
    - **Description**: Assigns one of the available units to a reservation which is in state 'Confirmed' or 'InHouse'.
    - **Required Scopes**: `reservations.assign-unit`, `reservations.manage`
    - **Parameters**: unitConditions (optional: Clean, CleanToBeInspected, Dirty)

13. **`PUT /booking/v1/reservation-actions/{id}/assign-unit/{unitId}`**
    - **Summary**: Assign a specific unit to a reservation
    - **Description**: Assigns a specific unit to a reservation which is in state 'Confirmed' or 'InHouse'. If the unit is not available, the call will return an error.
    - **Required Scopes**: `reservations.assign-unit`, `reservations.manage`
    - **Parameters**: from, to, lockUnit

14. **`PUT /booking/v1/reservation-actions/{id}/unassign-units`**
    - **Summary**: Unassign units from a reservation
    - **Description**: Unassigns units for all time slices of the given reservation. If no units are assigned for the reservation nothing will happen. It will fail for reservations in status 'CheckedOut'.
    - **Required Scopes**: `reservations.assign-unit`, `reservations.manage`

15. **`PUT /booking/v1/reservation-actions/{id}/lock-unit`**
    - **Summary**: Lock unit assignment for a reservation
    - **Description**: Locks the currently assigned unit(s) for a reservation, preventing any reassignment or unassignment operations. Only reservations in 'Confirmed' or 'InHouse' status can be locked.
    - **Required Scopes**: `reservations.manage`

16. **`PUT /booking/v1/reservation-actions/{id}/unlock-unit`**
    - **Summary**: Unlock unit assignment for a reservation
    - **Description**: Unlocks the currently assigned unit(s) for a reservation that were previously locked, allowing reassignment or unassignment operations.
    - **Required Scopes**: `reservations.manage`

### **Guest Journey Actions**

17. **`PUT /booking/v1/reservation-actions/{id}/checkin`**
    - **Summary**: Check-in of a reservation
    - **Description**: Check in a specific reservation which is in status 'Confirmed', and has a unit assigned. This changes the status to 'InHouse', and sets the check-in date and time.
    - **Required Scopes**: `reservations.manage`
    - **Parameters**: withCityTax (default: true)

18. **`PUT /booking/v1/reservation-actions/{id}/revert-checkin`**
    - **Summary**: Reverses the check-in of a reservation
    - **Description**: Reverses the check-in of a reservation
    - **Required Scopes**: `reservations.manage`

19. **`PUT /booking/v1/reservation-actions/{id}/checkout`**
    - **Summary**: Check-out of a reservation
    - **Description**: Check out a specific reservation which is in status 'InHouse'. This changes the status to 'CheckedOut', and sets the check-out date and time. All open charges on the folio will be posted. Check-out is only possible, if the departure date is not later than tomorrow.
    - **Required Scopes**: `reservations.manage`

### **Status Change Actions**

20. **`PUT /booking/v1/reservation-actions/{id}/cancel`**
    - **Summary**: Cancel a reservation
    - **Description**: Cancel a specific reservation which is in status 'Confirmed' and where the arrival time is in the future. This changes the status to 'Canceled', and sets the cancellation date and time.
    - **Required Scopes**: `reservations.manage`

21. **`PUT /booking/v1/reservation-actions/{id}/noshow`**
    - **Summary**: Set a reservation to No-show
    - **Description**: Set a specific reservation to No-show which is in status 'Confirmed' and where the arrival date is in the past. This changes the status to 'NoShow', and sets the no-show date and time.
    - **Required Scopes**: `reservations.manage`

### **Modification Actions**

22. **`PUT /booking/v1/reservation-actions/{id}/amend`**
    - **Summary**: Allows you to amend the stay details of a reservation
    - **Description**: Modifies the stay-related data of a reservation. If a reservation is 'Confirmed', you can change all fields. If a reservation is 'InHouse', only changes to future time slices are possible. Changes to reservations that are in the status 'CheckedOut' or 'Canceled' are not possible at all.
    - **Required Scopes**: `reservations.manage`

23. **`PUT /booking/v1/reservation-actions/{id}/amend/$force`**
    - **Summary**: Allows you to amend the stay details of a reservation regardless of availability or restrictions
    - **Description**: Same as regular amend but bypasses availability and restriction checks
    - **Required Scopes**: `reservations.force-manage`

### **Service Actions**

24. **`PUT /booking/v1/reservation-actions/{id}/book-service`**
    - **Summary**: Book the service for a specific reservation
    - **Description**: Use this to book a service for a specific reservation. Please note that when dates are specified, all desired dates must be specified or they will be removed if not posted to the folio.
    - **Required Scopes**: `reservations.manage`

25. **`PUT /booking/v1/reservation-actions/{id}/book-service/$force`**
    - **Summary**: Book the service for a specific reservation regardless of availability
    - **Description**: Same as regular book-service but bypasses availability checks
    - **Required Scopes**: `reservations.manage`

### **City Tax Actions**

26. **`PUT /booking/v1/reservation-actions/{id}/add-city-tax`**
    - **Summary**: Adds the city tax to a reservation
    - **Description**: Use this if you want to add the city tax to a reservation.
    - **Required Scopes**: `reservations.manage`

27. **`PUT /booking/v1/reservation-actions/{id}/remove-city-tax`**
    - **Summary**: Removes the city tax from a reservation
    - **Description**: Use this is you want to remove the city tax from a reservation before the stay.
    - **Required Scopes**: `reservations.manage`

---

## **Summary**

**Total: 27 reservation-related endpoints** covering the complete reservation lifecycle:

- **Core Operations**: CRUD operations for reservations with extensive filtering and modification capabilities
- **Offers & Services**: Get available offers and manage services for reservations
- **Booking Integration**: Add reservations to existing bookings or group bookings
- **Unit Management**: Assign, unassign, lock, and unlock unit assignments
- **Guest Journey**: Check-in, check-out, and status management
- **Advanced Actions**: Amend reservations, manage services, and handle city tax
- **Force Operations**: Bypass availability and restriction checks when needed

These endpoints provide comprehensive coverage for all reservation management needs in the Apaleo hospitality platform.

---

*Generated from: `src/main/resources/apaleo/apaleo.booking.api.json`*  
*Date: November 16, 2025*