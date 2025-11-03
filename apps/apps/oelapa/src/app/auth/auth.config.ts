import { AuthConfig } from 'angular-oauth2-oidc';
import { AuthenticationConfig } from '../core/configuration.service';

export function createAuthConfig(authConfig: AuthenticationConfig): AuthConfig {
  return {
    // Url of the Identity Provider (Keycloak)
    issuer: authConfig.issuer,

    // URL of the SPA to redirect the user to after login
    redirectUri: authConfig.redirectUri || window.location.origin + '/',

    // URL of the SPA to redirect the user to after silent refresh
    silentRefreshRedirectUri: authConfig.silentRefreshRedirectUri || window.location.origin + '/assets/silent-check-sso.html',

    // The SPA's id. The SPA is registered with this id at the auth-server
    clientId: authConfig.clientId,

    // Use the authorization code flow with PKCE
    responseType: 'code',

    // Enable PKCE (Proof Key for Code Exchange) for security
    oidc: true,
    
    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    scope: authConfig.scope || 'openid profile email offline_access',

    showDebugInformation: authConfig.showDebugInformation ?? true,

    // Enable silent refresh
    useSilentRefresh: authConfig.useSilentRefresh ?? true,

    // Timeout for silent refresh (in milliseconds)
    silentRefreshTimeout: authConfig.silentRefreshTimeout ?? 5000,

    // Clear hash fragment after login
    clearHashAfterLogin: authConfig.clearHashAfterLogin ?? true,

    // Skip issuer check (useful for development)
    skipIssuerCheck: authConfig.skipIssuerCheck ?? true,

    // Disable at_hash check (if needed for compatibility)
    disableAtHashCheck: authConfig.disableAtHashCheck ?? true,

    // Enable non-strict discovery document validation for development
    strictDiscoveryDocumentValidation: authConfig.strictDiscoveryDocumentValidation ?? false,
  };
}

// Fallback configuration for when server config is not available
export const fallbackAuthConfig: AuthConfig = {
  // Url of the Identity Provider (Keycloak)
  issuer: 'http://localhost:18080/realms/oelapa',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/',

  // URL of the SPA to redirect the user to after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/assets/silent-check-sso.html',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'oelapa-frontend',

  // Use the authorization code flow with PKCE
  responseType: 'code',

  // Enable PKCE (Proof Key for Code Exchange) for security
  oidc: true,
  
  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  scope: 'openid profile email offline_access',

  showDebugInformation: true,

  // Enable silent refresh
  useSilentRefresh: true,

  // Timeout for silent refresh (in milliseconds)
  silentRefreshTimeout: 5000,

  // Clear hash fragment after login
  clearHashAfterLogin: true,

  // Skip issuer check (useful for development)
  skipIssuerCheck: true,

  // Disable at_hash check (if needed for compatibility)
  disableAtHashCheck: true,

  // Enable non-strict discovery document validation for development
  strictDiscoveryDocumentValidation: false,
};
