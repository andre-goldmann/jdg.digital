import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { TuneComponent } from './tune/tune.component';
import { ChatComponent } from './chat/chat/chat.component';
import { AnalysisComponent } from './analysis/analysis.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'tune', component: TuneComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: '**', redirectTo: '' }
];
