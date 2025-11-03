import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { appRoutes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { ConfigurationService } from './core/configuration.service';
import { provideConfigurationInitializer } from './core/configuration.initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOAuthClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    ConfigurationService,
    provideConfigurationInitializer()
  ],
};
