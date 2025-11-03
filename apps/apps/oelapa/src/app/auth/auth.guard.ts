import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanActivateFn,
} from '@angular/router';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);

  // Check if this is an OAuth callback (has code or state parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const isOAuthCallback = urlParams.has('code') || urlParams.has('state');
  
  if (isOAuthCallback) {
    // Let the OAuth service handle the callback, allow navigation
    console.log('OAuth callback detected in guard, allowing navigation');
    return true;
  }

  // Check if user is authenticated
  const hasValidTokens = oauthService.hasValidAccessToken() && oauthService.hasValidIdToken();
  
  if (hasValidTokens) {
    // Check for required roles if specified in route data
    const requiredRole = route.data?.['role'];
    if (requiredRole) {
      const claims = oauthService.getIdentityClaims();
      const userRoles = claims?.['realm_access']?.roles || [];
      
      if (!userRoles.includes(requiredRole)) {
        return router.parseUrl('/forbidden');
      }
    }
    
    console.log('User is authenticated, allowing access');
    return true;
  }

  // User is not authenticated, start OAuth flow
  console.log('User not authenticated, starting OAuth flow');
  
  // Start the authentication flow
  oauthService.initCodeFlow(state.url);
  
  return false;
};
