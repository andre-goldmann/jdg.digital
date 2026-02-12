import { Component, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
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
    MatSnackBarModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.scss'

})
export class NewReservationComponent {
  private readonly reservationService = inject(ReservationService);
  private readonly snackBar = inject(MatSnackBar);

  // Loading state
  loading = signal(false);

  // Form Controls with signals
  guestNameControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
  guestCountControl = new FormControl<number | null>(1, [Validators.required, Validators.min(1)]);
  checkInDateControl = new FormControl('', [Validators.required]);
  checkOutDateControl = new FormControl('', [Validators.required]);
  roomTypeControl = new FormControl('Standard', [Validators.required]);
  specialRequestsControl = new FormControl('');

  // FormGroup for e2e test compatibility
  reservationForm = new FormGroup({
    guestName: this.guestNameControl,
    guestCount: this.guestCountControl,
    checkInDate: this.checkInDateControl,
    checkOutDate: this.checkOutDateControl,
    roomType: this.roomTypeControl,
    specialRequests: this.specialRequestsControl
  });

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
    return this.reservationForm.valid && !this.hasDateOrderError();
  });

  hasFormErrors = computed(() => {
    return this.reservationForm.invalid || this.hasDateOrderError();
  });

  // Validation state signals for better UX
  isSubmitDisabled = computed(() => {
    return !this.isFormValid() || this.loading();
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

    // Enhanced form validation with real-time updates
    this.reservationForm.valueChanges.subscribe(() => {
      this.validateDateOrder();
    });
  }

  hasDateOrderError(): boolean {
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
      this.showValidationErrors();
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

    // Submit reservation

    // Use the actual reservation service
    this.reservationService.createReservationWithResource(reservationRequest);

    // Monitor the resource state for completion
    this.monitorReservationSubmission();
  }

  private showValidationErrors(): void {
    this.snackBar.open(
      'Please fix the form errors before submitting',
      'Close',
      { duration: 3000, panelClass: ['warning-snackbar'] }
    );
  }

  private monitorReservationSubmission(): void {
    const checkResourceState = () => {
      const resource = this.reservationService.reservationResource;

      if (resource.hasValue()) {
        const response = resource.value() as ReservationResponse | null;
        if (response?.reservationId) {
          this.loading.set(false);
          this.snackBar.open(
            `🎉 Reservation created successfully! ID: ${response.reservationId}`,
            'Close',
            { duration: 5000, panelClass: ['success-snackbar'] }
          );
          this.resetForm();
          this.reservationService.resetReservationResource();
        }
      } else if (resource.error()) {
        this.loading.set(false);
        const error = resource.error();
        this.snackBar.open(
          `❌ Failed to create reservation: ${error?.message || 'Unknown error'}`,
          'Close',
          { duration: 7000, panelClass: ['error-snackbar'] }
        );
        this.reservationService.resetReservationResource();
      }
    };

    // Check resource state with optimized polling
    const checkTimes = [100, 300, 700, 1500, 3000];
    checkTimes.forEach((delay) => {
      setTimeout(checkResourceState, delay);
    });
  }

  resetForm(): void {
    this.reservationForm.reset({
      guestName: '',
      guestCount: null,
      checkInDate: '',
      checkOutDate: '',
      roomType: 'Standard',
      specialRequests: ''
    });
  }

  private markAllAsTouched(): void {
    this.reservationForm.markAllAsTouched();
  }
}
