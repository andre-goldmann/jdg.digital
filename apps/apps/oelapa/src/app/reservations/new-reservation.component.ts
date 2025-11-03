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
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.scss'
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
