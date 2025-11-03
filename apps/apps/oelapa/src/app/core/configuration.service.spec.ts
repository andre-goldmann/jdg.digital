import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigurationService, FrontendConfiguration } from './configuration.service';
import { environment } from '../../environments/environment';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let httpMock: HttpTestingController;

  const mockValidConfiguration: FrontendConfiguration = {
    application: {
      name: 'Test App',
      environment: 'test',
      version: '1.0.0'
    },
    authentication: {
      issuer: 'https://auth.test.com',
      clientId: 'test-client',
      redirectUri: 'https://test.com/callback',
      scope: 'openid profile'
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
          icon: 'event',
          route: '/reservations'
        }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService]
    });
    service = TestBed.inject(ConfigurationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadConfiguration', () => {
    it('should load and validate configuration from API', (done) => {
      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config).toEqual(mockValidConfiguration);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(environment.configEndpoint);
      expect(req.request.method).toBe('GET');
      req.flush(mockValidConfiguration);
    });

    it('should retry on failure and eventually succeed', (done) => {
      let attemptCount = 0;
      
      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config).toEqual(mockValidConfiguration);
          expect(attemptCount).toBe(2); // Failed once, succeeded on retry
          done();
        },
        error: done.fail
      });

      // First request fails
      const req1 = httpMock.expectOne(environment.configEndpoint);
      req1.error(new ProgressEvent('Network error'));
      attemptCount++;

      // Second request succeeds
      const req2 = httpMock.expectOne(environment.configEndpoint);
      req2.flush(mockValidConfiguration);
      attemptCount++;
    });

    it('should return fallback configuration after max retries', (done) => {
      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config).toBeDefined();
          expect(config.application.name).toBe('Oelapa');
          expect(config.application.environment).toBe('fallback');
          done();
        },
        error: done.fail
      });

      // All requests fail
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(environment.configEndpoint);
        req.error(new ProgressEvent('Network error'));
      }
    });

    it('should handle invalid configuration data', (done) => {
      const invalidConfig = {
        application: { name: 'Test' }, // Missing environment
        authentication: {}, // Missing required fields
        navigation: {} // Missing menuItems
      };

      service.loadConfiguration().subscribe({
        next: (config) => {
          // Should return fallback configuration
          expect(config.application.environment).toBe('fallback');
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(environment.configEndpoint);
      req.flush(invalidConfig);
    });
  });

  describe('getCurrentConfiguration', () => {
    it('should return undefined initially', () => {
      expect(service.getCurrentConfiguration()).toBeUndefined();
    });

    it('should return configuration after loading', (done) => {
      service.loadConfiguration().subscribe({
        next: () => {
          const current = service.getCurrentConfiguration();
          expect(current).toEqual(mockValidConfiguration);
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne(environment.configEndpoint);
      req.flush(mockValidConfiguration);
    });
  });

  describe('configuration$ observable', () => {
    it('should emit configuration when loaded', (done) => {
      service.configuration$.subscribe({
        next: (config) => {
          if (config) {
            expect(config).toEqual(mockValidConfiguration);
            done();
          }
        },
        error: done.fail
      });

      service.loadConfiguration().subscribe();
      
      const req = httpMock.expectOne(environment.configEndpoint);
      req.flush(mockValidConfiguration);
    });
  });

  describe('validation', () => {
    it('should validate menu items correctly', () => {
      const validMenuItems = [
        { id: 'test1', label: 'Test 1', icon: 'test', route: '/test1' },
        { id: 'divider1', divider: true },
        { 
          id: 'test2', 
          label: 'Test 2', 
          icon: 'test', 
          children: [
            { id: 'child1', label: 'Child 1', icon: 'child', route: '/child1' }
          ]
        }
      ];

      const configWithMenuItems = {
        ...mockValidConfiguration,
        navigation: { menuItems: validMenuItems }
      };

      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config.navigation.menuItems).toHaveLength(3);
          expect(config.navigation.menuItems[1].divider).toBe(true);
          expect(config.navigation.menuItems[2].children).toHaveLength(1);
        }
      });

      const req = httpMock.expectOne(environment.configEndpoint);
      req.flush(configWithMenuItems);
    });

    it('should filter out invalid menu items', () => {
      const invalidMenuItems = [
        { id: 'valid', label: 'Valid', icon: 'test', route: '/valid' },
        { id: 'invalid1' }, // Missing label and icon
        { label: 'invalid2' }, // Missing id and icon
        { id: 'valid2', label: 'Valid 2', icon: 'test2', route: '/valid2' }
      ];

      const configWithInvalidItems = {
        ...mockValidConfiguration,
        navigation: { menuItems: invalidMenuItems }
      };

      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config.navigation.menuItems).toHaveLength(2);
          expect(config.navigation.menuItems[0].id).toBe('valid');
          expect(config.navigation.menuItems[1].id).toBe('valid2');
        }
      });

      const req = httpMock.expectOne(environment.configEndpoint);
      req.flush(configWithInvalidItems);
    });
  });

  describe('fallback configuration', () => {
    it('should provide a valid fallback configuration', () => {
      // Trigger fallback by making all requests fail
      service.loadConfiguration().subscribe({
        next: (config) => {
          expect(config.application.name).toBe('Oelapa');
          expect(config.application.environment).toBe('fallback');
          expect(config.authentication.issuer).toBeDefined();
          expect(config.authentication.clientId).toBeDefined();
          expect(config.navigation.menuItems).toBeDefined();
          expect(Array.isArray(config.navigation.menuItems)).toBe(true);
        }
      });

      // Make all retry attempts fail
      for (let i = 0; i < 3; i++) {
        const req = httpMock.expectOne(environment.configEndpoint);
        req.error(new ProgressEvent('Network error'));
      }
    });
  });
});