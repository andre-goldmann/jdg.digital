import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../data/services/theme.service';
import { By } from '@angular/platform-browser';

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let component: ThemeToggleComponent;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    // Create a spy for ThemeService
    themeService = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      // Mock the darkMode signal
      darkMode: jasmine.createSpy('darkMode').and.returnValue(false),
    });

    await MockBuilder(ThemeToggleComponent).mock(ThemeService, themeService);

    fixture = MockRender(ThemeToggleComponent);
    component = ngMocks.findInstance(ThemeToggleComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dark_mode icon when in light mode', () => {
    // Arrange
    themeService.darkMode.and.returnValue(false);

    // Act
    fixture.detectChanges();

    // Assert
    const icon = ngMocks.find(fixture, 'mat-icon').nativeElement;
    expect(icon.textContent.trim()).toBe('dark_mode');
  });

  it('should display light_mode icon when in dark mode', () => {
    // Arrange
    themeService.darkMode.and.returnValue(true);

    // Act
    fixture.detectChanges();

    // Assert
    const icon = ngMocks.find(fixture, 'mat-icon').nativeElement;
    expect(icon.textContent.trim()).toBe('light_mode');
  });

  it('should call toggleTheme when button is clicked', () => {
    // Arrange
    const button = fixture.debugElement.query(By.css('button'));

    // Act
    button.triggerEventHandler('click');

    // Assert
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should have correct tooltip text in light mode', () => {
    // Arrange
    themeService.darkMode.and.returnValue(false);

    // Act
    fixture.detectChanges();

    // Assert
    const button = fixture.debugElement.query(By.css('button'));
    const tooltipText = button.attributes['mattooltip'];
    expect(tooltipText).toBe('Switch to dark mode');
  });

  it('should have correct tooltip text in dark mode', () => {
    // Arrange
    themeService.darkMode.and.returnValue(true);

    // Act
    fixture.detectChanges();

    // Assert
    const button = fixture.debugElement.query(By.css('button'));
    const tooltipText = button.attributes['mattooltip'];
    expect(tooltipText).toBe('Switch to light mode');
  });
});
