import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { TuneComponent } from './tune/tune.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'tune', component: TuneComponent },
  { path: '**', redirectTo: '' }
];
