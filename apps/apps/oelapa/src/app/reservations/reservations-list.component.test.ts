import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsListService } from './reservations-list.service';
import { ReservationStatus, MOCK_RESERVATIONS } from './reservation.models';

describe('ReservationsListComponent', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  let mockReservationsService: jest.Mocked<ReservationsListService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockDialog: jest.Mocked<MatDialog>;

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
      fixture.detectChanges();
      
      expect(component.searchControl.value).toBe('');
      expect(component.showFilters()).toBe(false);
      expect(component.virtualScrollEnabled()).toBe(false);
    });

    it('should load reservations on init', () => {
      fixture.detectChanges();
      
      expect(mockReservationsService.getReservations).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    it('should update search control', () => {
      fixture.detectChanges();
      
      component.searchControl.setValue('test search');
      
      expect(component.searchControl.value).toBe('test search');
    });

    it('should clear search', () => {
      fixture.detectChanges();
      
      component.searchControl.setValue('test search');
      component.clearSearch();
      
      expect(component.searchControl.value).toBe('');
    });
  });

  describe('Filter Functionality', () => {
    it('should toggle filter panel', () => {
      fixture.detectChanges();
      
      const initialValue = component.showFilters();
      component.toggleFilters();
      
      expect(component.showFilters()).toBe(!initialValue);
    });

    it('should clear all filters', () => {
      fixture.detectChanges();
      
      // Set some filters
      component.statusFilter.setValue([ReservationStatus.CONFIRMED]);
      component.clearFilters();
      
      expect(component.statusFilter.value).toEqual([]);
      expect(mockReservationsService.clearFilters).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should navigate to next page', () => {
      fixture.detectChanges();
      
      component.nextPage();
      
      expect(mockReservationsService.nextPage).toHaveBeenCalled();
    });

    it('should navigate to previous page', () => {
      fixture.detectChanges();
      
      component.previousPage();
      
      expect(mockReservationsService.previousPage).toHaveBeenCalled();
    });

    it('should go to specific page', () => {
      fixture.detectChanges();
      
      component.goToPage(5);
      
      expect(mockReservationsService.goToPage).toHaveBeenCalledWith(5);
    });
  });

  describe('Virtual Scrolling', () => {
    it('should toggle virtual scrolling', () => {
      fixture.detectChanges();
      
      const initialValue = component.virtualScrollEnabled();
      component.toggleVirtualScrolling();
      
      expect(component.virtualScrollEnabled()).toBe(!initialValue);
      expect(mockReservationsService.setVirtualScrollingMode).toHaveBeenCalledWith(!initialValue);
    });
  });

  describe('Row Actions', () => {
    it('should navigate to reservation details', () => {
      fixture.detectChanges();
      
      const reservationId = 'test-id';
      component.viewReservation(reservationId);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations', reservationId]);
    });

    it('should navigate to edit reservation', () => {
      fixture.detectChanges();
      
      const reservationId = 'test-id';
      component.editReservation(reservationId);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations', reservationId, 'edit']);
    });
  });

  describe('Component Cleanup', () => {
    it('should cleanup on destroy', () => {
      fixture.detectChanges();
      
      component.ngOnDestroy();
      
      expect(mockReservationsService.cleanup).toHaveBeenCalled();
    });
  });
});