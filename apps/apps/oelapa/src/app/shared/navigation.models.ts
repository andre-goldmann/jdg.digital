export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  roles?: string[];
  divider?: boolean;
  external?: boolean;
  expanded?: boolean;
}

export interface NavigationState {
  isExpanded: boolean;
  isMobile: boolean;
  activeRoute: string;
  menuItems: MenuItem[];
}

export enum NavigationMode {
  PUSH = 'push',
  OVER = 'over'
}

export interface NavigationConfig {
  mode: NavigationMode;
  hasBackdrop: boolean;
  disableClose: boolean;
}