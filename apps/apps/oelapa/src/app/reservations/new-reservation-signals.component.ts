import { Component, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationService } from './reservation.service';
import { ReservationRequest } from './reservation.models';

@Component({
  selector: 'app-new-reservation-signals',
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
      <mat-card class="reservation-card">
        <mat-card-header>
          <mat-card-title>New Reservation (Signal-based)</mat-card-title>
          <mat-card-subtitle>Create a new hotel reservation using modern signal-based reactive forms</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="reservation-form">
            <!-- Guest Information -->
            <div class="form-section">
              <h3>Guest Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Guest Name</mat-label>
                <input matInput 
                       [formControl]="guestNameControl"
                       placeholder="Enter guest name"
                       required>
                @if (guestNameControl.invalid && guestNameControl.touched) {
                  <mat-error>
                    @if (guestNameControl.errors?.['required']) {
                      Guest name is required
                    }
                    @if (guestNameControl.errors?.['minlength']) {
                      Guest name must be at least 2 characters
                    }
                  </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Number of Guests</mat-label>
                <mat-select [formControl]="guestCountControl" required>
                  @for (count of guestCountOptions; track count) {
                    <mat-option [value]="count">{{ count }}</mat-option>
                  }
                </mat-select>
                @if (guestCountControl.invalid && guestCountControl.touched) {
                  <mat-error>Please select number of guests</mat-error>
                }
              </mat-form-field>
            </div>

            <!-- Reservation Dates -->
            <div class="form-section">
              <h3>Reservation Dates</h3>
              
              <div class="date-fields">
                <mat-form-field appearance="outline" class="date-field">
                  <mat-label>Check-in Date</mat-label>
                  <input matInput 
                         type="date"
                         [formControl]="checkInDateControl"
                         [min]="minDate"
                         required>
                  @if (checkInDateControl.invalid && checkInDateControl.touched) {
                    <mat-error>Check-in date is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="date-field">
                  <mat-label>Check-out Date</mat-label>
                  <input matInput 
                         type="date"
                         [formControl]="checkOutDateControl"
                         [min]="minCheckoutDate()"
                         required>
                  @if (checkOutDateControl.invalid && checkOutDateControl.touched) {
                    <mat-error>
                      @if (checkOutDateControl.errors?.['required']) {
                        Check-out date is required
                      }
                      @if (checkOutDateControl.errors?.['dateOrder']) {
                        Check-out must be after check-in
                      }
                    </mat-error>
                  }
                </mat-form-field>
              </div>
              
              @if (nightsCount() > 0) {
                <p class="nights-info">{{ nightsCount() }} night(s)</p>
              }
            </div>

            <!-- Room Information -->
            <div class="form-section">
              <h3>Room Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Room Type</mat-label>
                <mat-select [formControl]="roomTypeControl">
                  @for (roomType of roomTypeOptions; track roomType.value) {
                    <mat-option [value]="roomType.value">
                      {{ roomType.label }} - {{ roomType.price | currency }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Special Requests</mat-label>
                <textarea matInput 
                          [formControl]="specialRequestsControl"
                          placeholder="Any special requests or notes"
                          rows="3">
                </textarea>
              </mat-form-field>
            </div>

            <!-- Form Summary -->
            <div class="form-summary">
              <h3>Reservation Summary</h3>
              <div class="summary-content">
                <p><strong>Guest:</strong> {{ formSummary().guestName || 'Not specified' }}</p>
                <p><strong>Guests:</strong> {{ formSummary().guestCount || 'Not specified' }}</p>
                <p><strong>Check-in:</strong> {{ formSummary().checkInDate || 'Not specified' }}</p>
                <p><strong>Check-out:</strong> {{ formSummary().checkOutDate || 'Not specified' }}</p>
                <p><strong>Room:</strong> {{ formSummary().roomType || 'Standard' }}</p>
                @if (formSummary().specialRequests) {
                  <p><strong>Special Requests:</strong> {{ formSummary().specialRequests }}</p>
                }
                @if (estimatedTotal() > 0) {
                  <p class="total-price"><strong>Estimated Total:</strong> {{ estimatedTotal() | currency }}</p>
                }
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" 
                      mat-stroked-button 
                      (click)="resetForm()"
                      color="primary">
                Reset Form
              </button>
              
              <button type="submit" 
                      mat-raised-button 
                      color="primary"
                      [disabled]="!isFormValid() || loading()">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Creating...
                } @else {
                  Create Reservation
                }
              </button>
            </div>

            <!-- Form Status (for development) -->
            <div class="form-status">
              <p>Form Valid: {{ isFormValid() }}</p>
              <p>Loading: {{ loading() }}</p>
              <p>Has Errors: {{ hasFormErrors() }}</p>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reservation-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .reservation-card {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
    }

    .reservation-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      background: #fafafa;
    }

    .form-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.2rem;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .date-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .date-field {
      margin-bottom: 16px;
    }

    .nights-info {
      color: #666;
      font-style: italic;
      margin: 8px 0;
    }

    .form-summary {
      background: #e8f5e8;
      border: 1px solid #4caf50;
      border-radius: 8px;
      padding: 20px;
    }

    .form-summary h3 {
      margin: 0 0 16px 0;
      color: #2e7d32;
    }

    .summary-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .summary-content p {
      margin: 4px 0;
    }

    .total-price {
      grid-column: 1 / -1;
      font-size: 1.1rem;
      color: #2e7d32;
      border-top: 1px solid #4caf50;
      padding-top: 8px;
      margin-top: 8px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      align-items: center;
    }

    .form-status {
      background: #f0f0f0;
      padding: 16px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    }

    .form-status p {
      margin: 4px 0;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .reservation-container {
        padding: 10px;
      }

      .date-fields {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .date-field {
        margin-bottom: 16px;
      }

      .summary-content {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class NewReservationSignalsComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly snackBar = inject(MatSnackBar);

  // Loading state
  loading = signal(false);

  // Form Controls with signals
  guestNameControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  guestCountControl = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);
  checkInDateControl = new FormControl('', [Validators.required]);
  checkOutDateControl = new FormControl('', [Validators.required]);
  roomTypeControl = new FormControl('Standard');
  specialRequestsControl = new FormControl('');

  // Options for dropdowns
  guestCountOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  roomTypeOptions = [
    { value: 'Standard', label: 'Standard Room', price: 120 },
    { value: 'Superior', label: 'Superior Room', price: 160 },
    { value: 'Deluxe', label: 'Deluxe Room', price: 200 },
    { value: 'Suite', label: 'Junior Suite', price: 280 },
    { value: 'Executive', label: 'Executive Suite', price: 350 }
  ];

  // Computed signals
  minDate = new Date().toISOString().split('T')[0];
  
  minCheckoutDate = computed(() => {
    const checkIn = this.checkInDateControl.value;
    if (checkIn) {
      const minDate = new Date(checkIn);
      minDate.setDate(minDate.getDate() + 1);
      return minDate.toISOString().split('T')[0];
    }
    return this.minDate;
  });

  nightsCount = computed(() => {
    const checkIn = this.checkInDateControl.value;
    const checkOut = this.checkOutDateControl.value;
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  });

  selectedRoomPrice = computed(() => {
    const roomType = this.roomTypeControl.value;
    const room = this.roomTypeOptions.find(r => r.value === roomType);
    return room?.price || 120;
  });

  estimatedTotal = computed(() => {
    const nights = this.nightsCount();
    const price = this.selectedRoomPrice();
    return nights * price;
  });

  isFormValid = computed(() => {
    return this.guestNameControl.valid &&
           this.guestCountControl.valid &&
           this.checkInDateControl.valid &&
           this.checkOutDateControl.valid &&
           this.roomTypeControl.valid &&
           !this.hasDateOrderError();
  });

  hasFormErrors = computed(() => {
    return this.guestNameControl.invalid ||
           this.guestCountControl.invalid ||
           this.checkInDateControl.invalid ||
           this.checkOutDateControl.invalid ||
           this.hasDateOrderError();
  });

  formSummary = computed(() => ({
    guestName: this.guestNameControl.value,
    guestCount: this.guestCountControl.value,
    checkInDate: this.checkInDateControl.value,
    checkOutDate: this.checkOutDateControl.value,
    roomType: this.roomTypeControl.value,
    specialRequests: this.specialRequestsControl.value
  }));

  constructor() {
    // Set up cross-field validation effects
    effect(() => {
      this.validateDateOrder();
    });

    // Set up form value change listeners for additional logic
    this.checkInDateControl.valueChanges.subscribe(() => {
      this.validateDateOrder();
    });

    this.checkOutDateControl.valueChanges.subscribe(() => {
      this.validateDateOrder();
    });
  }

  private hasDateOrderError(): boolean {
    const checkIn = this.checkInDateControl.value;
    const checkOut = this.checkOutDateControl.value;
    
    if (checkIn && checkOut) {
      return new Date(checkOut) <= new Date(checkIn);
    }
    return false;
  }

  private validateDateOrder(): void {
    if (this.hasDateOrderError()) {
      this.checkOutDateControl.setErrors({ ...this.checkOutDateControl.errors, dateOrder: true });
    } else {
      if (this.checkOutDateControl.errors?.['dateOrder']) {
        const errors = { ...this.checkOutDateControl.errors };
        delete errors['dateOrder'];
        this.checkOutDateControl.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    
    const formData = this.formSummary();
    const reservationRequest: ReservationRequest = {
      guestName: formData.guestName || '',
      guestCount: formData.guestCount || 1,
      checkInDate: formData.checkInDate || '',
      checkOutDate: formData.checkOutDate || '',
      roomType: formData.roomType || 'Standard',
      specialRequests: formData.specialRequests || ''
    };

    console.log('Submitting reservation:', reservationRequest);

    // Simulate API call
    setTimeout(() => {
      this.loading.set(false);
      this.snackBar.open('Reservation created successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.resetForm();
    }, 2000);
  }

  resetForm(): void {
    this.guestNameControl.reset();
    this.guestCountControl.reset();
    this.checkInDateControl.reset();
    this.checkOutDateControl.reset();
    this.roomTypeControl.setValue('Standard');
    this.specialRequestsControl.reset();
  }

  private markAllAsTouched(): void {
    this.guestNameControl.markAsTouched();
    this.guestCountControl.markAsTouched();
    this.checkInDateControl.markAsTouched();
    this.checkOutDateControl.markAsTouched();
    this.roomTypeControl.markAsTouched();
    this.specialRequestsControl.markAsTouched();
  }
}