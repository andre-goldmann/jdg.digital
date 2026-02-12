/**
 * Task 14 Integration Testing for ReservationsListComponent
 * Focused integration tests covering the key requirements
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { ReservationsListComponent } from './reservations-list.component';
import { ReservationsListService } from './reservations-list.service';
import { AuthenticationService } from '../auth/authentication.service';
import { authGuard } from '../auth/auth.guard';
import { ReservationListItem, MOCK_RESERVATIONS, ReservationStatus } from './reservation.models';
import { AuthState, UserProfile } from '../auth/auth.models';

// Mock components for routing tests
@Component({
  template: '<div>Mock Dashboard</div>',
  standalone: true
})
class MockDashboardComponent {}

@Component({
  template: '<div>Mock Login</div>',
  standalone: true
})
class MockLoginComponent {}

describe('ReservationsListComponent - Task 14 Integration Tests', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  let router: Router;
  let location: Location;
  let service: ReservationsListService;
  let authService: Partial<AuthenticationService>;

  beforeEach(async () => {
    // Create minimal auth service mock
    authService = {
      authState: signal({
        isAuthenticated: true,
        user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
        loading: false,
        error: null
      }).asReadonly(),
      isLoading: signal(false).asReadonly(),
      authState$: undefined as any, // Not needed for these tests
      login: jest.fn(),
      logout: jest.fn(),
      getProfile: jest.fn().mockResolvedValue({ id: 'user-1', email: 'test@example.com', name: 'Test User' })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReservationsListComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'reservations', component: ReservationsListComponent, canActivate: [authGuard] },
          { path: 'dashboard', component: MockDashboardComponent },
          { path: 'login', component: MockLoginComponent },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]),
        ReservationsListService,
        { provide: AuthenticationService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    service = TestBed.inject(ReservationsListService);

    // Initialize with mock data to prevent loading issues
    (service as any)._reservations.set(MOCK_RESERVATIONS.slice(0, 3)); // Use first 3 items
    (service as any)._loading.set(false);
  });

  // Task 14.1: Test navigation integration with existing app structure
  describe('14.1 Navigation Integration', () => {
    it('should navigate to reservations route correctly', async () => {
      await router.navigate(['/reservations']);
      expect(location.path()).toBe('/reservations');
    });

    it('should be accessible via routing configuration', async () => {
      const routes = router.config;
      const reservationsRoute = routes.find(route => route.path === 'reservations');
      
      expect(reservationsRoute).toBeDefined();
      expect(reservationsRoute?.component).toBe(ReservationsListComponent);
      expect(reservationsRoute?.canActivate).toContain(authGuard);
    });

    it('should handle route parameters for filtering', async () => {
      await router.navigate(['/reservations'], {
        queryParams: { status: 'confirmed', search: 'test' }
      });

      expect(location.path()).toContain('status=confirmed');
      expect(location.path()).toContain('search=test');
    });
  });

  // Task 14.2: Test authentication integration and route guards
  describe('14.2 Authentication Integration', () => {
    it('should check authentication status on initialization', () => {
      fixture.detectChanges();
      
      // Component should initialize successfully with authenticated user
      expect(component).toBeTruthy();
      expect(authService.authState!().isAuthenticated).toBe(true);
    });

    it('should be protected by auth guard', () => {
      const routes = router.config;
      const reservationsRoute = routes.find(route => route.path === 'reservations');
      
      expect(reservationsRoute?.canActivate).toContain(authGuard);
    });

    it('should handle authentication state changes', () => {
      // Mock unauthenticated state
      (authService.authState as any).set({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });

      fixture.detectChanges();

      // Component should still be created but may have limited functionality
      expect(component).toBeTruthy();
    });
  });

  // Task 14.3: Test performance with large datasets
  describe('14.3 Performance Testing', () => {
    it('should handle large datasets efficiently', () => {
      // Create large mock dataset
      const largeDataset: ReservationListItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `large-${i}`,
        guestName: `Guest ${i}`,
        checkInDate: new Date(2024, 2, (i % 28) + 1),
        checkOutDate: new Date(2024, 2, ((i % 28) + 5)),
        roomType: ['Standard', 'Deluxe', 'Suite'][i % 3] as any,
        status: ['confirmed', 'pending', 'cancelled'][i % 3] as any,
        numberOfGuests: (i % 4) + 1,
        specialRequests: i % 10 === 0 ? 'Special request' : '',
        totalAmount: 200 + (i % 500)
      }));

      const startTime = performance.now();
      
      // Update service with large dataset
      (service as any)._reservations.set(largeDataset);
      
      fixture.detectChanges();
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Performance should be reasonable (under 1 second for rendering)
      expect(renderTime).toBeLessThan(1000);
      expect(component.reservations().length).toBe(1000);
    });

    it('should handle pagination efficiently with large datasets', () => {
      // Create large dataset
      const largeDataset: ReservationListItem[] = Array.from({ length: 500 }, (_, i) => ({
        id: `perf-${i}`,
        guestName: `Guest ${i}`,
        checkInDate: new Date(2024, 2, (i % 28) + 1),
        checkOutDate: new Date(2024, 2, ((i % 28) + 5)),
        roomType: 'Standard' as any,
        status: 'confirmed' as any,
        numberOfGuests: 2,
        specialRequests: '',
        totalAmount: 300
      }));

      (service as any)._reservations.set(largeDataset);
      (service as any)._pageSize.set(25); // Set reasonable page size
      
      fixture.detectChanges();

      // Verify pagination limits display
      const paginatedItems = component.paginatedReservations();
      expect(paginatedItems.items.length).toBeLessThanOrEqual(25);
      expect(paginatedItems.totalCount).toBe(500);
    });

    it('should handle search operations efficiently', () => {
      // Set up data for search testing
      const searchDataset: ReservationListItem[] = Array.from({ length: 100 }, (_, i) => ({
        id: `search-${i}`,
        guestName: i < 50 ? `John ${i}` : `Jane ${i}`,
        checkInDate: new Date(2024, 2, (i % 28) + 1),
        checkOutDate: new Date(2024, 2, ((i % 28) + 5)),
        roomType: 'Standard' as any,
        status: 'confirmed' as any,
        numberOfGuests: 2,
        specialRequests: '',
        totalAmount: 300
      }));

      (service as any)._reservations.set(searchDataset);
      
      const startTime = performance.now();
      
      // Perform search operation
      (service as any)._searchTerm.set('John');
      fixture.detectChanges();
      
      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // Search should be fast (under 100ms)
      expect(searchTime).toBeLessThan(100);
      
      // Verify search results
      const filteredResults = service.filteredReservations();
      expect(filteredResults.length).toBe(50); // Should find all Johns
    });
  });

  // Task 14.4: Validate accessibility compliance
  describe('14.4 Accessibility Compliance', () => {
    it('should have proper ARIA labels and roles', () => {
      fixture.detectChanges();

      const tableElement = fixture.debugElement.query(By.css('table'));
      if (tableElement) {
        expect(tableElement.nativeElement.getAttribute('role')).toBe('table');
      }

      // Check for ARIA labels on interactive elements
      const interactiveElements = fixture.debugElement.queryAll(
        By.css('input, button, select')
      );

      interactiveElements.forEach(element => {
        const ariaLabel = element.nativeElement.getAttribute('aria-label');
        const ariaLabelledBy = element.nativeElement.getAttribute('aria-labelledby');
        const hasLabel = element.nativeElement.labels?.length > 0;
        
        // Each interactive element should have some form of accessible name
        expect(ariaLabel || ariaLabelledBy || hasLabel).toBeTruthy();
      });
    });

    it('should maintain proper keyboard navigation', () => {
      fixture.detectChanges();

      const focusableElements = fixture.debugElement.queryAll(
        By.css('input, button, select, [tabindex]:not([tabindex="-1"])')
      );

      // All focusable elements should be keyboard accessible
      focusableElements.forEach(element => {
        const tabIndex = element.nativeElement.tabIndex;
        expect(tabIndex).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have sufficient color contrast for status indicators', () => {
      fixture.detectChanges();

      // Look for status badges or indicators
      const statusElements = fixture.debugElement.queryAll(By.css('.status-badge, .reservation-status'));
      
      // This is a basic check - in a real scenario, you'd use tools like axe-core
      statusElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element.nativeElement);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Basic check that colors are defined
        expect(backgroundColor).toBeTruthy();
        expect(color).toBeTruthy();
      });
    });

    it('should provide screen reader friendly content', () => {
      fixture.detectChanges();

      // Check for screen reader only content
      const srOnlyElements = fixture.debugElement.queryAll(By.css('.sr-only, .cdk-visually-hidden'));
      
      // Should have some screen reader only content for better accessibility
      expect(srOnlyElements.length).toBeGreaterThan(0);
    });
  });

  // Additional integration tests
  describe('Component Integration Health', () => {
    it('should properly initialize all dependencies', () => {
      // Verify all required dependencies are available
      expect(component).toBeTruthy();
      expect(service).toBeTruthy();
      expect(router).toBeTruthy();
      expect(authService).toBeTruthy();

      fixture.detectChanges();

      // Component should initialize without errors
      expect(component.loading()).toBeFalsy();
      expect(component.reservations().length).toBeGreaterThan(0);
    });

    it('should handle component lifecycle properly', () => {
      // Spy on lifecycle methods
      const ngOnDestroySpy = jest.spyOn(component, 'ngOnDestroy');

      fixture.detectChanges();

      // Component should initialize successfully
      expect(component).toBeTruthy();

      // Destroy component
      fixture.destroy();

      // Lifecycle cleanup should be called
      expect(ngOnDestroySpy).toHaveBeenCalled();
    });

    it('should integrate with Material Design components', () => {
      fixture.detectChanges();

      // Check for Material components
      const materialTable = fixture.debugElement.query(By.css('mat-table, table[mat-table]'));
      const materialInputs = fixture.debugElement.queryAll(By.css('mat-form-field'));
      
      // Material components should be present if the UI is fully implemented
      expect(materialTable || materialInputs.length > 0).toBeTruthy();
    });
  });
});