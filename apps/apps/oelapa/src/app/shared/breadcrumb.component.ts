import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from './material.module';
import { BreadcrumbService, BreadcrumbItem } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="breadcrumb-nav" role="navigation" aria-label="Breadcrumb navigation">
      @if ((breadcrumbService.breadcrumbs$ | async); as breadcrumbs) {
        <ol class="breadcrumb-list">
          @for (breadcrumb of breadcrumbs; track trackBreadcrumb($index, breadcrumb)) {
            <li class="breadcrumb-item" 
                [class.active]="breadcrumb.active"
                [attr.aria-current]="breadcrumb.active ? 'page' : null">
              
              @if (!breadcrumb.active && breadcrumb.url) {
                <!-- Clickable breadcrumb -->
                <button mat-button 
                        class="breadcrumb-button"
                        (click)="navigateTo(breadcrumb.url)"
                        [attr.aria-label]="'Navigate to ' + breadcrumb.label">
                  @if (breadcrumb.icon) {
                    <mat-icon class="breadcrumb-icon">{{ breadcrumb.icon }}</mat-icon>
                  }
                  <span class="breadcrumb-label">{{ breadcrumb.label }}</span>
                </button>
              } @else {
                <!-- Active/current breadcrumb -->
                <span class="breadcrumb-current">
                  @if (breadcrumb.icon) {
                    <mat-icon class="breadcrumb-icon">{{ breadcrumb.icon }}</mat-icon>
                  }
                  <span class="breadcrumb-label">{{ breadcrumb.label }}</span>
                </span>
              }
              
              @if (!breadcrumb.active) {
                <mat-icon class="breadcrumb-separator" aria-hidden="true">chevron_right</mat-icon>
              }
            </li>
          }
        </ol>
      }
    </nav>
  `,
  styles: [`
    .breadcrumb-nav {
      background-color: var(--mat-sys-surface-container-low);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-xs);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .breadcrumb-button {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      min-height: 36px;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius);
      color: var(--mat-sys-on-surface-variant);
      font-size: var(--text-sm);
      font-weight: 400;
      transition: all 200ms ease-in-out;

      &:hover {
        background-color: var(--mat-sys-surface-container);
        color: var(--mat-sys-on-surface);
      }

      &:focus {
        outline: 2px solid var(--mat-sys-primary);
        outline-offset: 2px;
      }
    }

    .breadcrumb-current {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      color: var(--mat-sys-on-surface);
      font-size: var(--text-sm);
      font-weight: 500;
    }

    .breadcrumb-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .breadcrumb-separator {
      color: var(--mat-sys-on-surface-variant);
      font-size: 16px;
      width: 16px;
      height: 16px;
      opacity: 0.6;
    }

    .breadcrumb-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .breadcrumb-nav {
        padding: var(--spacing-xs) var(--spacing-md);
      }

      .breadcrumb-list {
        gap: var(--spacing-xxs);
      }

      .breadcrumb-label {
        max-width: 120px;
      }

      .breadcrumb-button,
      .breadcrumb-current {
        padding: var(--spacing-xxs) var(--spacing-xs);
        font-size: var(--text-xs);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .breadcrumb-nav {
        border-bottom-width: 2px;
      }

      .breadcrumb-button:focus {
        outline-width: 3px;
      }
    }
  `]
})
export class BreadcrumbComponent {
  public breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  trackBreadcrumb(index: number, breadcrumb: BreadcrumbItem): string {
    return `${breadcrumb.url}-${breadcrumb.label}`;
  }
}