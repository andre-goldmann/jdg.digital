import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { KanbanBoardComponent } from '../../components/kanban-board/kanban-board.component';
import { Task } from '../../models/models';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, KanbanBoardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);

  readonly activeTab = signal<'board' | 'files' | 'context'>('board');

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const projectId = params['projectId'];
      if (projectId) {
        this.projectService.setActiveProject(projectId);
      }
    });
  }

  onTaskAdd(event: { columnId: string; title: string }): void {
    const projectId = this.projectService.activeProjectId();
    if (projectId) {
      this.projectService.addTask(projectId, event.title, event.columnId);
    }
  }

  onTaskUpdate(event: { taskId: string; updates: Partial<Task> }): void {
    this.projectService.updateTask(event.taskId, event.updates);
  }

  setActiveTab(tab: 'board' | 'files' | 'context'): void {
    this.activeTab.set(tab);
  }
}
