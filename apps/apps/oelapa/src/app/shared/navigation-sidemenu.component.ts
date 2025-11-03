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
  template: `
    @if (navigationState$ | async; as navState) {
      <div class="sidenav-content">
        <!-- Header Section -->
        <div class="sidenav-header">
          <div class="logo-section">
            <mat-icon class="logo-icon">business</mat-icon>
            <span class="logo-text">OELAPA</span>
          </div>
        </div>

        <!-- Menu Items -->
        <mat-nav-list class="navigation-menu" role="navigation" aria-label="Main navigation">
          @for (item of navState.menuItems; track trackByItemId($index, item)) {
            @if (item.divider) {
              <!-- Divider -->
              <mat-divider class="menu-divider"></mat-divider>
            } @else if (item.children && item.children.length > 0) {
              <!-- Menu Item with Children (Expandable) -->
              <mat-expansion-panel 
                class="menu-expansion-panel"
                [expanded]="item.expanded"
                hideToggle>
                
                <mat-expansion-panel-header 
                  class="menu-expansion-header"
                  [class.active]="isMenuItemActive(item, navState.activeRoute)">
                  <mat-panel-title class="menu-panel-title">
                    <mat-icon class="menu-icon">{{ item.icon }}</mat-icon>
                    <span class="menu-label">{{ item.label }}</span>
                  </mat-panel-title>
                  <mat-icon class="expand-icon">
                    {{ item.expanded ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                </mat-expansion-panel-header>

                <!-- Submenu Items -->
                <div class="submenu-container">
                  @for (child of item.children; track trackByItemId($index, child)) {
                    <a 
                      mat-list-item
                      [routerLink]="child.route"
                      routerLinkActive="active-submenu-item"
                      class="submenu-item"
                      [attr.aria-label]="child.label"
                      (click)="onMenuItemClick()">
                      <mat-icon matListItemIcon class="submenu-icon">{{ child.icon }}</mat-icon>
                      <span matListItemTitle class="submenu-label">{{ child.label }}</span>
                    </a>
                  }
                </div>
              </mat-expansion-panel>
            } @else {
              <!-- Simple Menu Item (No Children) -->
              <a 
                mat-list-item
                [routerLink]="item.route"
                routerLinkActive="active-menu-item"
                class="simple-menu-item"
                [attr.aria-label]="item.label"
                (click)="onMenuItemClick()">
                <mat-icon matListItemIcon class="menu-icon">{{ item.icon }}</mat-icon>
                <span matListItemTitle class="menu-label">{{ item.label }}</span>
              </a>
            }
          }
        </mat-nav-list>

        <!-- Footer Section -->
        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          @if (authState$ | async; as authState) {
            @if (authState.user) {
              <div class="user-info">
                <div class="user-details">
                  <mat-icon class="user-avatar">account_circle</mat-icon>
                  <div class="user-text">
                    <span class="user-name">{{ authState.user.firstName }} {{ authState.user.lastName }}</span>
                    <span class="user-role">{{ getUserRoleDisplay(authState.user.roles) }}</span>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .sidenav-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fafafa;
    }

    .sidenav-header {
      padding: 1rem;
      background-color: #667eea;
      color: white;
      min-height: 64px;
      display: flex;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: 0.1em;
    }

    .navigation-menu {
      flex: 1;
      padding: 0;
      overflow-y: auto;
    }

    .menu-divider {
      margin: 0.5rem 0;
      background-color: #e0e0e0;
    }

    .menu-expansion-panel {
      box-shadow: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
    }

    .menu-expansion-header {
      padding: 0 1rem;
      height: 48px;
    }

    .menu-expansion-header.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .menu-expansion-header:hover {
      background-color: #f5f5f5;
    }

    .menu-panel-title {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .menu-icon {
      min-width: 24px;
      color: #666;
    }

    .menu-expansion-header.active .menu-icon {
      color: #1976d2;
    }

    .menu-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .expand-icon {
      color: #999;
      margin-left: auto;
    }

    .submenu-container {
      background-color: #f8f9fa;
      border-left: 3px solid #e0e0e0;
    }

    .submenu-item {
      padding-left: 2rem !important;
      height: 40px !important;
      font-size: 0.8rem;
    }

    .submenu-item:hover {
      background-color: #e8f4fd;
    }

    .submenu-item.active-submenu-item {
      background-color: #e3f2fd;
      color: #1976d2;
      border-right: 3px solid #1976d2;
    }

    .submenu-icon {
      min-width: 20px !important;
      font-size: 1.1rem;
      color: #888;
    }

    .submenu-item.active-submenu-item .submenu-icon {
      color: #1976d2;
    }

    .submenu-label {
      font-size: 0.8rem;
    }

    .simple-menu-item {
      padding: 0 1rem;
      height: 48px;
    }

    .simple-menu-item:hover {
      background-color: #f5f5f5;
    }

    .simple-menu-item.active-menu-item {
      background-color: #e3f2fd;
      color: #1976d2;
      border-right: 3px solid #1976d2;
    }

    .simple-menu-item.active-menu-item .menu-icon {
      color: #1976d2;
    }

    .sidenav-footer {
      margin-top: auto;
      padding: 1rem;
      background-color: #f8f9fa;
    }

    .user-info {
      margin-top: 0.5rem;
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      color: #666;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .user-text {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    .user-role {
      font-size: 0.75rem;
      color: #666;
      text-transform: capitalize;
    }

    /* Accessibility */
    .menu-expansion-header:focus,
    .simple-menu-item:focus,
    .submenu-item:focus {
      outline: 2px solid #1976d2;
      outline-offset: -2px;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
      .sidenav-header {
        padding: 0.75rem;
        min-height: 56px;
      }
      
      .logo-text {
        font-size: 1.1rem;
      }
      
      .menu-label,
      .submenu-label {
        font-size: 0.875rem;
      }
    }
  `]
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