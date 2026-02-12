import { Injectable, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface NavigationTransition {
  isNavigating: boolean;
  currentRoute: string;
  previousRoute: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationEnhancementService {
  private router = inject(Router);
  private titleService = inject(Title);

  private _navigationTransition = new BehaviorSubject<NavigationTransition>({
    isNavigating: false,
    currentRoute: '',
    previousRoute: ''
  });

  public navigationTransition$ = this._navigationTransition.asObservable();

  // Page title mappings for consistent titles
  private readonly pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard - OELAPA',
    '/reservations': 'Reservations - OELAPA',
    '/reservations/new': 'New Reservation - OELAPA',
    '/reservations/checkin': 'Check-in/out - OELAPA',
    '/examples/invoice-stores': 'Invoice Store Examples - OELAPA',
    '/login': 'Login - OELAPA',
    '/auth/callback': 'Authentication - OELAPA'
  };

  // Route display names for announcements
  private readonly routeDisplayNames: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/reservations': 'Reservations List',
    '/reservations/new': 'New Reservation Form',
    '/reservations/checkin': 'Check-in and Check-out',
    '/examples/invoice-stores': 'Invoice Store Examples',
    '/login': 'Login Page',
    '/auth/callback': 'Authentication Processing'
  };

  constructor() {
    this.setupNavigationTracking();
    this.setupTitleUpdates();
  }

  setupNavigationTracking(): void {
    let previousRoute = '';

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentState = this._navigationTransition.value;
        this._navigationTransition.next({
          isNavigating: true,
          currentRoute: event.url,
          previousRoute: currentState.currentRoute || previousRoute
        });
      } else if (event instanceof NavigationEnd) {
        previousRoute = this._navigationTransition.value.currentRoute;
        this._navigationTransition.next({
          isNavigating: false,
          currentRoute: event.url,
          previousRoute: previousRoute
        });
        
        // Announce navigation for screen readers
        this.announceNavigation(event.url);
      } else if (event instanceof NavigationError) {
        this._navigationTransition.next({
          isNavigating: false,
          currentRoute: this._navigationTransition.value.currentRoute,
          previousRoute: this._navigationTransition.value.previousRoute
        });
      }
    });
  }

  private setupTitleUpdates(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe(url => {
      this.updatePageTitle(url);
    });
  }

  private updatePageTitle(url: string): void {
    // Extract base route without query parameters
    const baseRoute = url.split('?')[0];
    const title = this.pageTitles[baseRoute] || 'OELAPA Property Management';
    this.titleService.setTitle(title);
  }

  private announceNavigation(url: string): void {
    const baseRoute = url.split('?')[0];
    const displayName = this.routeDisplayNames[baseRoute] || 'Page';
    
    // Create announcement for screen readers
    const announcement = `Navigated to ${displayName}`;
    this.announceToScreenReader(announcement);
  }

  private announceToScreenReader(message: string): void {
    // Create a temporary aria-live region for announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Get display name for current route
   */
  getRouteDisplayName(url?: string): string {
    const currentUrl = url || this.router.url;
    const baseRoute = currentUrl.split('?')[0];
    return this.routeDisplayNames[baseRoute] || 'Page';
  }

  /**
   * Check if currently navigating
   */
  isNavigating(): boolean {
    return this._navigationTransition.value.isNavigating;
  }

  /**
   * Get current navigation state
   */
  getCurrentNavigationState(): NavigationTransition {
    return this._navigationTransition.value;
  }

  /**
   * Programmatically navigate with consistent loading state
   */
  navigateWithTransition(route: string | string[], extras?: Record<string, unknown>): Promise<boolean> {
    // Set loading state immediately
    const currentState = this._navigationTransition.value;
    this._navigationTransition.next({
      ...currentState,
      isNavigating: true
    });

    return this.router.navigate(Array.isArray(route) ? route : [route], extras);
  }

  /**
   * Navigate back with proper transition
   */
  navigateBack(): void {
    const currentState = this._navigationTransition.value;
    if (currentState.previousRoute) {
      this.navigateWithTransition(currentState.previousRoute);
    } else {
      // Fallback to dashboard
      this.navigateWithTransition('/dashboard');
    }
  }

  /**
   * Add a new route title mapping
   */
  addRouteTitle(route: string, title: string, displayName?: string): void {
    this.pageTitles[route] = title;
    if (displayName) {
      this.routeDisplayNames[route] = displayName;
    }
  }
}