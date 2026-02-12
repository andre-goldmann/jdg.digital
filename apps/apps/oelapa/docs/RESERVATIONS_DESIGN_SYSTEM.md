# OELAPA Design System - Reservations Management Patterns

## Overview

This document extends the OELAPA design system with specific patterns, components, and guidelines developed for the reservations management functionality. These patterns follow the core design principles while addressing the unique needs of hospitality management interfaces.

## Core Design Principles Applied

### Hospitality-Focused Design Philosophy

Building on the S-Tier SaaS Dashboard principles, the reservations management interface incorporates specific hospitality industry standards:

- **Staff Efficiency**: Optimized workflows for hotel staff daily operations
- **Guest Information Clarity**: Clear, scannable presentation of guest details
- **Status-Driven Design**: Visual hierarchy based on reservation states and urgency
- **Multi-Device Support**: Seamless experience from desktop to mobile for staff mobility
- **Professional Aesthetics**: Clean, trustworthy design that reflects hospitality standards

## Apoleo PMS Design Integration

### Apoleo Visual Identity

The reservations list has been aligned with the Apoleo PMS design system, featuring:

- **Compact Density**: Professional hotel management aesthetics with tight spacing
- **Status-Driven Colors**: Clear visual hierarchy for operational states
- **Action-Oriented Layout**: Prominent buttons for common workflows
- **Financial Emphasis**: Clear display of balances and payment status

#### Apoleo Color Palette

```scss
// Primary Apoleo colors
$apoleo-primary: #ff6b35;        // Orange/coral for primary actions
$apoleo-warning: #dc3545;        // Red for warnings and negative balances
$apoleo-success: #4CAF50;        // Green for positive balances
$apoleo-gray-50: #f8f9fa;        // Lightest gray
$apoleo-gray-100: #e9ecef;       // Light gray backgrounds
$apoleo-gray-200: #dee2e6;       // Borders
$apoleo-gray-300: #ced4da;       // Secondary borders
$apoleo-gray-500: #6c757d;       // Secondary text
$apoleo-gray-700: #495057;       // Primary text
$apoleo-gray-900: #212529;       // Darkest text
$apoleo-border: #e0e0e0;         // Standard borders
$apoleo-row-hover: #f5f5f5;      // Row hover background
```

#### Apoleo Typography Scale

```scss
// Compact, professional sizing
$apoleo-table-header: 12px;      // Uppercase headers
$apoleo-table-cell: 13px;        // Data cells
$apoleo-page-title: 24px;        // Page title
$apoleo-button-text: 13px;       // Action buttons

// Font weights
$apoleo-header-weight: 600;      // Bold headers
$apoleo-normal-weight: 400;      // Regular text
$apoleo-emphasis-weight: 500;    // Medium emphasis
$apoleo-strong-weight: 600;      // Strong emphasis (balances)
```

#### Apoleo Spacing System

```scss
// Compact 8px grid system
$apoleo-spacing-xs: 6px;         // Extra small
$apoleo-spacing-sm: 8px;         // Small (standard cell padding)
$apoleo-spacing-md: 12px;        // Medium (cell padding)
$apoleo-spacing-lg: 16px;        // Large (section padding)
$apoleo-spacing-xl: 24px;        // Extra large

// Table-specific spacing
$apoleo-cell-padding: 6px 12px;  // Compact cell padding
$apoleo-header-height: 40px;     // Fixed header height
$apoleo-row-height: 48px;        // Consistent row height
```

### Apoleo Table Structure

#### Column Architecture

The Apoleo layout features 11 specialized columns:

1. **Status Icon** (40px): Home/warning visual indicators
2. **Reservation #** (140px): Booking reference number
3. **Name**: Guest name with adult/children details
4. **Arrival**: Check-in date + time
5. **Departure**: Check-out date + time
6. **Created**: Booking creation timestamp
7. **Channel**: Booking source (Direct, OTA)
8. **Unit**: Room number + type with icon
9. **Guarantee**: Payment guarantee method
10. **Balance**: Financial balance with color coding
11. **Actions** (100px): Three-dot menu + chevron

#### Header Action Bar

```scss
.apoleo-action-bar {
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid $apoleo-border;
  
  .new-booking-btn {
    background-color: $apoleo-primary;
    color: white;
    font-weight: 500;
    height: 36px;
    padding: 0 16px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(255, 107, 53, 0.3);
    
    &:hover {
      background-color: #ff5722;
      transform: translateY(-1px);
    }
  }
  
  .action-btn {
    color: $apoleo-gray-700;
    height: 36px;
    padding: 0 12px;
    border: 1px solid $apoleo-gray-300;
    background: white;
    
    &:hover {
      background-color: $apoleo-gray-50;
    }
  }
}
```

### Apoleo Warning System

#### Warning Visual Treatment

```scss
.warning-row {
  border-left: 4px solid $apoleo-warning;
  background-color: #fff8f8;  // Light red tint
  
  &:hover {
    background-color: #fff5f5;
    box-shadow: 0 1px 3px rgba(220, 53, 69, 0.15);
  }
}

.warning-icon {
  color: $apoleo-warning;
  animation: warningPulse 2s ease-in-out infinite;
  
  &.warning-high {
    animation: pulse-warning 1.5s ease-in-out infinite;
  }
  
  &.warning-medium {
    color: #ff8c00;  // Orange
  }
}

@keyframes warningPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

#### Warning Badge

```scss
.warning-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 2px solid $apoleo-warning;
  border-radius: 4px;
  padding: 6px 12px;
  background: white;
  cursor: pointer;
  
  .validation-label {
    font-size: 11px;
    font-weight: 600;
    color: $apoleo-warning;
    text-transform: uppercase;
  }
  
  .warning-count {
    font-size: 13px;
    font-weight: 500;
    color: $apoleo-warning;
  }
}
```

### Apoleo Balance Display

```scss
// Financial balance styling
.negative-balance {
  color: $apoleo-warning;  // Red
  font-weight: 600;
  font-size: 13px;
}

.positive-balance {
  color: $apoleo-success;  // Green
  font-weight: 600;
  font-size: 13px;
}

.zero-balance {
  color: $apoleo-gray-500;  // Gray
  font-size: 13px;
}
```

## New Design Patterns

### 1. Reservation Status System

#### Status Color Palette

Extended from the core design system for reservation-specific states:

```scss
// Reservation Status Colors
$reservation-confirmed: #4caf50;      // Green - confirmed reservations
$reservation-pending: #ff9800;       // Orange - pending confirmation
$reservation-checked-in: #2196f3;    // Blue - currently checked in
$reservation-checked-out: #757575;   // Gray - completed stays
$reservation-cancelled: #f44336;     // Red - cancelled reservations
$reservation-no-show: #9c27b0;       // Purple - no-show guests

// Status indicators with opacity variants
$status-background-opacity: 0.1;     // Background tint for status areas
$status-border-opacity: 0.3;         // Border tint for status containers
$status-text-opacity: 0.9;           // Text opacity for readability
```

#### Status Badge Component

```html
<!-- Status badge implementation -->
<mat-chip 
  class="reservation-status-badge"
  [class]="'status-' + reservation.status"
  [attr.aria-label]="'Reservation status: ' + reservation.status">
  {{ reservation.status | titlecase }}
</mat-chip>
```

```scss
.reservation-status-badge {
  font-weight: 600;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 16px;
  border: 2px solid transparent;
  
  &.status-confirmed {
    background-color: rgba($reservation-confirmed, $status-background-opacity);
    border-color: rgba($reservation-confirmed, $status-border-opacity);
    color: $reservation-confirmed;
  }
  
  &.status-pending {
    background-color: rgba($reservation-pending, $status-background-opacity);
    border-color: rgba($reservation-pending, $status-border-opacity);
    color: $reservation-pending;
  }
  
  // ... other status styles
}
```

### 2. Data Table Patterns

#### Responsive Table Layout

Following Material Design with hospitality-specific adaptations:

```scss
// Reservation table responsive breakpoints
$table-mobile-breakpoint: 768px;
$table-tablet-breakpoint: 1024px;

.reservations-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .mat-mdc-header-row {
    background-color: #fafafa;
    font-weight: 600;
    color: #424242;
  }
  
  .mat-mdc-row {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(63, 81, 181, 0.04);
    }
    
    &.selected {
      background-color: rgba(63, 81, 181, 0.08);
    }
  }
  
  // Responsive column hiding
  @media (max-width: $table-mobile-breakpoint) {
    .hide-mobile {
      display: none;
    }
  }
  
  @media (max-width: $table-tablet-breakpoint) {
    .hide-tablet {
      display: none;
    }
  }
}
```

#### Column Priority System

Visual hierarchy for table columns based on importance:

1. **Critical**: Guest name, status, check-in date (always visible)
2. **Important**: Reservation ID, guest count, total amount (hidden on mobile)
3. **Contextual**: Check-out date, nights, room type (hidden on tablet and mobile)
4. **Actions**: Edit, delete, view details (simplified on mobile)

### 3. Search and Filter Interface

#### Advanced Filter Panel

```html
<!-- Filter panel with progressive disclosure -->
<mat-expansion-panel class="filter-panel">
  <mat-expansion-panel-header>
    <mat-panel-title>
      <mat-icon>filter_list</mat-icon>
      Filters
      <mat-chip-set *ngIf="hasActiveFilters()" class="active-filters-indicator">
        <mat-chip class="filter-count-chip">{{ getActiveFilterCount() }}</mat-chip>
      </mat-chip-set>
    </mat-panel-title>
  </mat-expansion-panel-header>
  
  <!-- Filter content with grouped sections -->
  <div class="filter-content">
    <div class="filter-group">
      <h4>Status</h4>
      <mat-selection-list multiple [(ngModel)]="selectedStatuses">
        <mat-list-option *ngFor="let status of availableStatuses" [value]="status">
          <mat-chip [class]="'status-' + status">{{ status | titlecase }}</mat-chip>
          <span class="status-count">({{ getStatusCount(status) }})</span>
        </mat-list-option>
      </mat-selection-list>
    </div>
    
    <div class="filter-group">
      <h4>Date Range</h4>
      <mat-form-field>
        <mat-label>Check-in Start</mat-label>
        <input matInput [matDatepicker]="startPicker" [(ngModel)]="checkInStart">
        <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
        <mat-datepicker #startPicker></mat-datepicker>
      </mat-form-field>
    </div>
  </div>
</mat-expansion-panel>
```

```scss
.filter-panel {
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .mat-expansion-panel-header {
    padding: 16px 24px;
    
    .mat-panel-title {
      align-items: center;
      gap: 8px;
    }
  }
  
  .filter-content {
    padding: 0 24px 16px;
    
    .filter-group {
      margin-bottom: 24px;
      
      h4 {
        margin: 0 0 12px 0;
        font-weight: 600;
        color: #424242;
      }
    }
  }
  
  .active-filters-indicator {
    margin-left: auto;
    
    .filter-count-chip {
      background-color: #3f51b5;
      color: white;
      font-size: 0.75rem;
      height: 20px;
      min-height: 20px;
    }
  }
}
```

#### Search Input with Suggestions

```html
<!-- Enhanced search input -->
<mat-form-field class="search-field" appearance="outline">
  <mat-label>Search reservations...</mat-label>
  <input 
    matInput 
    [formControl]="searchControl"
    [matAutocomplete]="searchSuggestions"
    placeholder="Guest name, reservation ID, email..."
    (focus)="onSearchFocus()"
    (blur)="onSearchBlur()">
  <mat-icon matSuffix>search</mat-icon>
  <mat-autocomplete #searchSuggestions="matAutocomplete">
    <mat-option 
      *ngFor="let suggestion of searchSuggestions()" 
      [value]="suggestion"
      (onSelectionChange)="selectSearchSuggestion(suggestion)">
      {{ suggestion }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>
```

```scss
.search-field {
  width: 100%;
  max-width: 400px;
  
  .mat-mdc-form-field {
    .mat-mdc-text-field-wrapper {
      border-radius: 8px;
      transition: box-shadow 0.2s ease;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    .mat-mdc-form-field-focus-overlay {
      background-color: rgba(63, 81, 181, 0.04);
    }
  }
  
  .mat-mdc-input-element {
    font-size: 14px;
    padding: 12px 16px;
  }
}
```

### 4. Mobile-First Responsive Patterns

#### Card-Based Mobile Layout

For screens below 768px, the table transforms into cards:

```html
<!-- Mobile card layout -->
<div class="reservation-cards" *ngIf="isMobile()">
  <mat-card 
    *ngFor="let reservation of paginatedReservations().items" 
    class="reservation-card"
    [class.selected]="isReservationSelected(reservation.id)">
    
    <mat-card-header>
      <mat-card-title>{{ reservation.guestName }}</mat-card-title>
      <mat-card-subtitle>{{ reservation.reservationId }}</mat-card-subtitle>
      <mat-chip class="status-chip" [class]="'status-' + reservation.status">
        {{ reservation.status | titlecase }}
      </mat-chip>
    </mat-card-header>
    
    <mat-card-content>
      <div class="card-info-grid">
        <div class="info-item">
          <mat-icon>event</mat-icon>
          <span>{{ reservation.checkInDate | date:'shortDate' }}</span>
        </div>
        <div class="info-item">
          <mat-icon>group</mat-icon>
          <span>{{ reservation.guestCount }} guests</span>
        </div>
        <div class="info-item">
          <mat-icon>attach_money</mat-icon>
          <span>{{ reservation.totalAmount | currency }}</span>
        </div>
      </div>
    </mat-card-content>
    
    <mat-card-actions>
      <button mat-icon-button><mat-icon>edit</mat-icon></button>
      <button mat-icon-button><mat-icon>more_vert</mat-icon></button>
    </mat-card-actions>
  </mat-card>
</div>
```

```scss
.reservation-cards {
  display: grid;
  gap: 16px;
  padding: 16px;
  
  .reservation-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    &.selected {
      border: 2px solid #3f51b5;
      box-shadow: 0 4px 16px rgba(63, 81, 181, 0.2);
    }
    
    .mat-mdc-card-header {
      padding: 16px 16px 8px;
      
      .mat-mdc-card-title {
        font-size: 18px;
        font-weight: 600;
        color: #212121;
      }
      
      .mat-mdc-card-subtitle {
        font-size: 14px;
        color: #757575;
        margin-top: 4px;
      }
      
      .status-chip {
        margin-left: auto;
      }
    }
    
    .card-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
      
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #616161;
        
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #9e9e9e;
        }
      }
    }
  }
}
```

### 5. Performance Optimization Patterns

#### Virtual Scrolling Implementation

For large datasets (1000+ reservations):

```html
<!-- Virtual scrolling container -->
<cdk-virtual-scroll-viewport 
  itemSize="{{ virtualScrollItemSize }}"
  minBufferPx="{{ virtualScrollMinBufferPx }}"
  maxBufferPx="{{ virtualScrollMaxBufferPx }}"
  class="virtual-scroll-viewport">
  
  <div 
    *cdkVirtualFor="let reservation of virtualScrollData(); trackBy: trackByReservationId"
    class="virtual-scroll-item">
    <!-- Reservation row content -->
  </div>
</cdk-virtual-scroll-viewport>
```

```scss
.virtual-scroll-viewport {
  height: 400px; // Fixed height for virtual scrolling
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  
  .virtual-scroll-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;
    
    &:hover {
      background-color: rgba(63, 81, 181, 0.04);
    }
  }
}
```

#### Loading States and Skeletons

```html
<!-- Skeleton loading state -->
<div class="reservation-skeleton" *ngIf="loading()">
  <div class="skeleton-table">
    <div class="skeleton-row" *ngFor="let item of [1,2,3,4,5]">
      <div class="skeleton-cell skeleton-avatar"></div>
      <div class="skeleton-cell skeleton-text"></div>
      <div class="skeleton-cell skeleton-text skeleton-short"></div>
      <div class="skeleton-cell skeleton-text skeleton-medium"></div>
      <div class="skeleton-cell skeleton-badge"></div>
    </div>
  </div>
</div>
```

```scss
.reservation-skeleton {
  .skeleton-table {
    width: 100%;
    
    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .skeleton-cell {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
      
      &.skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      
      &.skeleton-text {
        height: 16px;
        flex: 1;
        
        &.skeleton-short {
          max-width: 80px;
        }
        
        &.skeleton-medium {
          max-width: 120px;
        }
      }
      
      &.skeleton-badge {
        width: 80px;
        height: 24px;
        border-radius: 12px;
      }
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 6. Accessibility Patterns

#### Screen Reader Support

```html
<!-- Accessible table with proper ARIA labels -->
<table 
  mat-table 
  [dataSource]="paginatedReservations().items"
  role="table"
  aria-label="Reservations list"
  [attr.aria-rowcount]="totalFilteredCount()">
  
  <ng-container matColumnDef="guestName">
    <th 
      mat-header-cell 
      *matHeaderCellDef 
      mat-sort-header
      role="columnheader"
      scope="col"
      [attr.aria-sort]="getSortDirection('guestName')">
      Guest Name
    </th>
    <td 
      mat-cell 
      *matCellDef="let reservation"
      role="gridcell"
      [attr.aria-describedby]="'guest-' + reservation.id">
      <span [id]="'guest-' + reservation.id">{{ reservation.guestName }}</span>
    </td>
  </ng-container>
</table>
```

#### Keyboard Navigation

```typescript
// Keyboard event handling
@HostListener('keydown', ['$event'])
handleKeyDown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      if (event.target && (event.target as HTMLElement).classList.contains('selectable-row')) {
        this.toggleRowSelection((event.target as HTMLElement).dataset['reservationId'] || '');
        event.preventDefault();
      }
      break;
      
    case 'Escape':
      this.clearSelection();
      this.showSearchSuggestions.set(false);
      break;
      
    case 'ArrowUp':
    case 'ArrowDown':
      this.handleArrowNavigation(event);
      break;
  }
}
```

### 7. Animation and Micro-interactions

#### Smooth Transitions

```scss
// Transition definitions
$transition-fast: 150ms ease-out;
$transition-medium: 250ms ease-out;
$transition-slow: 350ms ease-out;

.reservation-row {
  transition: 
    background-color $transition-fast,
    box-shadow $transition-medium,
    transform $transition-fast;
  
  &:hover {
    background-color: rgba(63, 81, 181, 0.04);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
}

.filter-panel {
  .mat-expansion-panel-body {
    transition: padding $transition-medium;
  }
}

.status-badge {
  transition: all $transition-fast;
  
  &:hover {
    transform: scale(1.05);
  }
}
```

#### Loading Animations

```scss
// Spinner animation for buttons
.loading-button {
  position: relative;
  
  &.loading {
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16px;
      height: 16px;
      margin: -8px 0 0 -8px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## Component Library Integration

### Material Design Customization

```scss
// Custom Material theme for reservations
@use '@angular/material' as mat;

$reservations-primary: mat.define-palette(mat.$indigo-palette);
$reservations-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$reservations-warn: mat.define-palette(mat.$red-palette);

$reservations-theme: mat.define-light-theme((
  color: (
    primary: $reservations-primary,
    accent: $reservations-accent,
    warn: $reservations-warn,
  )
));

// Apply theme to specific components
.reservations-container {
  @include mat.all-component-colors($reservations-theme);
}
```

### Custom Component Tokens

```scss
// Design tokens for reservation components
:root {
  // Spacing tokens
  --reservation-card-padding: 16px;
  --reservation-row-height: 64px;
  --reservation-action-spacing: 8px;
  
  // Border radius tokens
  --reservation-card-radius: 12px;
  --reservation-badge-radius: 16px;
  --reservation-button-radius: 6px;
  
  // Shadow tokens
  --reservation-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --reservation-card-shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
  
  // Z-index tokens
  --reservation-dropdown-z: 1000;
  --reservation-modal-z: 1100;
  --reservation-tooltip-z: 1200;
}
```

## Testing Patterns

### Visual Regression Testing

```typescript
// Playwright screenshot tests for design consistency
test('reservation list visual consistency', async ({ page }) => {
  await page.goto('/reservations');
  await page.waitForLoadState('networkidle');
  
  // Test different states
  await expect(page).toHaveScreenshot('reservations-default.png');
  
  // Test responsive breakpoints
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('reservations-tablet.png');
  
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('reservations-mobile.png');
});
```

### Accessibility Testing

```typescript
// Automated accessibility testing
test('reservation list accessibility', async ({ page }) => {
  await page.goto('/reservations');
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  
  // Test screen reader labels
  const table = page.locator('table[role="table"]');
  await expect(table).toHaveAttribute('aria-label', 'Reservations list');
  
  // Test color contrast
  const statusBadges = page.locator('.reservation-status-badge');
  for (const badge of await statusBadges.all()) {
    // Verify sufficient contrast ratio
    const color = await badge.evaluate(el => getComputedStyle(el).color);
    const backgroundColor = await badge.evaluate(el => getComputedStyle(el).backgroundColor);
    // Assert contrast ratio >= 4.5:1
  }
});
```

## Implementation Guidelines

### Do's ✅

- Use consistent spacing based on 8px grid system
- Implement proper loading states for all async operations
- Follow Material Design principles while customizing for hospitality needs
- Ensure all interactive elements have hover and focus states
- Use semantic HTML and proper ARIA labels
- Implement responsive design with mobile-first approach
- Use animation purposefully to enhance user experience
- Maintain consistent color usage across all status indicators

### Don'ts ❌

- Don't use hardcoded colors - always use design tokens
- Don't implement custom animations longer than 350ms
- Don't override Material Design accessibility features
- Don't use more than 7 colors in status system
- Don't implement responsive breakpoints outside standard ranges
- Don't create components without proper keyboard navigation
- Don't use inconsistent border radius values
- Don't ignore loading states and error conditions

This design system extension ensures consistent, accessible, and performant user interfaces across all reservation management functionality while maintaining the high-quality standards expected in hospitality software.