import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskStore } from '../../data/task.store';
import { NavBarComponent } from '../../../shared/ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-task-section',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    NavBarComponent,
  ],
  templateUrl: './task-section.component.html',
  styleUrls: ['./task-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSectionComponent implements OnInit {
  newTask = '';
  readonly taskStore = inject(TaskStore);

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }

  addTask(): void {
    this.taskStore.addTask(this.newTask);
    this.newTask = '';
  }

  toggleTask(id: string): void {
    this.taskStore.toggleTask(id);
  }
}
