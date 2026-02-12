import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsListService } from './reservations-list.service';
import { ReservationStatus, MOCK_RESERVATIONS } from './reservation.models';

/**
 * Responsive Behavior Tests for ReservationsListComponent
 * 
 * These tests validate responsive design functionality, mobile adaptations,
 * and screen size detection across different viewport sizes and device orientations.
 */
describe('ReservationsListComponent - Responsive Behavior', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  let mockReservationsService: jest.Mocked<ReservationsListService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockBreakpointObserver: jest.Mocked<BreakpointObserver>;

  beforeEach(async () => {
    // Create mock service with signals
    mockReservationsService = {
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
      cleanup: jest.fn(),
      reservations: signal(MOCK_RESERVATIONS).asReadonly(),
      filteredReservations: signal(MOCK_RESERVATIONS).asReadonly(),
      paginatedReservations: signal({
        items: MOCK_RESERVATIONS.slice(0, 10),
        totalCount: MOCK_RESERVATIONS.length,
        pageSize: 10,
        currentPage: 1,
        totalPages: Math.ceil(MOCK_RESERVATIONS.length / 10)
      }).asReadonly(),
      loading: signal(false).asReadonly(),
      paginationLoading: signal(false).asReadonly(),
      error: signal(null).asReadonly(),
      totalPages: signal(1).asReadonly()
    } as unknown as jest.Mocked<ReservationsListService>;

    // Mock Router
    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    // Mock ActivatedRoute
    mockActivatedRoute = {
      queryParams: of({}),
      params: of({}),
      snapshot: { 
        queryParams: {},
        params: {}
      }
    };

    // Mock MatDialog
    mockDialog = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatDialog>;

    // Mock BreakpointObserver
    mockBreakpointObserver = {
      observe: jest.fn(),
      isMatched: jest.fn()
    } as unknown as jest.Mocked<BreakpointObserver>;

    // Set up service return values
    mockReservationsService.getReservations.mockReturnValue(of(MOCK_RESERVATIONS));
    mockReservationsService.getAllFilteredReservations.mockReturnValue(MOCK_RESERVATIONS);
    mockReservationsService.getAvailableStatuses.mockReturnValue(Object.values(ReservationStatus));

    await TestBed.configureTestingModule({
      imports: [
        ReservationsListComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ReservationsListService, useValue: mockReservationsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: mockDialog },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
  });

  describe('Mobile Breakpoint Detection', () => {
    it('should detect mobile breakpoint correctly', () => {
      // Mock mobile viewport (Handset breakpoint)
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true, breakpoints: { '(max-width: 599.98px)': true } })
      );

      fixture.detectChanges();

      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith([
        '(max-width: 599.98px)'
      ]);
      expect(component.isMobile()).toBe(true);
    });

    it('should detect desktop breakpoint correctly', () => {
      // Mock desktop viewport
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false, breakpoints: { '(max-width: 599.98px)': false } })
      );

      fixture.detectChanges();

      expect(component.isMobile()).toBe(false);
    });

    it('should update layout when breakpoint changes', () => {
      // Start with desktop
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false, breakpoints: { '(max-width: 599.98px)': false } })
      );

      fixture.detectChanges();
      expect(component.isMobile()).toBe(false);

      // Switch to mobile
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true, breakpoints: { '(max-width: 599.98px)': true } })
      );

      fixture.detectChanges();
      expect(component.isMobile()).toBe(true);
    });
  });

  describe('Column Visibility Based on Screen Size', () => {
    it('should show limited columns on mobile', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      const displayedColumns = component.getDisplayedColumns();
      
      // Mobile should show only essential columns
      expect(displayedColumns).toHaveLength(4); // select, guestName, checkIn, actions
      expect(displayedColumns).toContain('select');
      expect(displayedColumns).toContain('guestName');
      expect(displayedColumns).toContain('checkIn');
      expect(displayedColumns).toContain('actions');
      
      // Should not show these columns on mobile
      expect(displayedColumns).not.toContain('checkOut');
      expect(displayedColumns).not.toContain('guestCount');
      expect(displayedColumns).not.toContain('totalAmount');
      expect(displayedColumns).not.toContain('status');
    });

    it('should show all columns on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      const displayedColumns = component.getDisplayedColumns();
      
      // Desktop should show all columns
      expect(displayedColumns).toContain('select');
      expect(displayedColumns).toContain('guestName');
      expect(displayedColumns).toContain('checkIn');
      expect(displayedColumns).toContain('checkOut');
      expect(displayedColumns).toContain('guestCount');
      expect(displayedColumns).toContain('totalAmount');
      expect(displayedColumns).toContain('status');
      expect(displayedColumns).toContain('actions');
    });

    it('should update displayed columns when screen size changes', () => {
      // Start with desktop - all columns
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();
      let displayedColumns = component.getDisplayedColumns();
      expect(displayedColumns.length).toBeGreaterThan(4);

      // Switch to mobile - limited columns
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();
      displayedColumns = component.getDisplayedColumns();
      expect(displayedColumns).toHaveLength(4);
    });
  });

  describe('Page Size Adaptation', () => {
    it('should use smaller page size on mobile', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      const pageSizeOptions = component.getPageSizeOptions();
      
      // Mobile should have smaller page sizes
      expect(pageSizeOptions).toEqual([5, 10, 15]);
      expect(pageSizeOptions[0]).toBe(5); // Default should be smaller
    });

    it('should use larger page size on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      const pageSizeOptions = component.getPageSizeOptions();
      
      // Desktop should have larger page sizes
      expect(pageSizeOptions).toEqual([10, 25, 50, 100]);
      expect(pageSizeOptions[0]).toBe(10); // Default should be larger
    });

    it('should automatically adjust page size when switching to mobile', () => {
      // Start with desktop
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      // Set a large page size
      component.setPageSize(50);

      // Switch to mobile
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      // Should automatically reduce page size for mobile
      expect(mockReservationsService.setPageSize).toHaveBeenCalledWith(10);
    });
  });

  describe('Filter Panel Responsive Behavior', () => {
    it('should show compact filter layout on mobile', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.isCompactFilterLayout()).toBe(true);
    });

    it('should show expanded filter layout on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      expect(component.isCompactFilterLayout()).toBe(false);
    });

    it('should automatically collapse filters on mobile', () => {
      // Start with desktop - filters may be open
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();
      component.toggleFilters(); // Open filters

      expect(component.showFilters()).toBe(true);

      // Switch to mobile
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      // Filters should auto-collapse on mobile
      expect(component.showFilters()).toBe(false);
    });
  });

  describe('Touch and Mobile Interactions', () => {
    it('should enable touch-friendly interactions on mobile', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.isTouchEnabled()).toBe(true);
    });

    it('should disable touch interactions on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      expect(component.isTouchEnabled()).toBe(false);
    });

    it('should show mobile-optimized action buttons', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.useMobileActionButtons()).toBe(true);
    });
  });

  describe('Search and Input Adaptations', () => {
    it('should use mobile-optimized search placeholder on small screens', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      const placeholder = component.getSearchPlaceholder();
      expect(placeholder).toBe('Search...');
    });

    it('should use full search placeholder on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      const placeholder = component.getSearchPlaceholder();
      expect(placeholder).toBe('Search by guest name, email, or confirmation number...');
    });

    it('should auto-focus search on desktop but not on mobile', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      expect(component.shouldAutoFocusSearch()).toBe(true);

      // Switch to mobile
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.shouldAutoFocusSearch()).toBe(false);
    });
  });

  describe('Performance Optimizations for Mobile', () => {
    it('should enable virtual scrolling automatically on mobile with large datasets', () => {
      // Mock mobile with large dataset
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      // Mock large dataset
      const largeDataset = Array(1000).fill(null).map((_, i) => ({
        ...MOCK_RESERVATIONS[0],
        id: `reservation-${i}`
      }));

      mockReservationsService.filteredReservations = signal(largeDataset).asReadonly();

      fixture.detectChanges();

      // Should automatically enable virtual scrolling for large datasets on mobile
      expect(mockReservationsService.setVirtualScrollingMode).toHaveBeenCalledWith(true);
    });

    it('should use smaller batch sizes for mobile rendering', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      const batchSize = component.getRenderBatchSize();
      expect(batchSize).toBe(10); // Smaller batch for mobile
    });

    it('should use larger batch sizes for desktop rendering', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      const batchSize = component.getRenderBatchSize();
      expect(batchSize).toBe(25); // Larger batch for desktop
    });
  });

  describe('Orientation Changes', () => {
    it('should handle orientation change from portrait to landscape', () => {
      // Mock mobile portrait
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();
      expect(component.isMobile()).toBe(true);

      // Mock orientation change to landscape (wider screen)
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      // Should adapt to landscape mode
      expect(component.isMobile()).toBe(false);
      expect(component.getDisplayedColumns().length).toBeGreaterThan(4);
    });

    it('should recalculate table layout on orientation change', () => {
      const layoutSpy = jest.spyOn(component, 'recalculateTableLayout');

      // Start in portrait
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      // Simulate orientation change
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      expect(layoutSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility Responsive Features', () => {
    it('should adjust font sizes for mobile readability', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.useLargeFonts()).toBe(true);
    });

    it('should increase touch target sizes on mobile', () => {
      // Mock mobile breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: true })
      );

      fixture.detectChanges();

      expect(component.useLargeTouchTargets()).toBe(true);
    });

    it('should maintain standard sizes on desktop', () => {
      // Mock desktop breakpoint
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false })
      );

      fixture.detectChanges();

      expect(component.useLargeFonts()).toBe(false);
      expect(component.useLargeTouchTargets()).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle breakpoint observer errors gracefully', () => {
      // Mock breakpoint observer error
      mockBreakpointObserver.observe.mockImplementation(() => {
        throw new Error('Breakpoint observer failed');
      });

      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      // Should fallback to desktop layout
      expect(component.isMobile()).toBe(false);
    });

    it('should handle undefined breakpoint matches', () => {
      // Mock undefined breakpoint response
      mockBreakpointObserver.observe.mockReturnValue(
        of({ matches: false, breakpoints: {} })
      );

      fixture.detectChanges();

      // Should fallback to desktop layout
      expect(component.isMobile()).toBe(false);
    });

    it('should handle rapid breakpoint changes', () => {
      // Rapidly change breakpoints
      for (let i = 0; i < 10; i++) {
        mockBreakpointObserver.observe.mockReturnValue(
          of({ matches: i % 2 === 0 })
        );
        fixture.detectChanges();
      }

      // Should handle rapid changes without errors
      expect(component.isMobile()).toBeDefined();
    });
  });
});