// Mobile breakpoint utilities for WellSync app
// These breakpoints follow Material Design guidelines

export const MOBILE_BREAKPOINTS = {
  xs: '(max-width: 599px)', // Extra small devices (phones)
  sm: '(min-width: 600px)', // Small devices (large phones)
  md: '(min-width: 960px)', // Medium devices (tablets)
  lg: '(min-width: 1280px)', // Large devices (desktops)
  xl: '(min-width: 1920px)', // Extra large devices
} as const;

export const TOUCH_BREAKPOINTS = {
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
} as const;

// Helper function to check if device is mobile
export function isMobileDevice(): boolean {
  return window.matchMedia(MOBILE_BREAKPOINTS.xs).matches;
}

// Helper function to check if device supports touch
export function isTouchDevice(): boolean {
  return window.matchMedia(TOUCH_BREAKPOINTS.touch).matches;
}

// Get current breakpoint
export function getCurrentBreakpoint(): string {
  if (window.matchMedia(MOBILE_BREAKPOINTS.xs).matches) return 'xs';
  if (window.matchMedia(MOBILE_BREAKPOINTS.sm).matches) return 'sm';
  if (window.matchMedia(MOBILE_BREAKPOINTS.md).matches) return 'md';
  if (window.matchMedia(MOBILE_BREAKPOINTS.lg).matches) return 'lg';
  return 'xl';
}
