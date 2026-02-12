import { Injectable, inject, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export interface BreadcrumbItem {
  label: string;
  url: string;
  icon?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // Signal-based breadcrumb state
  private _breadcrumbs = signal<BreadcrumbItem[]>([]);
  
  // Read-only signal for consumers
  public readonly breadcrumbs = this._breadcrumbs.asReadonly();
  
  // Observable for backward compatibility
  public breadcrumbs$ = toObservable(this.breadcrumbs);

  constructor() {
    // Listen to route changes and update breadcrumbs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });

    // Initialize breadcrumbs for current route
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    const breadcrumbs = this.createBreadcrumbs(this.router.url);
    this._breadcrumbs.set(breadcrumbs);
  }

  private createBreadcrumbs(url: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with home/dashboard
    breadcrumbs.push({
      label: 'Dashboard',
      url: '/dashboard',
      icon: 'dashboard'
    });

    // Parse URL segments and create breadcrumbs
    const urlSegments = url.split('/').filter(segment => segment);
    
    if (urlSegments.length === 0) {
      // Root path, just return dashboard
      breadcrumbs[0].active = true;
      return breadcrumbs;
    }

    let currentPath = '';
    
    for (let i = 0; i < urlSegments.length; i++) {
      const segment = urlSegments[i];
      currentPath += `/${segment}`;
      
      const breadcrumbItem = this.createBreadcrumbForSegment(segment, currentPath, i === urlSegments.length - 1);
      if (breadcrumbItem) {
        breadcrumbs.push(breadcrumbItem);
      }
    }

    return breadcrumbs;
  }

  private createBreadcrumbForSegment(segment: string, fullPath: string, isLast: boolean): BreadcrumbItem | null {
    // Define route mappings for known segments
    const routeMappings: Record<string, { label: string; icon?: string }> = {
      'dashboard': { label: 'Dashboard', icon: 'dashboard' },
      'reservations': { label: 'Reservations', icon: 'hotel' },
      'new': { label: 'New Reservation', icon: 'add_circle_outline' },
      'new-signals': { label: 'New Reservation (Signals)', icon: 'add_circle' },
      'checkin': { label: 'Check-in/out', icon: 'key' },
      'examples': { label: 'Examples', icon: 'code' },
      'invoice-stores': { label: 'Invoice Store Comparison', icon: 'storage' },
      'settings': { label: 'Settings', icon: 'settings' },
      'reports': { label: 'Reports & Analytics', icon: 'analytics' }
    };

    const mapping = routeMappings[segment];
    if (mapping) {
      return {
        label: mapping.label,
        url: fullPath,
        icon: mapping.icon,
        active: isLast
      };
    }

    // For unknown segments, create a generic breadcrumb
    // This handles dynamic routes like /reservations/123
    if (this.isUuid(segment) || this.isId(segment)) {
      return {
        label: `ID: ${segment.substring(0, 8)}...`,
        url: fullPath,
        active: isLast
      };
    }

    // Capitalize and format unknown segments
    return {
      label: this.formatSegmentLabel(segment),
      url: fullPath,
      active: isLast
    };
  }

  private formatSegmentLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private isUuid(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  private isId(str: string): boolean {
    return /^\d+$/.test(str) || (str.length > 10 && /^[a-zA-Z0-9]+$/.test(str));
  }

  /**
   * Manually set breadcrumbs for complex scenarios
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this._breadcrumbs.set(breadcrumbs);
  }

  /**
   * Add a custom breadcrumb item
   */
  addBreadcrumb(item: BreadcrumbItem): void {
    const current = this._breadcrumbs();
    // Remove active state from current items
    const updated = current.map(b => ({ ...b, active: false }));
    updated.push({ ...item, active: true });
    this._breadcrumbs.set(updated);
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    this._breadcrumbs.set([]);
  }
}