import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthenticationService } from '../auth/authentication.service';
import { AuthState } from '../auth/auth.models';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (authState$ | async; as authState) {
      <div class="auth-status">
        @if (authState.loading) {
          <div class="loading-indicator">
            <mat-spinner diameter="24"></mat-spinner>
            <span>Authenticating...</span>
          </div>
        }
        
        @if (!authState.loading && authState.isAuthenticated) {
          <div class="user-info">
            <mat-icon>account_circle</mat-icon>
            <span>Welcome, {{ authState.user?.firstName || authState.user?.username }}!</span>
            <button mat-icon-button (click)="logout()" [attr.aria-label]="'Logout'">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        }
        
        @if (!authState.loading && !authState.isAuthenticated) {
          <div class="login-prompt">
            <button mat-raised-button color="primary" (click)="login()">
              Login
            </button>
          </div>
        }
        
        @if (authState.error) {
          <div class="error-message">
            <mat-icon color="warn">error</mat-icon>
            <span>{{ authState.error }}</span>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .auth-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    
    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f44336;
    }
  `]
})
export class AuthStatusComponent {
  private authService = inject(AuthenticationService);

  authState$: Observable<AuthState> = this.authService.authState$;

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}