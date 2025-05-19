import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { YamlEditorComponent } from './yaml/yamleditor.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  //{ path: 'editor', component: YamlEditorComponent },
  {
    path: 'editor/:env/:service/:tenant',
    component: YamlEditorComponent
  },
  { path: '**', redirectTo: '' }
];

