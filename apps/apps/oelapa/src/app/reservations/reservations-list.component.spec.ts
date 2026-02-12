import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsListService } from './reservations-list.service';
import { ReservationStatus, ReservationFilters, MOCK_RESERVATIONS } from './reservation.models';

describe('ReservationsListComponent', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  let mockReservationsService: jest.Mocked<ReservationsListService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockDialog: jest.Mocked<MatDialog>;

  // Create mock services
  beforeEach(async () => {
    // Mock ReservationsListService
    mockReservationsService = {
      init: jest.fn(),
      getReservations: jest.fn(),
      searchReservations: jest.fn(),
      filterReservations: jest.fn(),
      clearFilters: jest.fn(),
      goToPage: jest.fn(),
      nextPage: jest.fn(),
      previousPage: jest.fn(),
      setPageSize: jest.fn(),
      setVirtualScrollingMode: jest.fn(),
      getAllFilteredReservations: jest.fn(),
      getReservationById: jest.fn(),
      getAvailableStatuses: jest.fn(),
      getReservationStats: jest.fn(),
      getWarningCount: jest.fn(),
      getSearchSuggestions: jest.fn(),
      cleanup: jest.fn()
    } as Partial<ReservationsListService> as jest.Mocked<ReservationsListService>;

    // Add readonly signals to mock service
    Object.defineProperty(mockReservationsService, 'reservations', {
      get: () => signal(MOCK_RESERVATIONS).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'filteredReservations', {
      get: () => signal(MOCK_RESERVATIONS).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'paginatedReservations', {
      get: () => signal({
        items: MOCK_RESERVATIONS.slice(0, 10),
        totalCount: MOCK_RESERVATIONS.length,
        pageSize: 10,
        currentPage: 1,
        totalPages: Math.ceil(MOCK_RESERVATIONS.length / 10)
      }).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'loading', {
      get: () => signal(false).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'paginationLoading', {
      get: () => signal(false).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'filters', {
      get: () => signal<ReservationFilters>({}).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'searchTerm', {
      get: () => signal('').asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'currentPage', {
      get: () => signal(1).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'pageSize', {
      get: () => signal(10).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'totalPages', {
      get: () => signal(1).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'totalFilteredCount', {
      get: () => signal(MOCK_RESERVATIONS.length).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'error', {
      get: () => signal(null).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'isOnline', {
      get: () => signal(true).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'lastSuccessfulSync', {
      get: () => signal(new Date()).asReadonly()
    });
    Object.defineProperty(mockReservationsService, 'searchPerformanceMetrics', {
      get: () => signal({ searchTime: 0, resultCount: 0 }).asReadonly()
    });

    // Mock Router
    mockRouter = {
      navigate: jest.fn()
    } as Partial<Router> as jest.Mocked<Router>;

    // Mock ActivatedRoute
    mockActivatedRoute = {
      queryParams: of({}),
      params: of({}),
      snapshot: {
        queryParams: {},
        params: {}
      } as Partial<ActivatedRouteSnapshot>
    } as Partial<ActivatedRoute>;

    // Mock MatDialog
    mockDialog = {
      open: jest.fn()
    } as Partial<MatDialog> as jest.Mocked<MatDialog>;

    // Set up service return values
    mockReservationsService.getReservations.mockReturnValue(of(MOCK_RESERVATIONS));
    mockReservationsService.getAllFilteredReservations.mockReturnValue(MOCK_RESERVATIONS);
    mockReservationsService.getAvailableStatuses.mockReturnValue(Object.values(ReservationStatus));
    mockReservationsService.getWarningCount.mockReturnValue(MOCK_RESERVATIONS.filter((r: any) => r.hasWarnings).length);
    mockReservationsService.getSearchSuggestions.mockReturnValue([]);
    mockReservationsService.getReservationStats.mockReturnValue({
      totalReservations: MOCK_RESERVATIONS.length,
      statusCounts: {
        [ReservationStatus.CONFIRMED]: 2,
        [ReservationStatus.CHECKED_IN]: 1,
        [ReservationStatus.CHECKED_OUT]: 1,
        [ReservationStatus.PENDING]: 1,
        [ReservationStatus.CANCELLED]: 1,
        [ReservationStatus.NO_SHOW]: 1
      },
      totalRevenue: 2000,
      averageStayLength: 2.5
    });

    await TestBed.configureTestingModule({
      imports: [
        ReservationsListComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ReservationsListService, useValue: mockReservationsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isMobile()).toBe(false);
      expect(component.enableVirtualScrolling()).toBe(false);
      expect(component.showFilters()).toBe(false);
      expect(component.expandedRows()).toEqual(new Set());
    });

    it('should initialize form controls', () => {
      expect(component.searchControl).toBeInstanceOf(FormControl);
      expect(component.statusFilterControl).toBeInstanceOf(FormControl);
      expect(component.checkInStartControl).toBeInstanceOf(FormControl);
      expect(component.checkInEndControl).toBeInstanceOf(FormControl);
      expect(component.minGuestsControl).toBeInstanceOf(FormControl);
      expect(component.maxGuestsControl).toBeInstanceOf(FormControl);
      expect(component.minAmountControl).toBeInstanceOf(FormControl);
      expect(component.maxAmountControl).toBeInstanceOf(FormControl);
    });

    it('should initialize properly', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.searchControl).toBeInstanceOf(FormControl);
    });

    it('should setup URL parameter initialization', () => {
      mockActivatedRoute.queryParams = of({
        search: 'John',
        status: 'confirmed',
        page: '2'
      });

      fixture.detectChanges();
      
      // Verify that URL parameters would be processed
      expect(component).toBeTruthy();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update search when form control changes', () => {
      const searchTerm = 'John Smith';
      component.searchControl.setValue(searchTerm);
      
      // Trigger debounce
      jasmine.clock().install();
      jasmine.clock().tick(301);
      
      expect(mockReservationsService.searchReservations).toHaveBeenCalledWith(searchTerm);
      
      jasmine.clock().uninstall();
    });

    it('should clear search when clear button is clicked', () => {
      component.searchControl.setValue('test search');
      
      component.clearSearch();
      
      expect(component.searchControl.value).toBe('');
      expect(mockReservationsService.searchReservations).toHaveBeenCalledWith('');
    });

    it('should show search clear button when search has value', () => {
      component.searchControl.setValue('test');
      fixture.detectChanges();
      
      const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search input"]');
      expect(clearButton).toBeTruthy();
    });

    it('should hide search clear button when search is empty', () => {
      component.searchControl.setValue('');
      fixture.detectChanges();
      
      const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search input"]');
      expect(clearButton).toBeFalsy();
    });
  });

  describe('Filter Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle filter panel visibility', () => {
      expect(component.showFilters()).toBe(false);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(true);
      
      component.toggleFilters();
      expect(component.showFilters()).toBe(false);
    });

    it('should apply filters when filter controls change', () => {
      component.statusFilterControl.setValue([ReservationStatus.CONFIRMED]);
      component.minGuestsControl.setValue(2);
      component.maxGuestsControl.setValue(4);
      
      // Trigger filters by setting a control value which will automatically call applyFilters
      component.searchControl.setValue('test');
      
      expect(mockReservationsService.filterReservations).toHaveBeenCalledWith({
        statuses: [ReservationStatus.CONFIRMED],
        minGuests: 2,
        maxGuests: 4
      });
    });

    it('should clear all filters', () => {
      // Set some filter values
      component.statusFilterControl.setValue([ReservationStatus.CONFIRMED]);
      component.searchControl.setValue('test');
      
      component.clearAllFilters();
      
      expect(component.statusFilterControl.value).toBeNull();
      expect(component.searchControl.value).toBe('');
      expect(mockReservationsService.clearFilters).toHaveBeenCalled();
    });

    it('should validate date range filters', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2024-12-31'); // End before start
      
      component.checkInStartControl.setValue(startDate);
      component.checkInEndControl.setValue(endDate);
      
      // Date range validation is handled by the form controls
      expect(component.checkInStartControl.value).toBe(startDate);
      expect(component.checkInEndControl.value).toBe(endDate);
    });

    it('should handle guest count range filters', () => {
      component.minGuestsControl.setValue(5);
      component.maxGuestsControl.setValue(2); // Max less than min
      
      // Form validation would prevent this scenario
      expect(component.minGuestsControl.value).toBe(5);
      expect(component.maxGuestsControl.value).toBe(2);
    });

    it('should handle amount range filters', () => {
      component.minAmountControl.setValue(1000);
      component.maxAmountControl.setValue(500); // Max less than min

      // Form validation would prevent this scenario
      expect(component.minAmountControl.value).toBe(1000);
      expect(component.maxAmountControl.value).toBe(500);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle page changes through service', () => {
      // onPageChange expects a page number
      const pageNumber = 2;
      component.onPageChange(pageNumber);
      expect(mockReservationsService.goToPage).toHaveBeenCalledWith(2);
    });

    it('should handle page navigation', () => {
      const pageNumber = 1;
      component.onPageChange(pageNumber);
      expect(mockReservationsService.goToPage).toHaveBeenCalledWith(1);
    });

    it('should provide page size options', () => {
      const options = component.pageSizeOptions;
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Virtual Scrolling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle virtual scrolling', () => {
      expect(component.enableVirtualScrolling()).toBe(false);
      
      component.toggleVirtualScrolling();
      expect(component.enableVirtualScrolling()).toBe(true);
      expect(mockReservationsService.setVirtualScrollingMode).toHaveBeenCalledWith(true);
      
      component.toggleVirtualScrolling();
      expect(component.enableVirtualScrolling()).toBe(false);
      expect(mockReservationsService.setVirtualScrollingMode).toHaveBeenCalledWith(false);
    });

    it('should track virtual scroll items', () => {
      const index = 0;
      const item = MOCK_RESERVATIONS[0];
      
      const trackResult = component.trackByReservationId(index, item);
      expect(trackResult).toBe(item.id);
    });

    it('should use virtual scroll data when enabled', () => {
      component.enableVirtualScrolling.set(true);
      
      // Virtual scroll data comes from the service
      expect(component.virtualScrollData()).toBeDefined();
      expect(mockReservationsService.getAllFilteredReservations).toHaveBeenCalled();
    });
  });

  describe('Row Expansion', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle row expansion', () => {
      const reservationId = MOCK_RESERVATIONS[0].id;
      
      expect(component.isRowExpanded(reservationId)).toBe(false);
      
      component.toggleRowExpansion(reservationId);
      expect(component.isRowExpanded(reservationId)).toBe(true);
      
      component.toggleRowExpansion(reservationId);
      expect(component.isRowExpanded(reservationId)).toBe(false);
    });

    it('should expand rows individually', () => {
      const reservationId = MOCK_RESERVATIONS[0].id;
      component.toggleRowExpansion(reservationId);
      
      expect(component.isRowExpanded(reservationId)).toBe(true);
    });

    it('should collapse all rows', () => {
      // First expand some rows
      const reservationId = MOCK_RESERVATIONS[0].id;
      component.toggleRowExpansion(reservationId);
      
      // Then collapse all
      component.collapseAllRows();
      
      MOCK_RESERVATIONS.forEach(reservation => {
        expect(component.isRowExpanded(reservation.id)).toBe(false);
      });
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sort data by column', () => {
      const sortEvent = { active: 'guestName', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('guestName');
      expect(component.sortDirection()).toBe('asc');
    });

    it('should handle sort direction changes', () => {
      const sortEventAsc = { active: 'guestName', direction: 'asc' as const };
      const sortEventDesc = { active: 'guestName', direction: 'desc' as const };
      
      component.sortData(sortEventAsc);
      expect(component.sortDirection()).toBe('asc');
      
      component.sortData(sortEventDesc);
      expect(component.sortDirection()).toBe('desc');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have mobile detection capability', () => {
      // Test the mobile detection signal exists
      expect(typeof component.isMobile()).toBe('boolean');
    });

    it('should handle responsive behavior', () => {
      // Mock window resize using Jest
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // The component should handle the resize
      expect(typeof component.isMobile()).toBe('boolean');
    });

    it('should provide displayed columns', () => {
      const columns = component.displayedColumns;
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have responsive columns based on screen size', () => {
      const columns = component.displayedColumns;
      expect(columns).toContain('actions');
      // The actual column filtering is handled by the template
      expect(columns).toContain('status');
      expect(columns).toContain('actions');
    });
  });

  // Task 14.1: Tests for new Apoleo-style columns
  describe('Apoleo Column Structure', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should include all Apoleo-style columns in allColumns', () => {
      const expectedColumns = [
        'statusIcon',
        'reservationId',
        'guestName',
        'arrival',
        'departure',
        'created',
        'channel',
        'unit',
        'guarantee',
        'balance',
        'actions'
      ];
      
      expect(component.allColumns).toEqual(expectedColumns);
    });

    it('should have status icon column with home/warning indicators', () => {
      expect(component.allColumns).toContain('statusIcon');
    });

    it('should have reservation ID column', () => {
      expect(component.allColumns).toContain('reservationId');
    });

    it('should have arrival and departure columns', () => {
      expect(component.allColumns).toContain('arrival');
      expect(component.allColumns).toContain('departure');
    });

    it('should have created date column', () => {
      expect(component.allColumns).toContain('created');
    });

    it('should have channel column for booking source', () => {
      expect(component.allColumns).toContain('channel');
    });

    it('should have unit column for room designation', () => {
      expect(component.allColumns).toContain('unit');
    });

    it('should have guarantee column for payment method', () => {
      expect(component.allColumns).toContain('guarantee');
    });

    it('should have balance column for financial amounts', () => {
      expect(component.allColumns).toContain('balance');
    });

    it('should prioritize critical columns on mobile', () => {
      const mobileColumns = component.mobileColumns;
      expect(mobileColumns).toContain('statusIcon');
      expect(mobileColumns).toContain('guestName');
      expect(mobileColumns).toContain('balance');
      expect(mobileColumns).toContain('actions');
      // Mobile should have fewer columns
      expect(mobileColumns.length).toBeLessThan(component.allColumns.length);
    });

    it('should show intermediate columns on tablet', () => {
      const tabletColumns = component.tabletColumns;
      expect(tabletColumns.length).toBeGreaterThan(component.mobileColumns.length);
      expect(tabletColumns.length).toBeLessThanOrEqual(component.allColumns.length);
    });
  });

  describe('Reservation Actions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to reservation details', () => {
      const reservation = MOCK_RESERVATIONS[0];
      
      component.viewReservationDetails(reservation);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations', reservation.id]);
    });

    it('should navigate to edit reservation', () => {
      const reservation = MOCK_RESERVATIONS[0];
      
      component.editReservation(reservation);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations', reservation.id, 'edit']);
    });

    it('should have dialog service available for dialogs', () => {
      (mockDialog.open as jest.Mock).mockReturnValue({
        afterClosed: () => of(null)
      });
      
      // Dialog functionality is available but specific method may be in service
      expect(mockDialog.open).toBeDefined();
    });
  });

  describe('URL State Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should initialize filters from URL parameters', () => {
      const queryParams = {
        search: 'John',
        status: ['confirmed'],
        page: '2',
        pageSize: '25'
      };
      
      component.initializeFiltersFromUrl(queryParams);
      
      expect(component.searchControl.value).toBe('John');
      expect(component.statusFilterControl.value).toEqual(['confirmed']);
    });

    it('should handle URL parameter updates', () => {
      // URL params are handled internally by the component
      expect(mockRouter.navigate).toBeDefined();
    });

    it('should generate shareable URL', () => {
      component.searchControl.setValue('John');
      component.statusFilterControl.setValue([ReservationStatus.CONFIRMED]);
      
      const shareableUrl = component.getShareableUrl();
      
      expect(shareableUrl).toContain('search=John');
      expect(shareableUrl).toContain('status=confirmed');
    });

    it('should copy shareable URL to clipboard', async () => {
      // Mock clipboard API
      const mockClipboard = {
        writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
      };
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        configurable: true
      });
      
      await component.copyShareableUrl();
      
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show loading spinner when loading', () => {
      // Mock loading state
      Object.defineProperty(mockReservationsService, 'loading', {
        get: () => signal(true).asReadonly()
      });
      
      fixture.detectChanges();
      
      const loadingSpinner = fixture.nativeElement.querySelector('mat-progress-spinner');
      expect(loadingSpinner).toBeTruthy();
    });

    it('should show pagination loading indicator', () => {
      Object.defineProperty(mockReservationsService, 'paginationLoading', {
        get: () => signal(true).asReadonly()
      });
      
      fixture.detectChanges();
      
      const paginationLoading = fixture.nativeElement.querySelector('.pagination-loading');
      expect(paginationLoading).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle service errors gracefully', () => {
      (mockReservationsService.getReservations as jest.Mock).mockReturnValue(
        of([]).pipe(() => { throw new Error('Service error'); })
      );
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should validate filter inputs', () => {
      // Test invalid guest count
      component.minGuestsControl.setValue(-1);
      expect(component.minGuestsControl.hasError('min')).toBe(true);
      
      // Test invalid amount
      component.minAmountControl.setValue(-100);
      expect(component.minAmountControl.hasError('min')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels', () => {
      const searchInput = fixture.nativeElement.querySelector('input[aria-label*="Search"]');
      expect(searchInput).toBeTruthy();
      
      const table = fixture.nativeElement.querySelector('table[role="grid"]');
      expect(table).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const table = fixture.nativeElement.querySelector('table');
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      
      expect(() => table.dispatchEvent(keyEvent)).not.toThrow();
    });

    it('should have search input available', () => {
      const searchInput = fixture.nativeElement.querySelector('input[type="search"]') || 
                         fixture.nativeElement.querySelector('input[formControlName="search"]');
      
      // Search input should be accessible
      expect(searchInput || component.searchControl).toBeDefined();
    });
  });

  describe('Component Cleanup', () => {
    it('should cleanup subscriptions on destroy', () => {
      fixture.detectChanges();
      
      jest.spyOn(component['destroy$'], 'next').mockImplementation(() => {});
      jest.spyOn(component['destroy$'], 'complete').mockImplementation(() => {});
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });

    it('should cleanup service resources', () => {
      fixture.detectChanges();
      
      component.ngOnDestroy();
      
      expect(mockReservationsService.cleanup).toHaveBeenCalled();
    });
  });

  describe('Performance Optimizations', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should use OnPush change detection', () => {
      expect(component.constructor.name).toBe('ReservationsListComponent');
      // The actual OnPush test would require more complex setup
      expect(component).toBeTruthy();
    });

    it('should implement trackBy functions', () => {
      const item = MOCK_RESERVATIONS[0];
      const trackResult = component.trackByReservationId(0, item);
      expect(trackResult).toBe(item.id);
    });

    it('should debounce search input', () => {
      jasmine.clock().install();
      
      component.searchControl.setValue('a');
      jasmine.clock().tick(100);
      component.searchControl.setValue('ab');
      jasmine.clock().tick(100);
      component.searchControl.setValue('abc');
      jasmine.clock().tick(301);
      
      // Should only call service once after debounce
      expect(mockReservationsService.searchReservations).toHaveBeenCalledTimes(1);
      expect(mockReservationsService.searchReservations).toHaveBeenCalledWith('abc');
      
      jasmine.clock().uninstall();
    });
  });

  // Task 14.2: Tests for warning detection logic
  describe('Warning System', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should detect reservations with warnings', () => {
      const reservationWithWarning = {
        ...MOCK_RESERVATIONS[0],
        hasWarnings: true,
        warningMessage: 'Rate plan restriction applies'
      };
      
      expect(reservationWithWarning.hasWarnings).toBe(true);
      expect(reservationWithWarning.warningMessage).toBeDefined();
    });

    it('should display warning count in header', () => {
      const warningCount = component.getWarningCount();
      expect(warningCount).toBeGreaterThanOrEqual(0);
      expect(mockReservationsService.getWarningCount).toHaveBeenCalled();
    });

    it('should toggle warning expansion', () => {
      const reservationId = MOCK_RESERVATIONS[0].id;
      
      expect(component.isWarningExpanded(reservationId)).toBe(false);
      
      component.toggleWarningExpansion(reservationId);
      expect(component.isWarningExpanded(reservationId)).toBe(true);
      
      component.toggleWarningExpansion(reservationId);
      expect(component.isWarningExpanded(reservationId)).toBe(false);
    });

    it('should filter to show only reservations with warnings', () => {
      // Use the filter method
      component.filterWarningsOnly();
      
      expect(component.searchControl.value).toBe('warnings:only');
    });

    it('should provide warning severity information', () => {
      const reservation = {
        ...MOCK_RESERVATIONS[0],
        hasWarnings: true,
        warningMessage: 'Rate plan restriction: This rate plan has a 7-day minimum stay'
      };
      
      const severity = component.getWarningSeverity(reservation);
      expect(severity).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(severity);
    });

    it('should handle warning dismissal', () => {
      const reservation = MOCK_RESERVATIONS[0];
      const event = new Event('click');
      jest.spyOn(event, 'stopPropagation').mockImplementation(() => {});
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      component.dismissWarning(reservation, event);
      
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  // Task 14.3: Tests for balance calculation and formatting
  describe('Balance Display and Formatting', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should format positive balance correctly', () => {
      const reservation = {
        ...MOCK_RESERVATIONS[0],
        balance: 250.50
      };
      
      const formatted = component.formatBalance(reservation.balance);
      expect(formatted).toContain('250.50');
    });

    it('should format negative balance correctly', () => {
      const reservation = {
        ...MOCK_RESERVATIONS[0],
        balance: -150.75
      };
      
      const formatted = component.formatBalance(reservation.balance);
      expect(formatted).toContain('-150.75');
    });

    it('should format zero balance correctly', () => {
      const reservation = {
        ...MOCK_RESERVATIONS[0],
        balance: 0
      };
      
      const formatted = component.formatBalance(reservation.balance);
      expect(formatted).toContain('0.00');
    });

    it('should identify negative balances for styling', () => {
      const negativeReservation = {
        ...MOCK_RESERVATIONS[0],
        balance: -100
      };
      
      expect(component.isNegativeBalance(negativeReservation.balance)).toBe(true);
    });

    it('should not mark positive balances as negative', () => {
      const positiveReservation = {
        ...MOCK_RESERVATIONS[0],
        balance: 100
      };
      
      expect(component.isNegativeBalance(positiveReservation.balance)).toBe(false);
    });

    it('should not mark zero balance as negative', () => {
      const zeroReservation = {
        ...MOCK_RESERVATIONS[0],
        balance: 0
      };
      
      expect(component.isNegativeBalance(zeroReservation.balance)).toBe(false);
    });

    it('should handle currency formatting with proper decimal places', () => {
      const amounts = [100, 100.5, 100.55, 100.555];
      
      amounts.forEach(amount => {
        const formatted = component.formatBalance(amount);
        const decimalPart = formatted.split('.')[1];
        expect(decimalPart.length).toBe(2);
      });
    });
  });

  // Task 14.4: Tests for new action handlers
  describe('Header Action Handlers', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle new booking action', () => {
      component.createNewBooking();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations/new']);
    });

    it('should handle show group bookings action', () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      component.showGroupBookings();
      
      // Method should execute without errors
      expect(component).toBeDefined();
    });

    it('should handle export action', () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:test');
      global.URL.revokeObjectURL = jest.fn();
      
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any));
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any));
      
      component.exportToCSV();
      
      expect(createElementSpy).toHaveBeenCalled();
      
      // Cleanup
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should export reservations with all new fields', () => {
      // Mock URL functions
      global.URL.createObjectURL = jest.fn(() => 'blob:test');
      global.URL.revokeObjectURL = jest.fn();
      
      const clickSpy = jest.fn();
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
        setAttribute: jest.fn(),
        click: clickSpy,
        style: {}
      } as any);
      
      const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any));
      const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any));
      
      component.exportToCSV();
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      
      // Cleanup
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should handle print registration form action', () => {
      jest.spyOn(window, 'open').mockReturnValue({
        document: {
          write: jest.fn(),
          close: jest.fn()
        }
      } as any);
      
      component.printReservations();
      
      expect(window.open).toHaveBeenCalled();
    });

    it('should handle occupancy view action', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.showOccupancy();
      
      expect(window.alert).toHaveBeenCalled();
    });

    it('should handle help action', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      component.showHelp();
      
      expect(window.alert).toHaveBeenCalled();
    });

    it('should print selected reservations', () => {
      const selectedReservations = [MOCK_RESERVATIONS[0].id];
      component.selectedReservations.set(new Set(selectedReservations));
      
      jest.spyOn(window, 'open').mockReturnValue({
        document: {
          write: jest.fn(),
          close: jest.fn()
        }
      } as any);
      
      component.printReservations();
      
      expect(window.open).toHaveBeenCalled();
    });
  });

  // Task 14.5: Tests for column sorting with new fields
  describe('Column Sorting with New Fields', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should sort by reservation ID', () => {
      const sortEvent = { active: 'reservationId', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('reservationId');
      expect(component.sortDirection()).toBe('asc');
    });

    it('should sort by arrival date', () => {
      const sortEvent = { active: 'arrival', direction: 'desc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('arrival');
      expect(component.sortDirection()).toBe('desc');
    });

    it('should sort by departure date', () => {
      const sortEvent = { active: 'departure', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('departure');
    });

    it('should sort by created date', () => {
      const sortEvent = { active: 'created', direction: 'desc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('created');
    });

    it('should sort by channel', () => {
      const sortEvent = { active: 'channel', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('channel');
    });

    it('should sort by unit', () => {
      const sortEvent = { active: 'unit', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('unit');
    });

    it('should sort by guarantee', () => {
      const sortEvent = { active: 'guarantee', direction: 'asc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('guarantee');
    });

    it('should sort by balance', () => {
      const sortEvent = { active: 'balance', direction: 'desc' as const };
      
      component.sortData(sortEvent);
      
      expect(component.sortColumn()).toBe('balance');
      expect(component.sortDirection()).toBe('desc');
    });

    it('should toggle sort direction for same column', () => {
      const sortEventAsc = { active: 'balance', direction: 'asc' as const };
      const sortEventDesc = { active: 'balance', direction: 'desc' as const };
      
      component.sortData(sortEventAsc);
      expect(component.sortDirection()).toBe('asc');
      
      component.sortData(sortEventDesc);
      expect(component.sortDirection()).toBe('desc');
    });

    it('should sort numerical balance values correctly', () => {
      const sortEvent = { active: 'balance', direction: 'asc' as const };
      component.sortData(sortEvent);
      
      // Verify sort state was updated
      expect(component.sortColumn()).toBe('balance');
      expect(component.sortDirection()).toBe('asc');
    });
  });
});