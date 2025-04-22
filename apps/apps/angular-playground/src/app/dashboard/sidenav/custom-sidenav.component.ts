import { Component, computed, Input, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-custom-sidenav',
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
})
export class CustomSidenavComponent {
  sidenavCollapsed = signal(false);

  @Input() set collapsed(value: boolean) {
    this.sidenavCollapsed.set(value);
  };

  menuItems = signal<MenuItem[]>([
    {
      icon:'dashboard',
      label:'Dashboard',
      route: 'home'
    },
    {
      icon:'dashboard',
      label:'N8N',
      route: 'nachtn'
    },
    {
      icon:'receipt',
      label:'Examples',
      route: 'examples'
    },
    {
      icon:'sports_esports',
      label:'Mario',
      route: 'mario'
    },
    {
      icon:'shopping_bag_speed',
      label:'MobileApp',
      route: 'mobileapp'
    },
    {
      icon:'video_library',
      label:'Content',
      route: 'content'
    },
    {
      icon:'analytics',
      label:'Analytics',
      route: 'analytics'
    },
    {
      icon:'comments',
      label:'Comments',
      route: 'comments'
    }
  ]);

  profilePicSize = computed(() => this.sidenavCollapsed() ? '32' : '100');

}
