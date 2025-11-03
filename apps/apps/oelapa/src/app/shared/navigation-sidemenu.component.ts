import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { NavigationService } from '../shared/navigation.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { MenuItem, NavigationState } from '../shared/navigation.models';

@Component({
  selector: 'app-navigation-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-sidemenu.component.html',
  styleUrl: './navigation-sidemenu.component.scss'
})
export class NavigationSidenavComponent {
  private navigationService = inject(NavigationService);
  private authService = inject(AuthenticationService);

  navigationState$: Observable<NavigationState> = this.navigationService.navigationState$;
  authState$ = this.authService.authState$;

  /**
   * Track function for ngFor to optimize rendering
   */
  trackByItemId(index: number, item: MenuItem): string {
    return item.id;
  }

  /**
   * Check if menu item is active
   */
  isMenuItemActive(item: MenuItem, activeRoute: string): boolean {
    return this.navigationService.isMenuItemActive(item, activeRoute);
  }

  /**
   * Handle menu item click - close sidenav on mobile
   */
  onMenuItemClick(): void {
    this.navigationService.navigationConfig$.subscribe(config => {
      if (config.mode === 'over') {
        // Close sidenav on mobile after navigation
        setTimeout(() => {
          this.navigationService.setSidenavState(false);
        }, 100);
      }
    }).unsubscribe();
  }

  /**
   * Get display text for user roles
   */
  getUserRoleDisplay(roles: string[]): string {
    if (!roles || roles.length === 0) {
      return 'User';
    }

    if (roles.includes('admin')) {
      return 'Administrator';
    }

    return roles[0] || 'User';
  }
}
