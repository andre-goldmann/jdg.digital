# Reservations List Component API Documentation

## Overview

The `ReservationsListComponent` is a comprehensive, enterprise-grade Angular component that provides a complete interface for viewing, searching, filtering, and managing hotel reservations. Built with Angular 17+ using standalone components and modern signal-based state management.

## Component API

### Selector
```typescript
<app-reservations-list></app-reservations-list>
```

### Inputs

The component accepts no external inputs as it manages its own state internally through the injected `ReservationsListService`.

### Outputs

The component does not emit events directly. All interactions are handled internally through service methods and internal state management.

## Public Properties

### Data Access Signals (Read-only)

```typescript
// Core data signals
readonly reservations: Signal<ReservationListItem[]>
readonly loading: Signal<boolean>
readonly paginatedReservations: Signal<PaginatedReservations>
readonly totalFilteredCount: Signal<number>
readonly currentPage: Signal<number>
readonly pageSize: Signal<number>
readonly totalPages: Signal<number>
readonly searchTerm: Signal<string>

// Performance optimization signals
readonly paginationLoading: Signal<boolean>
readonly searchPerformance: Signal<SearchPerformanceMetrics>
readonly componentMetrics: Signal<ComponentMetrics>
```

### Configuration Signals

```typescript
// Screen size and responsive behavior
readonly screenWidth: Signal<number>
readonly isMobile: Signal<boolean>
readonly isTablet: Signal<boolean>
readonly displayedColumns: Signal<string[]>

// Feature toggles
readonly enableVirtualScrolling: Signal<boolean>
readonly showFilters: Signal<boolean>
```

### Computed State Signals

```typescript
// Statistics and aggregations
readonly reservationStats: Signal<ReservationStats>
readonly hasActiveFilters: Signal<boolean>

// Selection state
readonly selectedReservations: Signal<Set<string>>
readonly isAllSelected: Signal<boolean>
readonly isIndeterminate: Signal<boolean>
```

## Public Methods

### Data Management

```typescript
/**
 * Refresh reservations data from the service
 */
refreshReservations(): void

/**
 * Search reservations by guest name, reservation ID, or other fields
 * @param searchTerm - The search query
 */
searchReservations(searchTerm: string): void

/**
 * Apply filters to the reservation list
 * @param filters - The filter criteria
 */
applyFilters(): void

/**
 * Clear all active filters and search terms
 */
clearAllFilters(): void
```

### Pagination

```typescript
/**
 * Navigate to a specific page
 * @param page - Page number (1-based)
 */
onPageChange(page: number): void

/**
 * Change the number of items per page
 * @param pageSize - Number of items per page
 */
onPageSizeChange(pageSize: number): void
```

### Selection Management

```typescript
/**
 * Toggle selection of all items on current page
 */
toggleSelectAll(): void

/**
 * Toggle selection of a specific reservation
 * @param reservationId - The reservation ID to toggle
 */
toggleSelectReservation(reservationId: string): void

/**
 * Check if a reservation is selected
 * @param reservationId - The reservation ID to check
 * @returns True if selected
 */
isReservationSelected(reservationId: string): boolean

/**
 * Clear all selections
 */
clearSelection(): void
```

### Filtering and Search

```typescript
/**
 * Clear search input
 */
clearSearch(): void

/**
 * Remove a specific status from filter
 * @param statusToRemove - The status to remove
 */
removeStatusFilter(statusToRemove: ReservationStatus): void

/**
 * Set quick date range filters
 * @param range - Predefined range ('today' | 'thisWeek' | 'thisMonth' | 'nextMonth')
 */
setDateRange(range: 'today' | 'thisWeek' | 'thisMonth' | 'nextMonth'): void

/**
 * Toggle filter panel visibility
 */
toggleFilters(): void
```

### Virtual Scrolling

```typescript
/**
 * Toggle virtual scrolling mode
 */
toggleVirtualScrolling(): void

/**
 * Calculate optimal virtual scroll height
 * @returns CSS height string
 */
getVirtualScrollHeight(): string
```

### URL State Management

```typescript
/**
 * Generate a shareable URL with current state
 * @returns Complete URL with query parameters
 */
getShareableUrl(): string

/**
 * Copy shareable URL to clipboard
 */
copyShareableUrl(): void
```

## Form Controls

The component exposes several Angular reactive form controls for advanced integration:

```typescript
// Search and filtering controls
readonly searchControl: FormControl<string>
readonly statusFilterControl: FormControl<ReservationStatus[]>
readonly checkInStartControl: FormControl<Date | null>
readonly checkInEndControl: FormControl<Date | null>
readonly minGuestsControl: FormControl<number | null>
readonly maxGuestsControl: FormControl<number | null>
readonly minAmountControl: FormControl<number | null>
readonly maxAmountControl: FormControl<number | null>
```

### Apoleo Warning System

The component includes a comprehensive warning detection and display system:

```typescript
/**
 * Check if reservations have warnings
 * @returns True if any warnings exist
 */
hasWarnings(): boolean

/**
 * Get total warning count across all reservations
 * @returns Number of reservations with warnings
 */
getWarningCount(): number

/**
 * Filter to show only reservations with warnings
 */
filterWarningsOnly(): void

/**
 * Toggle warning detail expansion for a reservation
 * @param reservationId - The reservation ID
 */
toggleWarningExpansion(reservationId: string): void

/**
 * Check if warning is expanded for a reservation
 * @param reservationId - The reservation ID
 * @returns True if warning expanded
 */
isWarningExpanded(reservationId: string): boolean

/**
 * Get warning severity level
 * @param reservation - The reservation object
 * @returns 'high' | 'medium' | 'low'
 */
getWarningSeverity(reservation: ReservationListItem): string

/**
 * Dismiss a warning (if applicable)
 * @param reservation - The reservation object
 * @param event - Click event
 */
dismissWarning(reservation: ReservationListItem, event: Event): void
```

#### Warning Data Structure

```typescript
interface ReservationListItem {
  // ... existing fields
  hasWarnings: boolean;           // Warning indicator flag
  warningMessage?: string;        // Descriptive warning text
  warningSeverity?: 'high' | 'medium' | 'low';  // Severity level
}
```

### Apoleo Header Actions

The component provides standard Apoleo PMS action buttons:

```typescript
/**
 * Create a new reservation
 */
createNewReservation(): void

/**
 * Toggle group bookings view
 */
showGroupBookings(): void

/**
 * Export reservations data
 */
exportReservations(): void

/**
 * Print registration forms
 */
printReservations(): void

/**
 * Show occupancy report
 */
showOccupancy(): void

/**
 * Display help documentation
 */
showHelp(): void
```

## Usage Examples

### Basic Usage

```html
<!-- Simple reservation list with Apoleo layout -->
<app-reservations-list></app-reservations-list>
```

### Programmatic Access

```typescript
import { ViewChild } from '@angular/core';
import { ReservationsListComponent } from './reservations-list.component';

@Component({
  template: `<app-reservations-list #reservationsList></app-reservations-list>`
})
export class ParentComponent {
  @ViewChild('reservationsList') reservationsList!: ReservationsListComponent;

  onSearchReservations(term: string) {
    this.reservationsList.searchControl.setValue(term);
  }

  onGetSelectedReservations() {
    const selected = this.reservationsList.selectedReservations();
    console.log('Selected reservations:', Array.from(selected));
  }

  onGetCurrentStats() {
    const stats = this.reservationsList.reservationStats();
    console.log('Reservation statistics:', stats);
  }
}
```

### Custom Integration

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ReservationsListService } from './reservations-list.service';

@Component({
  template: `
    <div class="custom-controls">
      <button (click)="loadTodayReservations()">Today's Reservations</button>
      <button (click)="exportSelected()">Export Selected</button>
    </div>
    <app-reservations-list #reservationsList></app-reservations-list>
  `
})
export class CustomReservationsComponent implements OnInit {
  private reservationsService = inject(ReservationsListService);
  @ViewChild('reservationsList') reservationsList!: ReservationsListComponent;

  loadTodayReservations() {
    this.reservationsList.setDateRange('today');
  }

  exportSelected() {
    const selected = this.reservationsList.selectedReservations();
    // Custom export logic here
  }
}
```

## Responsive Behavior

The component automatically adapts to different screen sizes:

### Desktop (1024px+)
- Full table with all columns
- Advanced filtering sidebar
- Bulk action toolbar
- Complete pagination controls

### Tablet (768px-1023px)
- Condensed table with priority columns
- Simplified filtering
- Touch-optimized controls

### Mobile (320px-767px)
- Card-based layout
- Swipe actions
- Mobile-first navigation
- Compact filtering

## Performance Features

### Optimization Techniques
- **Signal-based reactivity**: Efficient change detection
- **Virtual scrolling**: Handle large datasets (1000+ items)
- **Pagination caching**: Prefetch adjacent pages
- **Search debouncing**: Optimized search performance
- **Memory monitoring**: Automatic cleanup and leak detection

### Performance Metrics
The component provides real-time performance monitoring:

```typescript
// Access performance metrics
const metrics = component.componentMetrics();
console.log('Render time:', metrics.renderTime);
console.log('Memory usage:', metrics.memoryUsage);
console.log('Active subscriptions:', metrics.subscriptionCount);

// Search performance
const searchMetrics = component.searchPerformance();
console.log('Average search time:', searchMetrics.averageSearchTime);
console.log('Cache hit rate:', searchMetrics.cacheHitRate);
```

## Accessibility Features

### WCAG AA Compliance
- **Keyboard Navigation**: Full keyboard support with Tab/Enter/Space/Arrow keys
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: All color combinations meet WCAG AA standards
- **Semantic HTML**: Proper table structure and heading hierarchy

### Accessibility Methods

```typescript
/**
 * Get accessible sort direction description
 * @param column - Column name
 * @returns Accessibility description
 */
getSortDirection(column: string): string

/**
 * Track by function for performance and accessibility
 * @param index - Item index
 * @param reservation - Reservation item
 * @returns Unique identifier
 */
trackByReservationId(index: number, reservation: ReservationListItem): string
```

## Error Handling

The component includes comprehensive error handling:

- **Network errors**: Graceful degradation when API fails
- **Invalid data**: Proper validation and error messages
- **Memory leaks**: Automatic subscription cleanup
- **Performance issues**: Monitoring and warnings

## Integration Requirements

### Service Dependencies

```typescript
// Required service injection
private reservationsService = inject(ReservationsListService);
private router = inject(Router);
private route = inject(ActivatedRoute);
```

### Module Dependencies

```typescript
// Required imports for standalone component
imports: [
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  // ... other Material modules
]
```

## Best Practices

### Do's
✅ Use the component's reactive form controls for external integration  
✅ Leverage the computed signals for reactive UI updates  
✅ Monitor performance metrics in development  
✅ Use virtual scrolling for large datasets (1000+ items)  
✅ Implement proper error handling for service failures  
✅ Follow the responsive design patterns  

### Don'ts
❌ Don't mutate the component's internal signals directly  
❌ Don't bypass the service layer for data operations  
❌ Don't ignore accessibility requirements  
❌ Don't disable virtual scrolling for very large datasets  
❌ Don't forget to handle loading states in custom implementations  

## Advanced Configuration

### Custom Column Configuration

The component uses responsive column display logic with Apoleo PMS-specific columns:

```typescript
// Available columns (Apoleo layout)
readonly allColumns = [
  'statusIcon',      // Status indicator (home/warning icons)
  'reservationId',   // Reservation number
  'guestName',       // Guest name with details (adults/children)
  'arrival',         // Check-in date + time (Apoleo format)
  'departure',       // Check-out date + time (Apoleo format)
  'created',         // Booking creation timestamp
  'channel',         // Booking channel (Direct, OTA, etc.)
  'unit',            // Room/unit designation
  'guarantee',       // Payment guarantee method
  'balance',         // Financial balance with color coding
  'actions'          // Three-dot menu + chevron
];

// Legacy columns (still supported for compatibility)
readonly legacyColumns = [
  'checkInDate', 'checkOutDate', 'nights', 
  'guestCount', 'status', 'totalAmount'
];

// Responsive breakpoints automatically adjust displayed columns
readonly displayedColumns = computed(() => {
  if (this.isMobile()) return this.mobileColumns;
  if (this.isTablet()) return this.tabletColumns;
  return this.allColumns;
});
```

#### Apoleo Column Definitions

**Status Icon Column (`statusIcon`)**
- **Width**: 40px (fixed)
- **Content**: Material icon (home/error)
- **Colors**: Gray for normal, red for warnings
- **Interactive**: Warning icons clickable to expand details

**Created Column (`created`)**
- **Format**: "M/D/YY h:mm A" (e.g., "8/29/22 3:23 PM")
- **Purpose**: Booking creation timestamp
- **Sortable**: Yes
- **Responsive**: Hidden on tablet/mobile

**Channel Column (`channel`)**
- **Values**: "Direct", "Booking.com", "Expedia", "Phone", etc.
- **Purpose**: Booking source identification
- **Sortable**: Yes
- **Responsive**: Hidden on tablet/mobile

**Unit Column (`unit`)**
- **Format**: Room number + type (e.g., "402 - Fam Family Room")
- **Icon**: door_front material icon
- **Purpose**: Room assignment display
- **Sortable**: Yes
- **Responsive**: Visible on tablet, hidden on mobile

**Guarantee Column (`guarantee`)**
- **Values**: "Credit Card", "Prepaid", "Deposit", "Cash", etc.
- **Purpose**: Payment guarantee method
- **Sortable**: Yes
- **Responsive**: Hidden on tablet/mobile

**Balance Column (`balance`)**
- **Format**: Currency with negative indicator (e.g., "$-450.00")
- **Color Coding**:
  - Negative: Red (`#dc3545`, bold)
  - Positive: Green (`#4CAF50`, bold)
  - Zero: Gray
- **Purpose**: Outstanding balance display
- **Sortable**: Yes
- **Responsive**: Visible on all devices

### Virtual Scrolling Configuration

```typescript
// Virtual scrolling settings
readonly virtualScrollItemSize = 72; // Height per row in pixels
readonly virtualScrollMinBufferPx = 200;
readonly virtualScrollMaxBufferPx = 400;

// Auto-enable threshold
shouldUseVirtualScrolling(): boolean {
  return this.enableVirtualScrolling() || this.totalFilteredCount() > 50;
}
```

## Warning System Documentation

### Overview

The Apoleo warning system detects and displays validation issues and alerts for reservations that require attention. This system helps hotel staff identify problems before they impact guest experience.

### Warning Detection

Warnings are detected based on various business rules:

**Rate Plan Restrictions**
- Minimum stay violations
- Maximum stay violations  
- Day-of-week restrictions
- Seasonal availability issues

**Payment Issues**
- Missing guarantee information
- Expired credit cards
- Pending deposits
- Outstanding balances

**Operational Concerns**
- Overbooking conflicts
- Room assignment issues
- Missing guest information
- Special request fulfillment problems

### Warning Display

**Visual Indicators:**
1. **Header Badge**: Shows total warning count (e.g., "4 Warnings")
2. **Row Highlighting**: Red left border (4px) on warning rows
3. **Status Icon**: Red error icon instead of home icon
4. **Background Tint**: Light red (#fff8f8) background

**Severity Levels:**
- **High**: Bright red (#dc3545) with faster pulse animation
- **Medium**: Orange (#ff8c00) with standard pulse
- **Low**: Standard red without animation

### Warning Interaction

**Click to Expand:**
```typescript
// Click warning icon to see details
toggleWarningExpansion(reservationId: string): void

// Warning message appears below the row with:
// - Warning icon
// - Full warning message text
// - Dismiss button (optional)
```

**Filter by Warnings:**
```typescript
// Click warning badge in header to filter
filterWarningsOnly(): void

// Shows only reservations with hasWarnings === true
// Removes all other filters
```

**Tooltips:**
```typescript
// Hover over warning icon for quick info
getWarningTooltip(reservation: ReservationListItem): string

// Returns formatted tooltip with severity and message
```

### Integration Example

```typescript
@Component({
  selector: 'app-custom-reservations',
  template: `
    <app-reservations-list #reservationsList></app-reservations-list>
    
    <div class="warning-summary" *ngIf="hasWarnings()">
      <h3>Attention Required</h3>
      <p>{{ getWarningCount() }} reservations need your attention</p>
      <button (click)="viewWarnings()">Review Warnings</button>
    </div>
  `
})
export class CustomReservationsComponent {
  @ViewChild('reservationsList') list!: ReservationsListComponent;
  
  hasWarnings(): boolean {
    return this.list.hasWarnings();
  }
  
  getWarningCount(): number {
    return this.list.getWarningCount();
  }
  
  viewWarnings(): void {
    this.list.filterWarningsOnly();
  }
}
```

### Accessibility

The warning system is fully accessible:
- **ARIA labels** for warning icons and badges
- **Screen reader announcements** for warning counts
- **Keyboard navigation** to warning details
- **High contrast** mode support
- **Color-blind safe** with icons and text labels

This comprehensive API documentation provides developers with all the information needed to effectively use and integrate the ReservationsListComponent in their applications.