import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { AuthState } from '../auth/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public authService = inject(AuthenticationService);
  private router = inject(Router);

  authState$: Observable<AuthState> = this.authService.authState$;

  navigateToReservations(): void {
    // Check if user is authenticated before navigating to reservations
    const authState = this.authService.authState();
    if (authState.isAuthenticated) {
      this.router.navigate(['/reservations/new']);
    } else {
      // If not authenticated, start login flow
      this.authService.login();
    }
  }
}
