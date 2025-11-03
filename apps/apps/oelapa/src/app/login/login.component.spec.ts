import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../auth/authentication.service';
import { MaterialModule } from '../shared/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jest.Mocked<AuthenticationService>;
  let snackBarSpy: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    const authSpy = {
      login: jest.fn()
    } as jest.Mocked<Partial<AuthenticationService>>;

    const routerSpyObj = {
      navigate: jest.fn()
    } as jest.Mocked<Partial<Router>>;

    const snackBarSpyObj = {
      open: jest.fn()
    } as jest.Mocked<Partial<MatSnackBar>>;

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthenticationService) as jest.Mocked<AuthenticationService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate required fields', () => {
    // Act
    component.loginForm.get('username')?.markAsTouched();
    component.loginForm.get('password')?.markAsTouched();

    // Assert
    expect(component.isFieldInvalid('username')).toBe(true);
    expect(component.isFieldInvalid('password')).toBe(true);
  });

  it('should validate password minimum length', () => {
    // Arrange
    component.loginForm.get('password')?.setValue('123');
    component.loginForm.get('password')?.markAsTouched();

    // Assert
    expect(component.isFieldInvalid('password')).toBe(true);
    expect(component.getErrorMessage('password')).toContain('must be at least 6 characters');
  });

  it('should call authentication service on valid form submission', async () => {
    // Arrange
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    authServiceSpy.login.mockResolvedValue();

    // Act
    await component.onLogin();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalled();
  });

  it('should not submit invalid form', async () => {
    // Arrange
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    // Act
    await component.onLogin();

    // Assert
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    // Arrange
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    authServiceSpy.login.mockRejectedValue(new Error('Login failed'));

    // Act
    await component.onLogin();

    // Assert
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Login failed. Please try again.',
      'Close',
      expect.objectContaining({
        duration: 5000,
        panelClass: ['error-snackbar']
      })
    );
    expect(component.loading).toBe(false);
  });
});