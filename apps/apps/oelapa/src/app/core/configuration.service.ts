import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  roles?: string[];
  divider?: boolean;
  external?: boolean;
  expanded?: boolean;
}

export interface AuthenticationConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  silentRefreshRedirectUri?: string;
  responseType: string;
  scope: string;
  showDebugInformation?: boolean;
  useSilentRefresh?: boolean;
  silentRefreshTimeout?: number;
  clearHashAfterLogin?: boolean;
  skipIssuerCheck?: boolean;
  disableAtHashCheck?: boolean;
  strictDiscoveryDocumentValidation?: boolean;
}

export interface ApplicationConfig {
  name: string;
  version: string;
  environment: string;
}

export interface UIConfig {
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    warnColor?: string;
  };
  branding?: {
    logoUrl?: string;
    companyName?: string;
    applicationTitle?: string;
  };
  features?: {
    showAdvancedReservationForm?: boolean;
    enableSignalBasedExamples?: boolean;
    showDeveloperTools?: boolean;
  };
}

export interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface NavigationConfig {
  menuItems: MenuItem[];
}

export interface FrontendConfiguration {
  application: ApplicationConfig;
  authentication: AuthenticationConfig;
  navigation: NavigationConfig;
  ui?: UIConfig;
  api?: ApiConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly http = inject(HttpClient);
  private configurationSubject = new BehaviorSubject<FrontendConfiguration | null>(null);
  private configEndpoint = environment.configEndpoint || 'http://localhost:5678/webhook/api/frontendconfig';
  private readonly defaultTimeout = 10000; // 10 seconds
  private readonly maxRetries = 3;

  /**
   * Observable that emits the current configuration (including fallback)
   */
  public readonly configuration$ = this.configurationSubject.asObservable().pipe(
    map(config => config || this.getFallbackConfiguration())
  );

  /**
   * Load configuration from external API endpoint
   */
  loadConfiguration(): Observable<FrontendConfiguration> {
    const currentConfig = this.configurationSubject.value;
    if (currentConfig) {
      return of(currentConfig);
    }

    return this.http.get<FrontendConfiguration>(this.configEndpoint)
      .pipe(
        timeout(this.defaultTimeout),
        retry(this.maxRetries),
        map(config => this.validateAndProcessConfiguration(config)),
        map(config => {
          this.configurationSubject.next(config);
          return config;
        }),
        catchError(error => {
          console.error('Failed to load configuration from API:', error);
          const fallbackConfig = this.getFallbackConfiguration();
          this.configurationSubject.next(fallbackConfig);
          return of(fallbackConfig);
        })
      );
  }

  /**
   * Get current cached configuration
   */
  getConfiguration(): FrontendConfiguration | null {
    return this.configurationSubject.value;
  }

  /**
   * Get current configuration or load if not available
   */
  getCurrentConfiguration(): FrontendConfiguration | null {
    return this.configurationSubject.value;
  }

  /**
   * Refresh configuration by clearing cache and reloading
   */
  refreshConfiguration(): Observable<FrontendConfiguration> {
    this.configurationSubject.next(null);
    return this.loadConfiguration();
  }

  private validateAndProcessConfiguration(config: unknown): FrontendConfiguration {
    // Type guard for configuration object
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be an object');
    }

    const configObj = config as Record<string, unknown>;

    // Basic validation - ensure required fields exist
    if (!configObj['application'] || !configObj['authentication'] || !configObj['navigation']) {
      throw new Error('Configuration missing required sections: application, authentication, or navigation');
    }

    const app = configObj['application'] as Record<string, unknown>;
    if (!app['name'] || !app['environment']) {
      throw new Error('Application configuration missing required fields: name or environment');
    }

    const auth = configObj['authentication'] as Record<string, unknown>;
    if (!auth['issuer'] || !auth['clientId']) {
      throw new Error('Authentication configuration missing required fields: issuer or clientId');
    }

    const nav = configObj['navigation'] as Record<string, unknown>;
    if (!Array.isArray(nav['menuItems'])) {
      throw new Error('Navigation configuration must contain menuItems array');
    }

    // Process and validate menu items
    const validatedConfig = {
      ...configObj,
      navigation: {
        ...nav,
        menuItems: this.validateMenuItems(nav['menuItems'])
      }
    };

    return validatedConfig as unknown as FrontendConfiguration;
  }

  private validateMenuItems(items: unknown[]): MenuItem[] {
    return items.filter((item): item is MenuItem => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const menuItem = item as Record<string, unknown>;

      if (menuItem['divider']) {
        return true; // Dividers only need an id
      }

      if (!menuItem['id'] || !menuItem['label'] || !menuItem['icon']) {
        console.warn('Invalid menu item missing required fields:', item);
        return false;
      }

      // Recursively validate children
      if (menuItem['children'] && Array.isArray(menuItem['children'])) {
        const validatedItem = {
          ...menuItem,
          children: this.validateMenuItems(menuItem['children'])
        };
        Object.assign(menuItem, validatedItem);
      }

      return true;
    }) as MenuItem[];
  }

  private getFallbackConfiguration(): FrontendConfiguration {
    return {
      application: {
        name: 'OELAPA Property Management',
        version: '1.0.0',
        environment: 'development'
      },
      authentication: {
        issuer: 'http://localhost:18080/realms/oelapa',
        clientId: 'oelapa-frontend',
        redirectUri: window.location.origin + '/',
        silentRefreshRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        responseType: 'code',
        scope: 'openid profile email offline_access',
        showDebugInformation: true,
        useSilentRefresh: true,
        silentRefreshTimeout: 5000,
        clearHashAfterLogin: true,
        skipIssuerCheck: true,
        disableAtHashCheck: true,
        strictDiscoveryDocumentValidation: false
      },
      navigation: {
        menuItems: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
          },
          {
            id: 'reservations',
            label: 'Reservations',
            icon: 'hotel',
            children: [
              {
                id: 'new-booking',
                label: 'New Booking',
                icon: 'add_circle_outline',
                route: '/reservations/new'
              },
              {
                id: 'new-booking-signals',
                label: 'New Booking (Signals)',
                icon: 'add_circle',
                route: '/reservations/new-signals'
              },
              {
                id: 'manage-bookings',
                label: 'Manage Bookings',
                icon: 'list_alt',
                route: '/reservations'
              },
              {
                id: 'checkin-checkout',
                label: 'Check-in/out',
                icon: 'key',
                route: '/reservations/checkin'
              }
            ]
          },
          {
            id: 'examples',
            label: 'Examples',
            icon: 'code',
            children: [
              {
                id: 'invoice-stores',
                label: 'Invoice Store Comparison',
                icon: 'storage',
                route: '/examples/invoice-stores'
              }
            ]
          }
        ]
      }
    };
  }
}