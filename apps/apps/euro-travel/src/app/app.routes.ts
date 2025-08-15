import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { FirstVisitService } from './services/first-visit.service';
import { VisitGuard } from './services/visit.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const visited = localStorage.getItem('hasVisitedBefore');
        return visited ? '/home' : '/welcome';
      }
      return '/welcome'; // Fallback if localStorage is not available
    },
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/start/start.component').then((m) => m.StartComponent),
  },
  {
    path: 'welcome-page',
    loadComponent: () =>
      import('./welcome/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [VisitGuard],
  },
];
