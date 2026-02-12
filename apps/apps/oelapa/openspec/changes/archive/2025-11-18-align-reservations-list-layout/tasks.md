# Tasks: Align Reservations List Layout with Apoleo PMS Design

## Phase 1: Data Model Extension (Priority: High)

### 1. Extend Reservation Interfaces
- [x] 1.1 Add new fields to `ReservationListItem` interface in `reservation.models.ts`
  - `channel`: string for booking channel
  - `unit`: string for room/unit designation
  - `guarantee`: string for payment guarantee type
  - `balance`: number for financial balance
  - `createdDate`: string for booking creation timestamp
  - `hasWarnings`: boolean for warning indicator
  - `warningMessage`: string for warning text
- [x] 1.2 Update mock data in `reservations-list.service.ts` with new fields
- [x] 1.3 Add validation for new required fields

### 2. Warning System Implementation
- [x] 2.1 Create warning detection logic in service
- [x] 2.2 Add method to check rate plan restrictions
- [x] 2.3 Implement warning count aggregation
- [x] 2.4 Add warning severity levels

## Phase 2: Table Structure Refactoring (Priority: High)

### 3. Update Table Columns
- [x] 3.1 Remove current column definitions
- [x] 3.2 Add status icon column with home/warning indicators
- [x] 3.3 Add Reservation # column
- [x] 3.4 Update Name column to include guest details (adults/children count)
- [x] 3.5 Add Arrival column with date + time format
- [x] 3.6 Add Departure column with date + time format
- [x] 3.7 Add Created column for booking creation timestamp
- [x] 3.8 Add Channel column for booking source
- [x] 3.9 Add Unit column for room designation
- [x] 3.10 Add Guarantee column for payment method
- [x] 3.11 Add Balance column with red highlighting for negative values
- [x] 3.12 Update Actions column with three-dot menu + chevron

### 4. Implement Warning Display
- [x] 4.1 Add red border styling for rows with warnings
- [x] 4.2 Create inline warning message display
- [x] 4.3 Add warning icon in status column
- [x] 4.4 Implement expandable warning details
- [x] 4.5 Add validation warning count badge in header

### 5. Header Action Bar
- [x] 5.1 Restructure header section layout
- [x] 5.2 Add "New booking" button with icon
- [x] 5.3 Add "Show group bookings" button
- [x] 5.4 Add "Export" button
- [x] 5.5 Add "Print registration form" button
- [x] 5.6 Add "Occupancy" button
- [x] 5.7 Add "Help" button
- [x] 5.8 Add validation warnings badge (e.g., "4 Warnings")
- [x] 5.9 Style action buttons to match Apoleo design

## Phase 3: Styling and Visual Alignment (Priority: High)

### 6. Apoleo Theme Implementation
- [x] 6.1 Update table density and spacing to match Apoleo
- [x] 6.2 Implement Apoleo color scheme
  - Red (#dc3545 or similar) for warnings and negative balances
  - Orange/coral for primary actions
  - Professional gray tones for borders and backgrounds
- [x] 6.3 Update typography to match Apoleo font sizes
- [x] 6.4 Add row hover effects matching design
- [x] 6.5 Style status indicators (home icon, warning circle)
- [x] 6.6 Update border and shadow styles

### 7. Filter UI Adjustments
- [x] 7.1 Convert active filters to badge display (e.g., "Confirmed, In-house")
- [x] 7.2 Update "Remove all filters" button styling
- [x] 7.3 Adjust filter panel to match Apoleo aesthetics
- [x] 7.4 Update Quick/Advanced filter button styles

### 8. Search Section Updates
- [x] 8.1 Update search bar styling and placeholder text
- [x] 8.2 Add search hint text matching design ("Search by guest, booker, company...")
- [x] 8.3 Adjust search icon and clear button styling

## Phase 4: Responsive Behavior (Priority: Medium)

### 9. Mobile Adaptations
- [x] 9.1 Ensure new columns adapt appropriately on mobile
- [x] 9.2 Update card view layout with new fields
- [x] 9.3 Prioritize critical columns (Name, Arrival, Status, Balance) on small screens
- [x] 9.4 Test touch targets for new action buttons

### 10. Tablet Optimizations
- [x] 10.1 Adjust column visibility for tablet breakpoint
- [x] 10.2 Optimize warning message display on medium screens
- [x] 10.3 Test horizontal scrolling behavior if needed

## Phase 5: Component Logic Updates (Priority: Medium)

### 11. Action Handlers
- [x] 11.1 Implement "New booking" navigation
- [x] 11.2 Add "Show group bookings" filter/view
- [x] 11.3 Implement "Export" functionality with new fields
- [x] 11.4 Add "Print registration form" handler
- [x] 11.5 Implement "Occupancy" view/dialog
- [x] 11.6 Add "Help" dialog or navigation

### 12. Warning Interaction
- [x] 12.1 Add click handler to expand warning details
- [x] 12.2 Implement warning dismissal (if applicable)
- [x] 12.3 Add warning filter to show only reservations with warnings
- [x] 12.4 Create warning severity tooltip

### 13. Balance Display Logic
- [x] 13.1 Implement conditional red styling for negative balances
- [x] 13.2 Add currency formatting for Balance column
- [x] 13.3 Handle zero balance display
- [x] 13.4 Add balance sorting logic

## Phase 6: Testing and Validation (Priority: Medium)

### 14. Unit Tests
- [x] 14.1 Update component tests for new columns
- [x] 14.2 Test warning detection logic
- [x] 14.3 Test balance calculation and formatting
- [x] 14.4 Test new action handlers
- [x] 14.5 Test column sorting with new fields

### 15. E2E Tests
- [x] 15.1 Update selectors for new table structure
- [x] 15.2 Test warning display and interaction
- [x] 15.3 Test new header actions
- [x] 15.4 Take visual regression screenshots
- [x] 15.5 Test responsive behavior with new layout

### 16. Visual Validation
- [x] 16.1 Side-by-side comparison with target design
- [x] 16.2 Verify column alignment and spacing
- [x] 16.3 Check color accuracy for warnings and balances
- [x] 16.4 Validate icon usage and sizing
- [x] 16.5 Confirm typography matches Apoleo style

## Phase 7: Documentation (Priority: Low)

### 17. Update Documentation
- [x] 17.1 Update component API documentation with new columns
- [x] 17.2 Document warning system behavior
- [x] 17.3 Update design system docs with Apoleo-specific patterns
- [x] 17.4 Add screenshots of new layout to user guide

### 18. Final Polish
- [x] 18.1 Review accessibility for new elements
- [x] 18.2 Optimize performance with additional columns
- [x] 18.3 Clean up unused Material Design styles
- [x] 18.4 Prepare for production deployment

## Validation Criteria

### Visual Design
- [x] Table layout matches Apoleo design screenshot
- [x] Column structure and order correct
- [x] Warning indicators display properly
- [x] Color scheme matches Apoleo branding
- [x] Typography and spacing aligned

### Functionality
- [x] All new action buttons work correctly
- [x] Warning system detects and displays issues
- [x] Balance displays with correct formatting
- [x] Sorting works for all columns
- [x] Filters work with new data structure

### Performance
- [x] No performance degradation with additional columns
- [x] Virtual scrolling works with new layout
- [x] Mobile responsiveness maintained

### Accessibility
- [x] All new elements have proper ARIA labels
- [x] Keyboard navigation works correctly
- [x] Screen readers announce new content properly
- [x] Color contrast meets WCAG standards
