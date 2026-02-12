import { Injectable, inject, signal } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { MenuItem, NavigationState, NavigationMode, NavigationConfig } from '../shared/navigation.models';
import { AuthenticationService } from '../auth/authentication.service';
import { ConfigurationService } from '../core/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthenticationService);
  private configService = inject(ConfigurationService);

  // Signal-based state management
  private _isExpanded = signal<boolean>(false); // Start closed by default
  private _activeRoute = signal<string>('');

  // Read-only signals for consumers
  public readonly isExpanded = this._isExpanded.asReadonly();
  public readonly activeRoute = this._activeRoute.asReadonly();

  // Backward compatibility - provides Observable interface
  public isExpanded$ = toObservable(this.isExpanded);
  public activeRoute$ = toObservable(this.activeRoute);

  // Responsive breakpoint detection
  public isMobile$ = this.breakpointObserver.observe([
    Breakpoints.Handset,
    Breakpoints.Small
  ]).pipe(
    map(result => result.matches)
  );

  // Navigation configuration based on screen size (still Observable due to BreakpointObserver)
  public navigationConfig$: Observable<NavigationConfig> = this.isMobile$.pipe(
    map(isMobile => ({
      mode: isMobile ? NavigationMode.OVER : NavigationMode.PUSH,
      hasBackdrop: isMobile,
      disableClose: !isMobile
    }))
  );

  // Complete navigation state
  public navigationState$: Observable<NavigationState> = combineLatest([
    this.isExpanded$,
    this.isMobile$,
    this.activeRoute$,
    this.getVisibleMenuItems()
  ]).pipe(
    map(([isExpanded, isMobile, activeRoute, menuItems]) => ({
      isExpanded,
      isMobile,
      activeRoute,
      menuItems
    }))
  );

  constructor() {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this._activeRoute.set(event.url);
      this.updateMenuItemExpansion(event.url);
    });

    // Initialize with current route
    this._activeRoute.set(this.router.url);

    // Menu starts closed by default on all screen sizes
    // Users can manually open it using the menu button
    this._isExpanded.set(false);

    // Auto-close menu after navigation on mobile devices
    this.isMobile$.subscribe(isMobile => {
      if (isMobile && this._isExpanded()) {
        // On mobile, close menu when switching to mobile or on route change
        this._isExpanded.set(false);
      }
    });
  }

  /**
   * Toggle sidenav open/closed state
   */
  toggleSidenav(): void {
    this._isExpanded.update(expanded => !expanded);
  }

  /**
   * Set sidenav state explicitly
   */
  setSidenavState(isExpanded: boolean): void {
    this._isExpanded.set(isExpanded);
  }

  /**
   * Get menu items from configuration and filter by user roles
   */
  private getVisibleMenuItems(): Observable<MenuItem[]> {
    return combineLatest([
      this.configService.configuration$.pipe(
        map(config => config.navigation.menuItems)
      ),
      this.authService.authState$
    ]).pipe(
      map(([menuItems, authState]) => {
        const userRoles = authState?.user?.roles || [];
        return this.filterMenuItemsByRoles(menuItems, userRoles);
      })
    );
  }

  /**
   * Get fallback menu items when configuration is not available
   */
  private getFallbackMenuItems(): MenuItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard'
      },
      {
        id: 'reservations',
        label: 'Reservations',
        icon: 'hotel',
        children: [
          {
            id: 'new-booking',
            label: 'New Booking',
            icon: 'add_circle_outline',
            route: '/reservations/new'
          },
          {
            id: 'manage-bookings',
            label: 'Manage Bookings',
            icon: 'list_alt',
            route: '/reservations'
          },
          {
            id: 'checkin-checkout',
            label: 'Check-in/out',
            icon: 'key',
            route: '/reservations/checkin'
          }
        ]
      },
      {
        id: 'reports-analytics',
        label: 'Reports & Analytics',
        icon: 'analytics',
        route: '/reports'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        route: '/settings',
        roles: ['admin']
      }
    ];
  }

  /**
   * Filter menu items based on user roles
   */
  private filterMenuItemsByRoles(items: MenuItem[], userRoles: string[]): MenuItem[] {
    return items.filter(item => {
      // Show items without role restrictions
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      // Show items if user has any of the required roles
      const hasRequiredRole = item.roles.some(role => userRoles.includes(role));

      if (hasRequiredRole && item.children) {
        // Filter children as well
        item.children = this.filterMenuItemsByRoles(item.children, userRoles);
      }

      return hasRequiredRole;
    });
  }

  /**
   * Update menu item expansion based on active route
   * This method now works with the current menu items from configuration
   */
  private updateMenuItemExpansion(activeRoute: string): void {
    // Subscribe to get current configuration and update expansion
    this.configService.configuration$.pipe(
      map(config => config.navigation.menuItems)
    ).subscribe((menuItems: MenuItem[]) => {
      menuItems.forEach((item: MenuItem) => {
        if (item.children) {
          item.expanded = item.children.some((child: MenuItem) =>
            child.route && activeRoute.startsWith(child.route)
          );
        }
      });
    });
  }

  /**
   * Check if a menu item or its children are active
   */
  isMenuItemActive(item: MenuItem, activeRoute: string): boolean {
    if (item.route && activeRoute === item.route) {
      return true;
    }

    if (item.children) {
      return item.children.some(child =>
        child.route && activeRoute.startsWith(child.route)
      );
    }

    return false;
  }

  /**
   * Check if a specific route is active
   */
  isRouteActive(route: string, activeRoute: string): boolean {
    return activeRoute === route || activeRoute.startsWith(route + '/');
  }
}
