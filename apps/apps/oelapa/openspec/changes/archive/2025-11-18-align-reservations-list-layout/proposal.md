# Proposal: Align Reservations List Layout with Apoleo PMS Design

## Why

The current reservations list implementation uses a modern Material Design approach but doesn't match the specific Apoleo PMS design shown in `reservations.png`. The target design features:

1. **Denser, more compact layout** with professional hotel management system aesthetics
2. **Specific column structure** including columns like Reservation #, Name (with guest details), Arrival, Departure, Created, Channel, Unit, Guarantee, Balance
3. **Integrated warning/error indicators** with inline red-bordered rows for issues
4. **Status icons** (home icon for normal reservations, red circle for warnings)
5. **Action buttons in header** including: New booking, Show group bookings, Export, Print registration form, Occupancy, Help
6. **Status badges** (e.g., "Confirmed, In-house") as filter indicators
7. **Validation warnings** displayed prominently (e.g., "4 Warnings" badge)
8. **Row-level action menus** with three-dot menu and chevron for details

The current implementation is fully functional with good UX but needs visual and structural alignment with the Apoleo design system to maintain consistency with the target PMS interface.

## What Changes

### UI/Layout Changes
- Restructure table columns to match Apoleo schema:
  - Reservation # (booking reference)
  - Name (with guest count details: "2 adults, 2 children")
  - Arrival (date + time)
  - Departure (date + time)
  - Created (booking creation date + time)
  - Channel (booking source: Direct, OTA, etc.)
  - Unit (room number + type)
  - Guarantee (payment method)
  - Balance (financial amount with red highlight for negative)
  - Actions (menu + chevron)

- Add header action bar with Apoleo-specific buttons
- Implement warning/validation system with red-bordered rows
- Add status icon column (home/warning indicators)
- Update color scheme and spacing to match Apoleo density
- Modify filter UI to show active filters as badges
- Add validation warning badge in header

### Component Changes
- Update `reservations-list.component.html` column definitions
- Add new columns for Channel, Unit, Guarantee, Balance, Created
- Implement warning indicator system
- Add inline warning messages for reservations
- Update styling in `reservations-list.component.scss` for Apoleo theme
- Modify data model to include new fields

### Data Model Updates
- Extend `ReservationListItem` interface with:
  - `channel`: string (booking channel)
  - `unit`: string (room unit)
  - `guarantee`: string (payment guarantee type)
  - `balance`: number (financial balance)
  - `createdDate`: string (booking creation timestamp)
  - `hasWarnings`: boolean (warning indicator)
  - `warningMessage`: string (warning text)

## Impact

### Affected specs
- `reservations-list-ui`: MODIFIED - table structure, columns, styling, warning system

### Affected code
- `src/app/reservations/reservations-list.component.html` - table structure and columns
- `src/app/reservations/reservations-list.component.scss` - Apoleo-specific styling
- `src/app/reservations/reservations-list.component.ts` - new properties and methods
- `src/app/reservations/reservation.models.ts` - extended interfaces
- `src/app/reservations/reservations-list.service.ts` - mock data with new fields

### Non-Breaking Changes
- Existing functionality (search, filter, pagination) remains intact
- All current E2E tests should continue to pass with selector updates
- Component API remains stable
- Service interfaces unchanged (data model extended)

### Testing Impact
- E2E tests may need selector updates for new column structure
- Visual regression tests should capture new layout
- Existing unit tests remain valid with mock data updates
