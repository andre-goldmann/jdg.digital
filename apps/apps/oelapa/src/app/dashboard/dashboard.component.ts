import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { AuthenticationService } from '../auth/authentication.service';
import { Observable } from 'rxjs';
import { AuthState } from '../auth/auth.models';
import { ReservationStatus } from '../reservations/reservation.models';

// Dashboard data interfaces
interface ReservationMetrics {
  arriving: number;
  checkedIn: number;
  waiting: number;
  checkedOut: number;
  total: number;
}

interface CashierEntry {
  guestName: string;
  amount: string;
  currency: string;
  date: string;
  time: string;
}

interface ReservationFilters {
  status?: ReservationStatus | string;
  dateFilter?: string;
  searchTerm?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthenticationService);
  private router = inject(Router);

  authState$: Observable<AuthState> = this.authService.authState$;

  // Dashboard data signals
  reservationMetrics = signal<ReservationMetrics>({
    arriving: 0,
    checkedIn: 0,
    waiting: 0,
    checkedOut: 2,
    total: 2
  });

  cashierEntries = signal<CashierEntry[]>([
    {
      guestName: 'Michael J.',
      amount: 'Cash counted',
      currency: 'EUR',
      date: '5/31/2027',
      time: '12:00 AM'
    }
  ]);

  currentDate = signal<string>('');

  ngOnInit(): void {
    // Set current date for dashboard display
    this.currentDate.set(new Date().toLocaleDateString());

    // In a real application, you would load this data from services
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual service calls
    // This simulates loading dashboard metrics

    // Example: Load reservation metrics
    // this.reservationService.getMetrics().subscribe(metrics => {
    //   this.reservationMetrics.set(metrics);
    // });

    // Example: Load cashier entries
    // this.cashierService.getTodaysEntries().subscribe(entries => {
    //   this.cashierEntries.set(entries);
    // });
  }

  // Navigation methods
  navigateToReservations(filters?: ReservationFilters): void {
    const authState = this.authService.authState();
    if (authState.isAuthenticated) {
      if (filters) {
        this.router.navigate(['/reservations'], { queryParams: filters });
      } else {
        this.router.navigate(['/reservations']);
      }
    } else {
      this.authService.login();
    }
  }

  navigateToNewReservation(): void {
    const authState = this.authService.authState();
    if (authState.isAuthenticated) {
      this.router.navigate(['/reservations/new']);
    } else {
      this.authService.login();
    }
  }

  // Dashboard-specific navigation methods with filters
  navigateToArrivingReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.CONFIRMED,
      dateFilter: 'today'
    });
  }

  navigateToCheckedInReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.CHECKED_IN
    });
  }

  navigateToWaitingReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.CHECKED_IN // Waiting guests are actually checked-in guests
    });
  }

  navigateToCheckedOutReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.CHECKED_OUT,
      dateFilter: 'today'
    });
  }

  // Additional quick action methods for common scenarios
  navigateToPendingReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.PENDING
    });
  }

  navigateToCancelledReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.CANCELLED
    });
  }

  navigateToNoShowReservations(): void {
    this.navigateToReservations({
      status: ReservationStatus.NO_SHOW
    });
  }

  navigateToTodaysReservations(): void {
    this.navigateToReservations({
      dateFilter: 'today'
    });
  }

  navigateToThisWeekReservations(): void {
    this.navigateToReservations({
      dateFilter: 'week'
    });
  }

  // Advanced filtering quick actions
  navigateToLargeGroupReservations(): void {
    this.router.navigate(['/reservations'], {
      queryParams: { minGuests: '4' }
    });
  }

  navigateToSuiteReservations(): void {
    this.router.navigate(['/reservations'], {
      queryParams: { search: 'suite' }
    });
  }

  navigateToSpecialRequestsReservations(): void {
    this.router.navigate(['/reservations'], {
      queryParams: { search: 'special' }
    });
  }

  // Report navigation methods (placeholder implementations)
  navigateToOccupancyReport(): void {
    // TODO: Navigate to occupancy report
    console.log('Navigate to Occupancy Report');
  }

  navigateToRevenueReport(): void {
    // Reuse existing method but with different context
    this.navigateToRevenues();
  }

  navigateToGuestReport(): void {
    // TODO: Navigate to guest report
    console.log('Navigate to Guest Report');
  }

  navigateToGMReport(): void {
    // TODO: Navigate to General Manager Report
    console.log('Navigate to GM Report');
  }

  navigateToRevenues(): void {
    // TODO: Navigate to Revenue Reports
    console.log('Navigate to Revenue Reports');
  }

  exportCashierPDF(): void {
    // TODO: Export cashier report as PDF
    console.log('Export Cashier Report PDF');
  }

  navigateToRoomRack(): void {
    // TODO: Navigate to Room Rack view
    console.log('Navigate to Room Rack');
  }

  navigateToHousekeeping(): void {
    // TODO: Navigate to Housekeeping
    console.log('Navigate to Housekeeping');
  }

  navigateToAccounting(): void {
    // TODO: Navigate to Accounting/Financial Reports
    console.log('Navigate to Accounting');
  }

  navigateToRatePlans(): void {
    // TODO: Navigate to Rate Plans
    console.log('Navigate to Rate Plans');
  }

  // Utility methods
  getTotalArrivals(): number {
    const metrics = this.reservationMetrics();
    return metrics.arriving + metrics.checkedIn;
  }

  getTotalDepartures(): number {
    const metrics = this.reservationMetrics();
    return metrics.waiting + metrics.checkedOut;
  }
}
