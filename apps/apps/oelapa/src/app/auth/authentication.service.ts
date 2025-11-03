import { inject, Injectable, signal, computed } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthState, UserProfile } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly oauthService = inject(OAuthService);

  // Signal-based state management
  private _authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Read-only signals for consumers
  public readonly authState = this._authState.asReadonly();

  // Computed signals for specific auth properties (prefixed to avoid conflicts)
  public readonly isLoading = computed(() => this._authState().loading);

  // Backward compatibility - provides Observable interface
  public authState$ = toObservable(this.authState);

  constructor() {
    this.setupEventHandling();
    this.initAuthState();
  }

  private initAuthState(): void {
    // Set initial loading state
    this._authState.set({
      isAuthenticated: false,
      user: null,
      loading: true,
      error: null
    });

    // Check authentication status after a short delay to allow OAuth service initialization
    setTimeout(() => {
      this.checkInitialAuthState();
    }, 500);
  }

  private checkInitialAuthState(): void {
    if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
      this.loadUserProfile();
    } else {
      this._authState.set({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }

  /**
   * Force a re-check of authentication state
   * Useful after OAuth callback processing
   */
  public recheckAuthState(): void {
    if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
      this.loadUserProfile();
    } else {
      this._authState.set({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }

  private setupEventHandling(): void {
    // Listen to OAuth events
    this.oauthService.events.subscribe(event => {
      switch (event.type) {
        case 'token_received':
          // Give a moment for the tokens to be properly stored
          setTimeout(() => {
            this.loadUserProfile();
          }, 100);
          break;
        case 'silently_refreshed':
          this.loadUserProfile();
          break;
        case 'token_error':
        case 'token_refresh_error':
          this._authState.set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Authentication failed'
          });
          break;
        case 'logout':
          this._authState.set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          });
          break;
        case 'session_terminated':
          this._authState.set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Session terminated'
          });
          break;
        case 'code_error':
          this._authState.set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Authorization failed'
          });
          break;
      }
    });
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const claims = this.oauthService.getIdentityClaims();

      if (claims) {
        const userProfile: UserProfile = {
          id: claims['sub'] || '',
          username: claims['preferred_username'] || claims['name'] || '',
          email: claims['email'] || '',
          firstName: claims['given_name'] || '',
          lastName: claims['family_name'] || '',
          roles: claims['realm_access']?.roles || []
        };

        this._authState.set({
          isAuthenticated: true,
          user: userProfile,
          loading: false,
          error: null
        });
      } else {
        this._authState.set({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'No user claims available'
        });
      }
    } catch {
      this._authState.set({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Failed to load user profile'
      });
    }
  }

  public login(): void {
    this._authState.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    try {
      if (!this.oauthService.discoveryDocumentLoaded) {
        this._authState.update(state => ({
          ...state,
          loading: false,
          error: 'OAuth service not properly configured'
        }));
        return;
      }

      this.oauthService.initCodeFlow();
    } catch (error) {
      this._authState.update(state => ({
        ...state,
        loading: false,
        error: 'Failed to initiate login: ' + (error as Error).message
      }));
    }
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
  }

  public getToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  public async refreshToken(): Promise<void> {
    try {
      await this.oauthService.refreshToken();
    } catch (error: unknown) {
      console.error('Token refresh failed:', error);
      throw new Error('Token refresh failed');
    }
  }

  public hasRole(role: string): boolean {
    const claims = this.oauthService.getIdentityClaims();
    const roles = claims?.['realm_access']?.roles || [];
    return roles.includes(role);
  }

}
