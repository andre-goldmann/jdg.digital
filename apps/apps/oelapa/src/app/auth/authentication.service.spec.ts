import { TestBed } from '@angular/core/testing';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { AuthenticationService } from './authentication.service';
import { AuthState } from './auth.models';
import { Subject } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let oauthServiceSpy: Partial<OAuthService> & {
    hasValidAccessToken: jest.Mock;
    hasValidIdToken: jest.Mock;
    getIdentityClaims: jest.Mock;
    initCodeFlow: jest.Mock;
    logOut: jest.Mock;
    getAccessToken: jest.Mock;
    refreshToken: jest.Mock;
    events: Subject<OAuthEvent>;
  };
  let eventsSubject: Subject<OAuthEvent>;

  beforeEach(() => {
    eventsSubject = new Subject<OAuthEvent>();

    oauthServiceSpy = {
      hasValidAccessToken: jest.fn(),
      hasValidIdToken: jest.fn(),
      getIdentityClaims: jest.fn(),
      initCodeFlow: jest.fn(),
      logOut: jest.fn(),
      getAccessToken: jest.fn(),
      refreshToken: jest.fn(),
      events: eventsSubject
    };

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: OAuthService, useValue: oauthServiceSpy }
      ]
    });

    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize auth state as loading', () => {
    service.authState$.subscribe((state: AuthState) => {
      expect(state.loading).toBe(true);
    });
  });

  it('should return authenticated status when tokens are valid', () => {
    // Arrange
    oauthServiceSpy.hasValidAccessToken.mockReturnValue(true);
    oauthServiceSpy.hasValidIdToken.mockReturnValue(true);

    // Act
    const isAuthenticated = service.isAuthenticated();

    // Assert
    expect(isAuthenticated).toBe(true);
    expect(oauthServiceSpy.hasValidAccessToken).toHaveBeenCalled();
    expect(oauthServiceSpy.hasValidIdToken).toHaveBeenCalled();
  });

  it('should return false when tokens are invalid', () => {
    // Arrange
    oauthServiceSpy.hasValidAccessToken.mockReturnValue(false);
    oauthServiceSpy.hasValidIdToken.mockReturnValue(false);

    // Act
    const isAuthenticated = service.isAuthenticated();

    // Assert
    expect(isAuthenticated).toBe(false);
  });

  it('should get token from oauth service', () => {
    // Arrange
    const mockToken = 'mock-jwt-token';
    oauthServiceSpy.getAccessToken.mockReturnValue(mockToken);

    // Act
    const token = service.getToken();

    // Assert
    expect(token).toBe(mockToken);
    expect(oauthServiceSpy.getAccessToken).toHaveBeenCalled();
  });

  it('should handle login by initiating code flow', () => {
    // Act
    service.login();

    // Assert
    expect(oauthServiceSpy.initCodeFlow).toHaveBeenCalled();
  });

  it('should handle logout', () => {
    // Act
    service.logout();

    // Assert
    expect(oauthServiceSpy.logOut).toHaveBeenCalled();
  });

  it('should refresh token', async () => {
    // Arrange
    oauthServiceSpy.refreshToken.mockResolvedValue({} as any);

    // Act
    await service.refreshToken();

    // Assert
    expect(oauthServiceSpy.refreshToken).toHaveBeenCalled();
  });

  it('should handle token refresh failure', async () => {
    // Arrange
    oauthServiceSpy.refreshToken.mockRejectedValue(new Error('Token refresh failed'));

    // Act & Assert
    await expect(service.refreshToken()).rejects.toThrow('Token refresh failed');
  });

  it('should check user roles from identity claims', () => {
    // Arrange
    const role = 'admin';
    const mockClaims = {
      realm_access: {
        roles: ['admin', 'user']
      }
    };
    oauthServiceSpy.getIdentityClaims.mockReturnValue(mockClaims);

    // Act
    const hasRole = service.hasRole(role);

    // Assert
    expect(hasRole).toBe(true);
    expect(oauthServiceSpy.getIdentityClaims).toHaveBeenCalled();
  });

  it('should return false for roles when no claims available', () => {
    // Arrange
    oauthServiceSpy.getIdentityClaims.mockReturnValue(undefined);

    // Act
    const hasRole = service.hasRole('admin');

    // Assert
    expect(hasRole).toBe(false);
  });

  it('should load user profile when token is received', () => {
    // Arrange
    const mockClaims = {
      sub: 'user123',
      preferred_username: 'testuser',
      email: 'test@example.com',
      given_name: 'Test',
      family_name: 'User',
      realm_access: {
        roles: ['user']
      }
    };
    oauthServiceSpy.getIdentityClaims.mockReturnValue(mockClaims);

    // Act
    eventsSubject.next({ type: 'token_received' } as OAuthEvent);

    // Assert
    service.authState$.subscribe(state => {
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual({
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['user']
      });
      expect(state.loading).toBe(false);
    });
  });

  it('should handle token error', () => {
    // Act
    eventsSubject.next({ type: 'token_error' } as OAuthEvent);

    // Assert
    service.authState$.subscribe(state => {
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Authentication failed');
    });
  });

  it('should handle logout event', () => {
    // Act
    eventsSubject.next({ type: 'logout' } as OAuthEvent);

    // Assert
    service.authState$.subscribe(state => {
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });
});
