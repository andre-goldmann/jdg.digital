import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationService } from './reservation.service';
import { ReservationRequest, ReservationResponse } from './reservation.models';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reservation-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Reservation</mat-card-title>
          <mat-card-subtitle>Enter guest and booking details</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()">
            <!-- Guest Information -->
            <div class="form-section">
              <h3>Guest Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Guest Name</mat-label>
                <input matInput 
                       formControlName="guestName" 
                       placeholder="Enter guest full name"
                       required>
                @if (reservationForm.get('guestName')?.hasError('required') && reservationForm.get('guestName')?.touched) {
                  <mat-error>Guest name is required</mat-error>
                }
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Guest Count</mat-label>
                <mat-select formControlName="guestCount" required>
                  <mat-option [value]="1">1 Guest</mat-option>
                  <mat-option [value]="2">2 Guests</mat-option>
                  <mat-option [value]="3">3 Guests</mat-option>
                  <mat-option [value]="4">4 Guests</mat-option>
                  <mat-option [value]="5">5 Guests</mat-option>
                  <mat-option [value]="6">6+ Guests</mat-option>
                </mat-select>
                @if (reservationForm.get('guestCount')?.hasError('required') && reservationForm.get('guestCount')?.touched) {
                  <mat-error>Guest count is required</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Booking Details -->
            <div class="form-section">
              <h3>Booking Details</h3>
              
              <div class="date-row">
                <mat-form-field appearance="outline" class="date-field">
                  <mat-label>Check-in Date</mat-label>
                  <input matInput 
                         type="date"
                         formControlName="checkInDate"
                         required>
                  @if (reservationForm.get('checkInDate')?.hasError('required') && reservationForm.get('checkInDate')?.touched) {
                    <mat-error>Check-in date is required</mat-error>
                  }
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="date-field">
                  <mat-label>Check-out Date</mat-label>
                  <input matInput 
                         type="date"
                         formControlName="checkOutDate"
                         required>
                  @if (reservationForm.get('checkOutDate')?.hasError('required') && reservationForm.get('checkOutDate')?.touched) {
                    <mat-error>Check-out date is required</mat-error>
                  }
                  @if (reservationForm.hasError('dateOrder')) {
                    <mat-error>Check-out date must be after check-in date</mat-error>
                  }
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Room Type</mat-label>
                <mat-select formControlName="roomType">
                  <mat-option value="Standard">Standard Room</mat-option>
                  <mat-option value="Deluxe">Deluxe Room</mat-option>
                  <mat-option value="Suite">Suite</mat-option>
                  <mat-option value="Executive">Executive Room</mat-option>
                  <mat-option value="Presidential">Presidential Suite</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Special Requests</mat-label>
                <textarea matInput 
                          formControlName="specialRequests"
                          placeholder="Any special requests or notes"
                          rows="3"></textarea>
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions align="end">
          <button mat-button 
                  type="button" 
                  (click)="onReset()"
                  [disabled]="loading()">
            Reset
          </button>
          <button mat-raised-button 
                  color="primary" 
                  (click)="onSubmit()"
                  [disabled]="reservationForm.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="20" style="margin-right: 8px;"></mat-spinner>
            }
            Create Reservation
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .reservation-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-section {
      margin-bottom: 24px;
    }
    
    .form-section h3 {
      margin: 0 0 16px 0;
      color: #424242;
      font-weight: 500;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .date-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .date-field {
      flex: 1;
    }
    
    mat-card-header {
      margin-bottom: 20px;
    }
    
    mat-card-actions {
      padding: 16px 24px;
    }
    
    @media (max-width: 600px) {
      .reservation-container {
        padding: 10px;
      }
      
      .date-row {
        flex-direction: column;
        gap: 0;
      }
      
      .date-field {
        margin-bottom: 16px;
      }
    }
  `]
})
export class NewReservationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly snackBar = inject(MatSnackBar);

  loading = signal(false);
  reservationForm: FormGroup;

  // Access the reservation resource from the service
  reservationResource = this.reservationService.reservationResource;

  constructor() {
    this.reservationForm = this.createForm();
    this.setupDateValidation();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      guestName: ['', [Validators.required, Validators.minLength(2)]],
      guestCount: ['', [Validators.required, Validators.min(1)]],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      roomType: ['Standard'],
      specialRequests: ['']
    }, { validators: this.dateOrderValidator });
  }

  private setupDateValidation(): void {
    // Set minimum date to today for validation
    this.reservationForm.get('checkInDate')?.valueChanges.subscribe(checkInDate => {
      if (checkInDate) {
        const checkOutControl = this.reservationForm.get('checkOutDate');
        // Set minimum checkout date to day after checkin
        const minCheckout = new Date(checkInDate);
        minCheckout.setDate(minCheckout.getDate() + 1);
        
        if (checkOutControl?.value && checkOutControl.value <= checkInDate) {
          checkOutControl.setValue(minCheckout.toISOString().split('T')[0]);
        }
      }
    });
  }

  private dateOrderValidator(group: FormGroup) {
    const checkIn = group.get('checkInDate')?.value;
    const checkOut = group.get('checkOutDate')?.value;
    
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      return { dateOrder: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.reservationForm.valid && !this.loading()) {
      this.loading.set(true);
      
      const formValue = this.reservationForm.value;
      const reservationData: ReservationRequest = {
        guestName: formValue.guestName,
        checkInDate: this.formatDate(formValue.checkInDate),
        checkOutDate: this.formatDate(formValue.checkOutDate),
        guestCount: formValue.guestCount,
        roomType: formValue.roomType,
        specialRequests: formValue.specialRequests
      };

      // Use the modern resource-based approach
      this.reservationService.createReservationWithResource(reservationData);
      
      // Watch for the resource state changes
      const checkResourceState = () => {
        if (this.reservationResource.hasValue()) {
          const response = this.reservationResource.value() as ReservationResponse | null;
          if (response?.reservationId) {
            this.loading.set(false);
            this.snackBar.open(
              `Reservation created successfully! ID: ${response.reservationId}`, 
              'Close', 
              { duration: 5000, panelClass: ['success-snackbar'] }
            );
            this.onReset();
            this.reservationService.resetReservationResource();
          }
        } else if (this.reservationResource.error()) {
          this.loading.set(false);
          const error = this.reservationResource.error();
          this.snackBar.open(
            `Failed to create reservation: ${error?.message || 'Unknown error'}`, 
            'Close', 
            { duration: 7000, panelClass: ['error-snackbar'] }
          );
          this.reservationService.resetReservationResource();
        }
      };

      // Check immediately and set up a simple polling mechanism
      setTimeout(checkResourceState, 100);
      setTimeout(checkResourceState, 500);
      setTimeout(checkResourceState, 1000);
      setTimeout(checkResourceState, 2000);
    }
  }

  onReset(): void {
    this.reservationForm.reset();
    this.reservationForm.patchValue({
      guestCount: '',
      roomType: 'Standard'
    });
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    
    // If it's already a string in YYYY-MM-DD format, return as is
    if (typeof date === 'string') {
      return date;
    }
    
    // If it's a Date object, convert to ISO string
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    
    // Fallback: try to create a Date from the value
    try {
      const dateObj = new Date(date);
      return dateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }
}