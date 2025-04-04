import { Route } from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';
import { MarioComponent } from './mario/mario.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'examples', component: ExamplesComponent },
  { path: 'mario', component: MarioComponent },
];
