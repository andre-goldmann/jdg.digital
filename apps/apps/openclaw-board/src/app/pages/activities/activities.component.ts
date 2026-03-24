import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/models';

@Component({
  selector: 'app-activities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
})
export class ActivitiesComponent implements OnInit {
  private readonly activityService = inject(ActivityService);

  readonly activities = signal<Activity[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.activityService.getActivities().subscribe((a) => {
      this.activities.set(a);
      this.loading.set(false);
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Gestern, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleString('de-DE');
  }
}
