import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  registerIcons() {
    this.iconRegistry.addSvgIcon('app-logo', this.sanitizer.bypassSecurityTrustResourceUrl('assets/app_logo.svg'));
    this.iconRegistry.addSvgIcon('dashboard-icon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/dashboard_icon.svg'));
    this.iconRegistry.addSvgIcon('equalizer-icon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/equalizer_icon.svg'));
    this.iconRegistry.addSvgIcon('tune-icon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/tune_icon.svg'));
    this.iconRegistry.addSvgIcon('settings-icon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/settings_icon.svg'));
  }
}
