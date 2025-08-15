import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FirstVisitService {
  // Signal to track if it's the first visit
  private readonly _isFirstVisit = signal<boolean>(true);

  // Inject PLATFORM_ID to check if we're running in browser
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.checkIfFirstVisit();
  }

  private checkIfFirstVisit(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Check localStorage for a flag indicating previous visits
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        console.log('hasVisitedBefore:', hasVisitedBefore);
        if (!hasVisitedBefore) {
          console.log('First visit detected');
          // If no flag exists, it's the first visit
          this._isFirstVisit.set(true);
        } else {
          // If the flag exists, it's not the first visit
          this._isFirstVisit.set(false);
        }
      } catch (error) {
        // In case localStorage is disabled or there's another issue
        console.warn('Unable to access localStorage:', error);
      }
    }
    // If not in browser, default to showing first visit experience
    // This ensures SSR works as expected
  }

  // Changed from asReadonly to a method that returns the value
  public isFirstVisit(): boolean {
    return this._isFirstVisit();
  }

  public markAsVisited(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.localStorage) {
      try {
        // Set the flag in localStorage
        localStorage.setItem('hasVisitedBefore', 'true');
      } catch (error) {
        console.warn('Unable to write to localStorage:', error);
      }
    }

    // Update the signal regardless
    this._isFirstVisit.set(false);
  }
}
