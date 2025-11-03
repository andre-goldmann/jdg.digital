import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservations/new',
    loadComponent: () => import('./reservations/new-reservation.component').then(m => m.NewReservationComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservations/new-signals',
    loadComponent: () => import('./reservations/new-reservation-signals.component').then(m => m.NewReservationSignalsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'examples/invoice-stores',
    loadComponent: () => import('./examples/invoice-store-example.component').then(m => m.InvoiceStoreExampleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./auth/auth-callback.component').then(m => m.AuthCallbackComponent)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'  // Changed from /login to /dashboard to let auth guard handle it
  }
];
