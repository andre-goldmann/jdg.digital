import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly iconName = input.required<string>();
  readonly buttonText = input.required<string>();
  readonly gradient = input.required<string>();
  readonly stats = input<{ label: string; value: string } | undefined>();
}
