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
    console.log('🔄 Auth callback component initialized');
    
    // The OAuth callback should already be processed by the app component
    // This component serves as a backup and redirect handler
    
    // Wait longer for the OAuth processing to complete
    setTimeout(async () => {
      try {
        console.log('⏰ Checking authentication status in callback component...');
        console.log('Has valid access token:', this.authService.isAuthenticated());
        
        // Force recheck of auth state
        this.authService.recheckAuthState();
        
        // Wait a bit more for the auth state to update
        setTimeout(async () => {
          if (this.authService.isAuthenticated()) {
            console.log('✅ Authentication confirmed, redirecting to dashboard');
            await this.router.navigate(['/dashboard']);
          } else {
            console.log('❌ Authentication not confirmed, redirecting to login');
            await this.router.navigate(['/login']);
          }
        }, 500);
        
      } catch (error) {
        console.error('💥 Auth callback error:', error);
        await this.router.navigate(['/login']);
      }
    }, 2000); // Increased timeout to allow OAuth processing
  }
}
