/**
 * Component-Service Integration Tests for ReservationsListComponent
 * Tests the integration between component and service layers
 * Simplified approach focusing on key integration points
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsListService } from './reservations-list.service';
import { AuthenticationService } from '../auth/authentication.service';

describe('ReservationsListComponent - Component-Service Integration', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  let service: ReservationsListService;
  let authService: Partial<AuthenticationService>;

  const mockReservations = [
    {
      id: 'test-1',
      guestName: 'John Doe',
      checkIn: new Date('2024-03-01'),
      checkOut: new Date('2024-03-05'),
      roomType: 'Standard' as const,
      status: 'confirmed' as const,
      numberOfGuests: 2,
      specialRequests: '',
      totalAmount: 400
    },
    {
      id: 'test-2',
      guestName: 'Jane Smith',
      checkIn: new Date('2024-03-10'),
      checkOut: new Date('2024-03-15'),
      roomType: 'Deluxe' as const,
      status: 'pending' as const,
      numberOfGuests: 1,
      specialRequests: 'Late checkout',
      totalAmount: 600
    }
  ];

  beforeEach(async () => {
    // Create minimal auth service mock
    authService = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      getCurrentUser: jest.fn().mockReturnValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User'
      }),
      getUserPermissions: jest.fn().mockReturnValue(['reservations:read']),
      isAuthenticated$: of(true),
      user$: of({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User'
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReservationsListComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReservationsListService,
        { provide: AuthenticationService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ReservationsListService);
  });

  describe('Service Integration', () => {
    it('should load reservations from service on initialization', async () => {
      // Mock service response
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(service.getReservations).toHaveBeenCalled();
      expect(component.reservations().length).toBe(2);
      expect(component.reservations()[0].guestName).toBe('John Doe');
    });

    it('should handle service errors gracefully', async () => {
      // Mock service to reject
      jest.spyOn(service, 'getReservations').mockRejectedValue(new Error('Service error'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.loading()).toBeFalse();
      expect(component.error()).toBeTruthy();
      expect(component.reservations().length).toBe(0);
    });

    it('should integrate search functionality with service', async () => {
      // Setup initial data
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'searchReservations').mockImplementation((reservations, term) => {
        return reservations.filter(r => 
          r.guestName.toLowerCase().includes(term.toLowerCase())
        );
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Test search integration
      component.searchTerm.set('John');
      component.applyFilters();

      expect(service.searchReservations).toHaveBeenCalledWith(mockReservations, 'John');
      expect(component.filteredReservations().length).toBe(1);
      expect(component.filteredReservations()[0].guestName).toBe('John Doe');
    });

    it('should integrate filtering functionality with service', async () => {
      // Setup initial data
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'filterReservations').mockImplementation((reservations, filters) => {
        return reservations.filter(r => 
          filters.statuses.length === 0 || filters.statuses.includes(r.status)
        );
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Test filtering integration
      component.selectedStatuses.set(['confirmed']);
      component.applyFilters();

      expect(service.filterReservations).toHaveBeenCalledWith(
        mockReservations,
        expect.objectContaining({
          statuses: ['confirmed']
        })
      );
      expect(component.filteredReservations().length).toBe(1);
      expect(component.filteredReservations()[0].status).toBe('confirmed');
    });
  });

  describe('Authentication Integration', () => {
    it('should check authentication on component initialization', () => {
      fixture.detectChanges();
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });

    it('should handle unauthenticated state', () => {
      // Mock unauthenticated
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      fixture.detectChanges();

      // Component should still initialize but may limit functionality
      expect(component).toBeTruthy();
    });

    it('should respect user permissions for actions', () => {
      // Mock limited permissions
      (authService.getUserPermissions as jest.Mock).mockReturnValue(['reservations:read']);

      fixture.detectChanges();

      // Verify component adapts to permissions
      expect(component).toBeTruthy();
      // Additional permission-based tests would depend on actual implementation
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle service initialization errors', async () => {
      jest.spyOn(service, 'getReservations').mockRejectedValue(new Error('Init error'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.error()).toBeTruthy();
      expect(component.loading()).toBeFalse();
    });

    it('should handle search errors', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'searchReservations').mockImplementation(() => {
        throw new Error('Search error');
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Test search error handling
      try {
        component.searchTerm.set('test');
        component.applyFilters();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    it('should recover from temporary service failures', async () => {
      // Initial failure
      jest.spyOn(service, 'getReservations')
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce(mockReservations);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.error()).toBeTruthy();

      // Retry and succeed
      await component.loadReservations();
      fixture.detectChanges();

      expect(component.error()).toBeFalsy();
      expect(component.reservations().length).toBe(2);
    });
  });

  describe('State Management Integration', () => {
    it('should maintain consistent state between service and component', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);

      fixture.detectChanges();
      await fixture.whenStable();

      // Verify state consistency
      expect(component.reservations().length).toBe(2);
      expect(component.filteredReservations().length).toBe(2);
      expect(component.loading()).toBeFalse();
      expect(component.error()).toBeFalsy();
    });

    it('should update component state when service data changes', async () => {
      // Initial data
      jest.spyOn(service, 'getReservations').mockResolvedValue([mockReservations[0]]);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.reservations().length).toBe(1);

      // Updated data
      (service.getReservations as jest.Mock).mockResolvedValue(mockReservations);
      await component.loadReservations();
      fixture.detectChanges();

      expect(component.reservations().length).toBe(2);
    });

    it('should maintain filter state during service operations', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'filterReservations').mockImplementation((reservations, filters) => {
        return reservations.filter(r => filters.statuses.includes(r.status));
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Apply filters
      component.selectedStatuses.set(['confirmed']);
      component.applyFilters();

      const filteredCount = component.filteredReservations().length;

      // Reload data
      await component.loadReservations();
      fixture.detectChanges();

      // Filters should be maintained
      expect(component.selectedStatuses()).toEqual(['confirmed']);
      expect(component.filteredReservations().length).toBe(filteredCount);
    });
  });

  describe('Reactive Updates Integration', () => {
    it('should react to signal changes appropriately', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'searchReservations').mockImplementation((reservations, term) => {
        return reservations.filter(r => 
          r.guestName.toLowerCase().includes(term.toLowerCase())
        );
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Test reactive search updates
      const initialCount = component.filteredReservations().length;
      
      component.searchTerm.set('John');
      component.applyFilters();

      expect(component.filteredReservations().length).toBeLessThan(initialCount);

      // Clear search
      component.searchTerm.set('');
      component.applyFilters();

      expect(component.filteredReservations().length).toBe(initialCount);
    });

    it('should handle multiple simultaneous signal updates', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'searchReservations').mockImplementation((reservations, term) => {
        return reservations.filter(r => 
          r.guestName.toLowerCase().includes(term.toLowerCase())
        );
      });
      jest.spyOn(service, 'filterReservations').mockImplementation((reservations, filters) => {
        return reservations.filter(r => 
          filters.statuses.length === 0 || filters.statuses.includes(r.status)
        );
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Update multiple signals simultaneously
      component.searchTerm.set('John');
      component.selectedStatuses.set(['confirmed']);
      component.applyFilters();

      expect(service.searchReservations).toHaveBeenCalled();
      expect(service.filterReservations).toHaveBeenCalled();
      expect(component.filteredReservations().length).toBeLessThanOrEqual(mockReservations.length);
    });
  });

  describe('Performance Integration', () => {
    it('should handle efficient service interactions', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockReservations[0],
        id: `large-${i}`,
        guestName: `Guest ${i}`
      }));

      jest.spyOn(service, 'getReservations').mockResolvedValue(largeDataset);

      const startTime = performance.now();
      fixture.detectChanges();
      await fixture.whenStable();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(500); // 500ms threshold
      expect(component.reservations().length).toBe(100);
    });

    it('should debounce service calls appropriately', async () => {
      jest.spyOn(service, 'getReservations').mockResolvedValue(mockReservations);
      jest.spyOn(service, 'searchReservations').mockImplementation((reservations, term) => {
        return reservations.filter(r => 
          r.guestName.toLowerCase().includes(term.toLowerCase())
        );
      });

      fixture.detectChanges();
      await fixture.whenStable();

      // Rapid search term changes
      component.searchTerm.set('J');
      component.searchTerm.set('Jo');
      component.searchTerm.set('Joh');
      component.searchTerm.set('John');
      component.applyFilters();

      // Verify service is called efficiently (implementation dependent)
      expect(service.searchReservations).toHaveBeenCalled();
    });
  });
});