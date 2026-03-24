import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { Project, Task, KanbanColumn } from '../../models/models';

@Component({
  selector: 'app-kanban-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent {
  readonly project = input.required<Project>();
  readonly taskAdd = output<{ columnId: string; title: string }>();
  readonly taskUpdate = output<{ taskId: string; updates: Partial<Task> }>();

  readonly columns: KanbanColumn[] = [
    { id: 'todo', title: 'Offen', icon: '📋' },
    { id: 'in-progress', title: 'In Arbeit', icon: '⚡' },
    { id: 'review', title: 'Review', icon: '👀' },
    { id: 'done', title: 'Erledigt', icon: '✅' },
  ];

  readonly newTaskInputs = signal<Record<string, string>>({});

  getColumnTasks(columnId: string): Task[] {
    return this.project().tasks?.filter((t) => t.status === columnId) ?? [];
  }

  onInputChange(columnId: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newTaskInputs.update((inputs) => ({ ...inputs, [columnId]: value }));
  }

  onInputKeydown(columnId: string, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTask(columnId);
    }
  }

  addTask(columnId: string): void {
    const title = this.newTaskInputs()[columnId]?.trim();
    if (!title) return;
    this.taskAdd.emit({ columnId, title });
    this.newTaskInputs.update((inputs) => ({ ...inputs, [columnId]: '' }));
  }

  onDrop(event: CdkDragDrop<string, string>): void {
    const task = event.item.data as Task;
    const targetColumnId = event.container.data as string;
    if (task.status !== targetColumnId) {
      this.taskUpdate.emit({
        taskId: task.id,
        updates: { status: targetColumnId as Task['status'] },
      });
    }
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }
}
