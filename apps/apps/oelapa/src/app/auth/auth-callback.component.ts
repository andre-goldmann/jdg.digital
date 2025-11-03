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
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
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
