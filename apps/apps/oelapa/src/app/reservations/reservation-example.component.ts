// Example: Using the ReservationService in a component

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from './reservation.service';
import { ReservationRequest, ReservationResponse } from './reservation.models';

@Component({
  selector: 'app-reservation-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reservation-form">
      <h2>Create Reservation</h2>
      <button (click)="createSampleReservation()" 
              [disabled]="loading">
        {{ loading ? 'Creating...' : 'Create Sample Reservation' }}
      </button>
      
      @if (result) {
        <div class="result">
          <h3>Result:</h3>
          <pre>{{ result | json }}</pre>
        </div>
      }
      
      @if (error) {
        <div class="error">
          <h3>Error:</h3>
          <p>{{ error }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .reservation-form { padding: 20px; }
    .result { margin-top: 20px; color: green; }
    .error { margin-top: 20px; color: red; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
  `]
})
export class ReservationExampleComponent {
  private readonly reservationService = inject(ReservationService);
  
  loading = false;
  result: ReservationResponse | null = null;
  error: string | null = null;

  createSampleReservation(): void {
    this.loading = true;
    this.result = null;
    this.error = null;

    const reservationData: ReservationRequest = {
      guestName: 'John Doe',
      checkInDate: '2025-11-10',
      checkOutDate: '2025-11-15',
      guestCount: 2,
      roomType: 'Standard',
      specialRequests: 'Late check-in preferred'
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
        console.log('Reservation created successfully:', response);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'An unexpected error occurred';
        console.error('Failed to create reservation:', error);
      }
    });
  }
}