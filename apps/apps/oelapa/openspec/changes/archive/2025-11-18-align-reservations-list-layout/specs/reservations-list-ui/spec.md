# reservations-list-ui Specification Deltas

## MODIFIED Requirements

### Requirement: Comprehensive Reservations Table Display
The reservations list component SHALL provide a professional table interface matching the Apoleo PMS design for viewing and managing hotel reservations.

#### Scenario: Staff views reservations list with Apoleo layout
- **Given** a hotel staff member with appropriate permissions
- **When** they navigate to the reservations list page
- **Then** they see a table displaying all reservations with columns in order: Status Icon, Reservation #, Name (with guest details), Arrival, Departure, Created, Channel, Unit, Guarantee, Balance, Actions
- **And** the table supports sorting by Reservation #, Name, Arrival, Departure, and Balance
- **And** reservations display with Apoleo color scheme and density
- **And** the Name column shows guest count in format "2 adults, 2 children"
- **And** date columns show both date and time
- **And** negative balances are highlighted in red

#### Scenario: Warning indicators display
- **Given** reservations with validation issues or warnings
- **When** staff views the reservations list
- **Then** affected reservation rows display with red left border
- **And** a red warning circle icon appears in the status column
- **And** the warning message is displayed inline below the reservation data
- **And** the header shows a validation warnings badge (e.g., "4 Warnings" in red)

#### Scenario: Empty state handling
- **Given** no reservations exist in the system
- **When** staff views the reservations list
- **Then** they see a professional empty state message indicating no reservations found
- **And** they see a call-to-action button to create a new reservation

### Requirement: Apoleo Action Bar Integration
The system SHALL provide an action bar with Apoleo-specific booking management actions.

#### Scenario: Header actions available
- **Given** staff is viewing the reservations list
- **When** they look at the header action bar
- **Then** they see the following buttons in order:
  - "New booking" (primary action with orange/coral color)
  - "Show group bookings"
  - "Export"
  - "Print registration form"
  - "Occupancy"
  - "Help"
- **And** a validation warnings badge is displayed if any warnings exist
- **And** all buttons have appropriate icons

#### Scenario: New booking action
- **Given** staff clicks "New booking" button
- **When** the action completes
- **Then** they are navigated to the new reservation creation form

#### Scenario: Export with new fields
- **Given** staff clicks "Export" button
- **When** the export is generated
- **Then** the export includes all Apoleo fields: Reservation #, Name, Arrival, Departure, Created, Channel, Unit, Guarantee, Balance
- **And** warning information is included for reservations with issues

### Requirement: Enhanced Filter Display with Status Badges
The system SHALL display active filters as status badges in Apoleo style.

#### Scenario: Filter badge display
- **Given** staff has applied status filters for "Confirmed" and "In-house"
- **When** they view the filter area
- **Then** a badge displays "Confirmed, In-house" with appropriate styling
- **And** a "Remove all filters" button with icon is available
- **And** individual filter chips can be removed

#### Scenario: Search with Apoleo hints
- **Given** staff is using the search functionality
- **When** they focus on the search input
- **Then** they see the hint "Search by guest, booker, company, booking nr, externe code of unit name"
- **And** the search box follows Apoleo styling guidelines

## ADDED Requirements

### Requirement: Booking Channel Display
The system SHALL display the booking channel (source) for each reservation.

#### Scenario: Channel display in table
- **Given** reservations come from various booking channels
- **When** staff views the reservations list
- **Then** each reservation shows its channel in the Channel column
- **And** channel options include: Direct, Booking.com, Expedia, Airbnb, Phone, Walk-in, Corporate, and Other
- **And** channel information is sortable

#### Scenario: Channel filtering
- **Given** staff wants to filter by booking channel
- **When** they open the advanced filters
- **Then** a channel filter dropdown is available
- **And** they can select multiple channels
- **And** active channel filters appear as chips

### Requirement: Unit (Room) Assignment Display
The system SHALL display the assigned unit or room for each reservation.

#### Scenario: Unit display in table
- **Given** reservations have assigned rooms or units
- **When** staff views the reservations list
- **Then** each reservation shows its unit in the Unit column
- **And** unit information includes room number and type (e.g., "402 - Fam Family Room", "202 - Fam Family Room", "303 - Doune", "405 - Excute")
- **And** unassigned reservations show placeholder text
- **And** unit information is clickable for quick room details

### Requirement: Payment Guarantee Display
The system SHALL display the payment guarantee method for each reservation.

#### Scenario: Guarantee display in table
- **Given** reservations have payment guarantee information
- **When** staff views the reservations list
- **Then** each reservation shows its guarantee method in the Guarantee column
- **And** guarantee methods include: Credit Card, Prepaid, Bank Transfer, Cash, Invoice, and None
- **And** credit card guarantees show masked card information on hover/click

### Requirement: Financial Balance Display
The system SHALL display the current financial balance for each reservation with clear visual indicators.

#### Scenario: Balance display with color coding
- **Given** reservations have various balance states
- **When** staff views the reservations list
- **Then** each reservation shows its balance in the Balance column
- **And** negative balances are displayed in red color (e.g., "-360.00 EUR", "-300.00 EUR", "-540.00 EUR", "-1,400.00 EUR")
- **And** positive balances are displayed in green color
- **And** zero balances are displayed in standard text color
- **And** currency symbol is included (EUR, USD, etc.)

#### Scenario: Balance sorting
- **Given** staff wants to sort by balance
- **When** they click the Balance column header
- **Then** reservations are sorted numerically by balance amount
- **And** negative balances appear first in descending sort
- **And** positive balances appear first in ascending sort

### Requirement: Booking Creation Timestamp
The system SHALL display when each reservation was created.

#### Scenario: Created date display
- **Given** reservations were created at different times
- **When** staff views the reservations list
- **Then** each reservation shows its creation date and time in the Created column
- **And** format follows Apoleo standard: "M/D/YY h:mm A" (e.g., "8/29/22 9:53 PM")
- **And** created timestamp is sortable

### Requirement: Warning System with Inline Messages
The system SHALL detect and display validation warnings with clear visual indicators and inline messages.

#### Scenario: Rate plan restriction warning
- **Given** a reservation violates rate plan restrictions
- **When** staff views the reservations list
- **Then** the reservation row has a red left border
- **And** a red warning circle icon appears in the status column
- **And** an inline warning message displays: "The restrictions of the rate plan are not considered"
- **And** the warning is expandable for more details

#### Scenario: Warning count badge
- **Given** multiple reservations have warnings
- **When** staff views the reservations list header
- **Then** a red "VALIDATION" badge displays with count (e.g., "4 Warnings")
- **And** clicking the badge filters to show only reservations with warnings
- **And** the badge updates dynamically as warnings are resolved

#### Scenario: Warning filtering
- **Given** staff wants to view only reservations with warnings
- **When** they apply the warnings filter
- **Then** only reservations with validation issues are displayed
- **And** the filter is indicated in the active filters area

### Requirement: Status Icon Indicators
The system SHALL display visual status icons for quick identification of reservation states.

#### Scenario: Normal reservation icon
- **Given** a reservation has no warnings or issues
- **When** staff views the reservations list
- **Then** the status icon column shows a home icon (house symbol) in black
- **And** the icon indicates the reservation is confirmed or in-house

#### Scenario: Warning reservation icon
- **Given** a reservation has validation warnings
- **When** staff views the reservations list
- **Then** the status icon column shows a red filled circle icon
- **And** the icon is accompanied by the warning message
- **And** hovering shows tooltip with warning details

### Requirement: Enhanced Row Actions
The system SHALL provide comprehensive row-level actions matching Apoleo patterns.

#### Scenario: Action menu and navigation
- **Given** staff is viewing a reservation in the list
- **When** they look at the Actions column
- **Then** they see a three-dot menu icon button
- **And** they see a right-facing chevron icon button
- **And** clicking the menu shows contextual actions
- **And** clicking the chevron navigates to reservation details

#### Scenario: Contextual action menu
- **Given** staff clicks the three-dot menu for a reservation
- **When** the menu opens
- **Then** they see actions appropriate to the reservation status:
  - View details
  - Edit reservation
  - Check-in (if arrival date)
  - Check-out (if in-house)
  - Cancel reservation
  - Print confirmation
  - Send email
- **And** unavailable actions are disabled with tooltip explanation
