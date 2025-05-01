import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  //{ path: 'feature-flags', component: FeatureFlagsComponent },
  //{ path: 'config', component: ConfigManagementComponent },
  //{ path: 'environments', component: EnvironmentSelectorComponent },
  { path: '**', redirectTo: '' }
];
