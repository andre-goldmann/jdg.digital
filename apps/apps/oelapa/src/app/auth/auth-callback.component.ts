import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-card class="callback-card">
        <mat-card-content>
          <div class="loading-content">
            <mat-spinner diameter="40"></mat-spinner>
            <h2>Completing authentication...</h2>
            <p>Please wait while we process your login.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .callback-card {
      max-width: 400px;
      width: 100%;
      margin: 2rem;
      text-align: center;
    }

    .loading-content {
      padding: 2rem;
    }

    h2 {
      margin: 1rem 0 0.5rem 0;
      color: #333;
    }

    p {
      color: #666;
      margin: 0;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  async ngOnInit(): Promise<void> {
    // Wait a moment for angular-oauth2-oidc to process the callback
    setTimeout(async () => {
      try {
        // Check if user is now authenticated
        if (this.authService.isAuthenticated()) {
          // Redirect to dashboard or original destination
          await this.router.navigate(['/dashboard']);
        } else {
          // Authentication failed, redirect to login
          await this.router.navigate(['/login']);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        await this.router.navigate(['/login']);
      }
    }, 1000);
  }
}
