import { inject, Injectable } from '@angular/core';
import {
  VoiceCommandService,
  VoiceCommandResult,
} from './voice-command.service';
import { TaskStore } from '../../tasks/data/task.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TaskVoiceService {
  private voiceCommandService = inject(VoiceCommandService);
  private taskStore = inject(TaskStore);
  private snackBar = inject(MatSnackBar);

  constructor() {
    // Listen to voice commands and handle task-related ones
    this.voiceCommandService.commandExecuted$
      .pipe(takeUntilDestroyed())
      .subscribe((result) => this.handleVoiceCommand(result));
  }

  private handleVoiceCommand(result: VoiceCommandResult): void {
    const { command, extractedText } = result;

    switch (command.action) {
      case 'add-task':
        this.handleAddTask(extractedText);
        break;
      case 'complete-task':
        this.handleCompleteTask(extractedText);
        break;
      case 'delete-task':
        this.handleDeleteTask(extractedText);
        break;
    }
  }

  private handleAddTask(taskText?: string): void {
    if (!taskText || taskText.trim().length === 0) {
      const errorMessage =
        'Please specify what task to add. Try saying "add task buy groceries"';
      this.voiceCommandService.speak('Please specify what task to add');
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    this.taskStore.addTask(taskText);
    const successMessage = `Task "${taskText}" was created`;
    this.voiceCommandService.speak(successMessage);
    this.snackBar.open(`Task added: "${taskText}"`, 'Dismiss', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  private handleCompleteTask(taskText?: string): void {
    if (!taskText || taskText.trim().length === 0) {
      const errorMessage =
        'Please specify which task to complete. Try saying "complete task workout"';
      this.voiceCommandService.speak('Please specify which task to complete');
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    // Find task by partial text match
    const tasks = this.taskStore.tasksEntities();
    const matchingTask = tasks.find(
      (task) =>
        task.text.toLowerCase().includes(taskText.toLowerCase()) &&
        !task.completed
    );

    if (matchingTask) {
      this.taskStore.toggleTask(matchingTask.id);
      const successMessage = `Task "${matchingTask.text}" was completed`;
      this.voiceCommandService.speak(successMessage);
      this.snackBar.open(`Task completed: "${matchingTask.text}"`, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    } else {
      const errorMessage = `No incomplete task found matching "${taskText}"`;
      this.voiceCommandService.speak(`No task found matching ${taskText}`);
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  private handleDeleteTask(taskText?: string): void {
    if (!taskText || taskText.trim().length === 0) {
      const errorMessage =
        'Please specify which task to delete. Try saying "delete task workout"';
      this.voiceCommandService.speak('Please specify which task to delete');
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    // Find task by partial text match
    const tasks = this.taskStore.tasksEntities();
    const matchingTask = tasks.find((task) =>
      task.text.toLowerCase().includes(taskText.toLowerCase())
    );

    if (matchingTask) {
      this.taskStore.deleteTask(matchingTask.id);
      const successMessage = `Task "${matchingTask.text}" was deleted`;
      this.voiceCommandService.speak(successMessage);
      this.snackBar.open(`Task deleted: "${matchingTask.text}"`, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    } else {
      const errorMessage = `No task found matching "${taskText}"`;
      this.voiceCommandService.speak(errorMessage);
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
  }
}
