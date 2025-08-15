import { Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly storageKey = 'wellsync-theme';
  private readonly darkThemeClass = 'dark-theme';

  // Signal to track the current theme
  darkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Initialize theme
    this.setTheme(this.darkMode());
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    this.setTheme(newValue);
    if (
      typeof window !== 'undefined' &&
      window !== undefined &&
      window.localStorage
    ) {
      localStorage.setItem(this.storageKey, JSON.stringify(newValue));
    }
  }

  /**
   * Apply the theme to the document body
   * @param isDark Whether to apply dark theme
   */
  private setTheme(isDark: boolean): void {
    if (isDark) {
      this.document.body.classList.add(this.darkThemeClass);
    } else {
      this.document.body.classList.remove(this.darkThemeClass);
    }
  }

  /**
   * Get the initial theme from localStorage or use system preference
   * @returns boolean indicating whether dark mode is enabled
   */
  private getInitialTheme(): boolean {
    // Check local storage
    if (
      typeof window !== 'undefined' &&
      window !== undefined &&
      window.localStorage
    ) {
      const storedTheme = localStorage.getItem(this.storageKey);
      if (storedTheme !== null) {
        return JSON.parse(storedTheme);
      }
      // Fall back to system preference
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  }
}
