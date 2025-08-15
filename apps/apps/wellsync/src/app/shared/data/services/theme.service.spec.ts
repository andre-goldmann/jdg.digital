import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let mockBody: jasmine.SpyObj<HTMLBodyElement>;
  let mockDocument: Document & {
    body: jasmine.SpyObj<HTMLBodyElement>;
  };

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', [
      'getItem',
      'setItem',
    ]);
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    // Mock document.body
    mockBody = jasmine.createSpyObj('HTMLBodyElement', ['classList']);
    mockBody.classList = jasmine.createSpyObj('DOMTokenList', [
      'add',
      'remove',
    ]);
    mockDocument = { body: mockBody } as any;

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: Document, useValue: mockDocument }],
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with localStorage value if available', () => {
    // Arrange
    localStorageSpy.getItem.and.returnValue('true');

    // Act
    const newService = TestBed.inject(ThemeService);

    // Assert
    expect(newService.darkMode()).toBe(true);
    expect(mockBody.classList.add).toHaveBeenCalledWith('dark-theme');
  });

  it('should toggle theme from light to dark', () => {
    // Arrange - start with light theme
    service.darkMode.set(false);

    // Act
    service.toggleTheme();

    // Assert
    expect(service.darkMode()).toBe(true);
    expect(mockBody.classList.add).toHaveBeenCalledWith('dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith('wellsync-theme', 'true');
  });

  it('should toggle theme from dark to light', () => {
    // Arrange - start with dark theme
    service.darkMode.set(true);

    // Act
    service.toggleTheme();

    // Assert
    expect(service.darkMode()).toBe(false);
    expect(mockBody.classList.remove).toHaveBeenCalledWith('dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'wellsync-theme',
      'false'
    );
  });
});
