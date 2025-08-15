import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/feature/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/feature/task-section/task-section.component').then(
        (m) => m.TaskSectionComponent
      ),
  },
  {
    path: 'workouts',
    loadComponent: () =>
      import(
        './workouts/feature/workout-section/workout-section.component'
      ).then((m) => m.WorkoutSectionComponent),
  },
  {
    path: 'meditation',
    loadComponent: () =>
      import(
        './meditation/feature/meditation-section/meditation-section.component'
      ).then((m) => m.MeditationSectionComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
