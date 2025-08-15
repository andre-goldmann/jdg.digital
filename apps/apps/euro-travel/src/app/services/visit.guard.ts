import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class VisitGuard implements CanActivate {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);


  canActivate(): boolean | UrlTree {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.localStorage) {
      const hasVisited = localStorage.getItem('hasVisitedBefore') === 'true';
      if (!hasVisited) {
        // Redirect to Component A using UrlTree to avoid redirect loops
        return this.router.createUrlTree(['/welcome']);
      }
    }
    // Allow access if the flag is set (or if on server—adjust as needed)
    return true;
  }
}

