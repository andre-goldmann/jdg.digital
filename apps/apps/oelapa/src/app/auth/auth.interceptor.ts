import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);

  // Skip adding token for external URLs or authentication endpoints
  const skipInterception = req.url.includes('keycloak') ||
                          req.url.includes('auth') ||
                          req.url.includes('.well-known') ||
                          !req.url.startsWith('/api');

  if (skipInterception) {
    return next(req);
  }

  // Get the auth token from the service
  const token = oauthService.getAccessToken();

  let authReq = req;
  if (token) {
    // Clone the request and add the authorization header
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized access token');
        // Token might be expired, try to refresh
        //if (oauthService.hasValidRefreshToken()) {
        if(oauthService.hasValidIdToken()){
          oauthService.refreshToken().then(() => {
            // Token refreshed, but we don't retry the request automatically
            // The user might need to retry their action
          }).catch(() => {
            // Refresh failed, redirect to login
            oauthService.initCodeFlow();
          });
        } else {
          // No refresh token, redirect to login
          oauthService.initCodeFlow();
        }
      }
      return throwError(() => error);
    })
  );
};
