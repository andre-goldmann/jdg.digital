import { APP_INITIALIZER, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from './configuration.service';

export function initializeConfiguration() {
  const configService = inject(ConfigurationService);
  return () => {
    return firstValueFrom(configService.loadConfiguration()).catch(error => {
      console.error('Failed to load configuration during app initialization:', error);
      // Continue with fallback configuration - don't block app startup
      return Promise.resolve();
    });
  };
}

export function provideConfigurationInitializer() {
  return {
    provide: APP_INITIALIZER,
    useFactory: initializeConfiguration,
    multi: true
  };
}