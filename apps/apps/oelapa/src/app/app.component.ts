import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoicesStore } from './invoices.store';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { createAuthConfig, fallbackAuthConfig } from './auth/auth.config';
import { MaterialModule } from './shared/material.module';
import { NavigationSidenavComponent } from './shared/navigation-sidemenu.component';
import { NavigationService } from './shared/navigation.service';
import { AuthStatusComponent } from './auth/auth-status.component';
import { ConfigurationService } from './core/configuration.service';
import { Observable } from 'rxjs';
import { NavigationConfig } from './shared/navigation.models';

@Component({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, NavigationSidenavComponent, AuthStatusComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected title = 'oelapa';
  store = inject(InvoicesStore);
  
  // Signal-based FormControls
  private readonly oauthService = inject(OAuthService);
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);
  private readonly configurationService = inject(ConfigurationService);

  // Signal-based form controls
  fromControl = new FormControl(this.store.from(), [Validators.required]);
  toControl = new FormControl(this.store.to(), [Validators.required]);

  // Computed signals for form state
  isFormValid = computed(() => this.fromControl.valid && this.toControl.valid);
  formData = computed(() => ({
    from: this.fromControl.value,
    to: this.toControl.value
  }));

  // Create form value signal for easier reactivity
  formValueSignal = signal({
    from: this.fromControl.value,
    to: this.toControl.value
  });

  navigationConfig$: Observable<NavigationConfig> = this.navigationService.navigationConfig$;
  isExpanded$ = this.navigationService.isExpanded$;

  constructor() {
    // Set up form control value change effects
    effect(() => {
      // Sync form values to signal when controls change
      this.formValueSignal.set({
        from: this.fromControl.value,
        to: this.toControl.value
      });
    });

    // Set up form control value change listeners
    this.fromControl.valueChanges.subscribe(value => {
      if (value && this.fromControl.valid) {
        this.store.setDateRange(value, this.toControl.value || new Date());
      }
    });

    this.toControl.valueChanges.subscribe(value => {
      if (value && this.toControl.valid) {
        this.store.setDateRange(this.fromControl.value || new Date(), value);
      }
    });
  }

  ngOnInit(): void {
    this.configureAuth();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const formValue = this.formData();
      if (formValue.from && formValue.to) {
        this.store.setDateRange(formValue.from, formValue.to);
        console.log('Form submitted with values:', formValue);
      }
    }
  }

  resetForm(): void {
    const defaultFrom = new Date(new Date().setDate(new Date().getDate() - 30));
    const defaultTo = new Date();
    
    this.fromControl.setValue(defaultFrom);
    this.toControl.setValue(defaultTo);
    this.store.setDateRange(defaultFrom, defaultTo);
  }

  private configureAuth(): void {
    // Get current configuration or fallback
    const config = this.configurationService.getCurrentConfiguration();
    const authConfig = config?.authentication ? createAuthConfig(config.authentication) : fallbackAuthConfig;
    
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Load discovery document and try to login
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      console.log('Discovery document loaded and login attempted');

      // Check if this is an OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const hasCode = urlParams.has('code');
      const hasState = urlParams.has('state');

      if (hasCode || hasState) {
        console.log('OAuth callback detected');
        // After processing OAuth callback, navigate to dashboard
        setTimeout(() => {
          if (this.oauthService.hasValidAccessToken()) {
            console.log('Authentication successful, navigating to dashboard');
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Authentication failed, staying on current page');
          }
        }, 100);
      }
    }).catch(error => {
      console.error('OAuth configuration error:', error);
    });
  }

  toggleSidenav(): void {
    this.navigationService.toggleSidenav();
  }

}
