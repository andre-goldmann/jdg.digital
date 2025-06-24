import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LucideAngularModule , Home, FileIcon, Circle, Pencil, BarChart3, Sliders, Filter, Settings } from 'lucide-angular';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    LucideAngularModule,
    RouterLinkActive,
    RouterLink
],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  //Docu: https://lucide.dev/guide/packages/lucide-angular
  protected readonly Home = Home;
  protected readonly FileIcon = FileIcon;
  protected readonly Circle = Circle;
  protected readonly Settings = Settings;
  protected readonly Pencil = Pencil;
}
