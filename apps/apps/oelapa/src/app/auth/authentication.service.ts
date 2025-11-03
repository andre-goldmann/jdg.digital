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
  public readonly currentUser = computed(() => this._authState().user);
  public readonly isLoading = computed(() => this._authState().loading);
  public readonly authError = computed(() => this._authState().error);

  // Backward compatibility - provides Observable interface
  public authState$ = toObservable(this.authState);

  constructor() {
    this.initAuthState();
    this.setupEventHandling();
  }

  private initAuthState(): void {
    // Check if user is already authenticated
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
          this.loadUserProfile();
          break;
        case 'token_error':
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
      }
    } catch (error: unknown) {
      console.error('Failed to load user profile:', error);
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

    this.oauthService.initCodeFlow();
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
