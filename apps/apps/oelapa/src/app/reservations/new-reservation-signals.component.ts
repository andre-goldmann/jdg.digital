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
  templateUrl: './new-reservation-signals.component.html',
  styleUrl: './new-reservation-signals.component.scss'

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
