import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from './authentication.service';
import { AuthState } from './auth.models';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let keycloakServiceSpy: jest.Mocked<KeycloakService>;

  beforeEach(() => {
    const spy = {
      isLoggedIn: jest.fn(),
      loadUserProfile: jest.fn(),
      getUserRoles: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      getToken: jest.fn(),
      updateToken: jest.fn(),
      isUserInRole: jest.fn()
    } as jest.Mocked<KeycloakService>;

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: KeycloakService, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    keycloakServiceSpy = TestBed.inject(KeycloakService) as jest.Mocked<KeycloakService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize auth state as loading', () => {
    service.authState$.subscribe((state: AuthState) => {
      expect(state.loading).toBe(true);
    });
  });

  it('should return authenticated status', () => {
    // Arrange
    keycloakServiceSpy.isLoggedIn.mockResolvedValue(true);
    
    // Act & Assert
    expect(service.isAuthenticated()).toBeDefined();
  });

  it('should get token from keycloak service', () => {
    // Arrange
    const mockToken = 'mock-jwt-token';
    keycloakServiceSpy.getToken.mockReturnValue(mockToken);
    
    // Act
    const token = service.getToken();
    
    // Assert
    expect(token).toBe(mockToken);
    expect(keycloakServiceSpy.getToken).toHaveBeenCalled();
  });

  it('should handle login', async () => {
    // Arrange
    keycloakServiceSpy.login.mockResolvedValue();
    
    // Act
    await service.login();
    
    // Assert
    expect(keycloakServiceSpy.login).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/auth/callback'
    });
  });

  it('should handle logout', async () => {
    // Arrange
    keycloakServiceSpy.logout.mockResolvedValue();
    
    // Act
    await service.logout();
    
    // Assert
    expect(keycloakServiceSpy.logout).toHaveBeenCalledWith(window.location.origin);
  });

  it('should refresh token', async () => {
    // Arrange
    const mockToken = 'refreshed-token';
    keycloakServiceSpy.updateToken.mockResolvedValue(true);
    keycloakServiceSpy.getToken.mockReturnValue(mockToken);
    
    // Act
    const token = await service.refreshToken();
    
    // Assert
    expect(token).toBe(mockToken);
    expect(keycloakServiceSpy.updateToken).toHaveBeenCalledWith(30);
  });

  it('should check user roles', () => {
    // Arrange
    const role = 'admin';
    keycloakServiceSpy.isUserInRole.mockReturnValue(true);
    
    // Act
    const hasRole = service.hasRole(role);
    
    // Assert
    expect(hasRole).toBe(true);
    expect(keycloakServiceSpy.isUserInRole).toHaveBeenCalledWith(role);
  });
});