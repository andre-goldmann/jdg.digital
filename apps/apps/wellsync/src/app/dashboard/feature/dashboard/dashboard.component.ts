import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { DashboardCardComponent } from '../../../shared/ui/dashboard-card/dashboard-card.component';
import { NavBarComponent } from '../../../shared/ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    DashboardCardComponent,
    NavBarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  welcomeStats = [
    { label: 'Daily Goals', value: '85%' },
    { label: 'Day Streak', value: '7' },
    { label: 'Minutes Today', value: '42' },
  ];

  getGradientClass(index: number): string {
    const classes = ['wellness', 'energy', 'mindful'];
    return classes[index % classes.length];
  }
}
