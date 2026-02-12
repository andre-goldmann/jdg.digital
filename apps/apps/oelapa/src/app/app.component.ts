import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { createAuthConfig } from './auth/auth.config';
import { MaterialModule } from './shared/material.module';
import { NavigationSidenavComponent } from './shared/navigation-sidemenu.component';
import { NavigationService } from './shared/navigation.service';
import { NavigationEnhancementService } from './shared/navigation-enhancement.service';
import { AuthStatusComponent } from './auth/auth-status.component';
import { BreadcrumbComponent } from './shared/breadcrumb.component';
import { AuthenticationService } from './auth/authentication.service';
import { ConfigurationService } from './core/configuration.service';
import { Observable } from 'rxjs';
import { NavigationConfig } from './shared/navigation.models';

@Component({
  imports: [CommonModule, RouterModule, MaterialModule, NavigationSidenavComponent, AuthStatusComponent, BreadcrumbComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected title = 'oelapa';

  private readonly oauthService = inject(OAuthService);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly navigationEnhancementService = inject(NavigationEnhancementService);
  private readonly configurationService = inject(ConfigurationService);
  private readonly authenticationService = inject(AuthenticationService);

  navigationConfig$: Observable<NavigationConfig> = this.navigationService.navigationConfig$;
  isExpanded$ = this.navigationService.isExpanded$;

  constructor() {
    // Constructor is empty - initialization happens in ngOnInit
  }

  ngOnInit(): void {
    // Initialize navigation enhancement service for consistent navigation experience
    this.navigationEnhancementService.setupNavigationTracking();
    this.configureAuth();
  }

  private configureAuth(): void {
    // Get current configuration or fallback
    const config = this.configurationService.getCurrentConfiguration();
    if(!config || !config.authentication) {
      throw new Error('Config can not be null!');
    }
    const authConfig = createAuthConfig(config.authentication);

    // Configure OAuth service
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Check for OAuth callback BEFORE loading discovery document
    const urlParams = new URLSearchParams(window.location.search);
    const hasCode = urlParams.has('code');
    const hasState = urlParams.has('state');
    const hasError = urlParams.has('error');

    if (hasError) {
      this.authenticationService.recheckAuthState();
      return;
    }

    // Store callback parameters before they get lost
    const callbackData = hasCode || hasState ? {
      code: urlParams.get('code'),
      state: urlParams.get('state'),
      sessionState: urlParams.get('session_state'),
      iss: urlParams.get('iss')
    } : null;

    // Load discovery document and try to login
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (callbackData) {
        // Try manual processing if automatic didn't work
        setTimeout(async () => {
          if (!this.oauthService.hasValidAccessToken() || !this.oauthService.hasValidIdToken()) {
            try {
              // Create a new URL with the stored callback parameters
              const originalUrl = window.location.href;
              const callbackUrl = `${window.location.origin}/?code=${callbackData.code}&state=${callbackData.state}&session_state=${callbackData.sessionState}&iss=${encodeURIComponent(callbackData.iss || '')}`;

              // Temporarily restore callback URL for token exchange
              window.history.replaceState(null, '', callbackUrl);

              await this.oauthService.tryLoginCodeFlow();

              if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
                this.authenticationService.recheckAuthState();
                window.history.replaceState({}, document.title, window.location.pathname);
                this.router.navigate(['/dashboard']);
              } else {
                // Restore original URL if token exchange failed
                window.history.replaceState(null, '', originalUrl);
              }
            } catch (error) {
              console.error('Token exchange error:', error);
              this.authenticationService.recheckAuthState();
            }
          } else {
            this.authenticationService.recheckAuthState();
            window.history.replaceState({}, document.title, window.location.pathname);
            this.router.navigate(['/dashboard']);
          }
        }, 2000);
      } else {
        // Not an OAuth callback, check existing authentication
        setTimeout(() => {
          this.authenticationService.recheckAuthState();
        }, 500);
      }
    }).catch(error => {
      console.error('OAuth configuration error:', error);
      this.authenticationService.recheckAuthState();
    });
  }

  toggleSidenav(): void {
    this.navigationService.toggleSidenav();
  }

}
