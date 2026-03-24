import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { ContextFilesComponent } from './pages/context-files/context-files.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:projectId', component: ProjectsComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'context', component: ContextFilesComponent },
  { path: '**', redirectTo: '' },
];
