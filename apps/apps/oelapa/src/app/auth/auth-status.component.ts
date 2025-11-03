import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthenticationService } from '../auth/authentication.service';
import { AuthState } from '../auth/auth.models';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-status.component.html',
  styleUrl: './auth-status.component.scss'
})
export class AuthStatusComponent {
  private authService = inject(AuthenticationService);

  authState$: Observable<AuthState> = this.authService.authState$;

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
