import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems: MenuItem[];
};

@Component({
  selector: 'app-menu-item',
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ],
  template: `
    <a
      mat-list-item
      class="menu-item"
      [routerLink]="item().route"
      (click)="nestedItemOpen.set(!nestedItemOpen())"
      routerLinkActive="selected-menu-item"
      #rla="routerLinkActive"
      [activated]="rla.isActive"
    >
      <mat-icon
        [fontSet]="rla.isActive ? 'material-icons' : 'chevron-right'"
        matListItemIcon
      >
        {{ item().icon }}
      </mat-icon>
    </a>
  `,
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent {
  item = input.required<MenuItem>();
  collapsed = input.required<boolean>();

  nestedItemOpen = signal(false);
}
