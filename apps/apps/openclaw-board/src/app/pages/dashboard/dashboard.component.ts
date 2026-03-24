import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProjectService } from '../../services/project.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly activityService = inject(ActivityService);

  readonly projects = this.projectService.projects;
  readonly activities = signal<Activity[]>([]);

  readonly stats = computed(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    for (const project of this.projects()) {
      const tasks = project.tasks ?? [];
      totalTasks += tasks.length;
      completedTasks += tasks.filter((t) => t.status === 'done').length;
    }
    return { totalTasks, completedTasks };
  });

  ngOnInit(): void {
    this.activityService.getRecentActivities().subscribe((a) => this.activities.set(a));
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('de-DE');
  }
}
