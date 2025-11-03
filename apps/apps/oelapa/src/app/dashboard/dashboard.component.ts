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
  template: `
    <div class="dashboard-container">
      <div class="dashboard-content">
        <mat-card class="welcome-card">
          <mat-card-header>
            <mat-card-title>Welcome to OELAPA</mat-card-title>
            <mat-card-subtitle>Property Management System</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            @if (authState$ | async; as authState) {
              @if (authState.user) {
                <div class="user-details">
                  <h3>User Information</h3>
                  <p><strong>Name:</strong> {{ authState.user.firstName }} {{ authState.user.lastName }}</p>
                  <p><strong>Username:</strong> {{ authState.user.username }}</p>
                  <p><strong>Email:</strong> {{ authState.user.email }}</p>
                  <p><strong>Roles:</strong> {{ authState.user.roles.join(', ') || 'No roles assigned' }}</p>
                </div>
              }
            }
            
            <div class="features-section">
              <h3>Available Features</h3>
              <div class="feature-grid">
                <mat-card class="feature-card" (click)="navigateToReservations()">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>hotel</mat-icon>
                    <mat-card-title>Reservations</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Manage bookings and guest reservations
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary">Create New Reservation</button>
                  </mat-card-actions>
                </mat-card>
                
                <mat-card class="feature-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>home</mat-icon>
                    <mat-card-title>Properties</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Manage units and property inventory
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="feature-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>receipt</mat-icon>
                    <mat-card-title>Invoicing</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    Handle billing and financial transactions
                  </mat-card-content>
                </mat-card>
                
                <mat-card class="feature-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>analytics</mat-icon>
                    <mat-card-title>Reports</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    View analytics and generate reports
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100%;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-content {
      width: 100%;
    }
    
    .welcome-card {
      margin-bottom: 2rem;
    }
    
    .user-details {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .user-details h3 {
      margin-top: 0;
      color: #333;
    }
    
    .user-details p {
      margin: 0.5rem 0;
      color: #666;
    }
    
    .features-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .feature-card {
      height: 180px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .feature-card mat-icon {
      color: #667eea;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  
  authState$: Observable<AuthState> = this.authService.authState$;

  navigateToReservations(): void {
    this.router.navigate(['/reservations/new']);
  }
}