import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

export interface MeditationSession {
  id: string;
  name: string;
  description: string;
  duration: string;
  type: 'guided' | 'breathing' | 'body-scan' | 'quick';
  progress: number;
  completed: boolean;
}

@Component({
  selector: 'app-mobile-meditation-card',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  template: `
    <div class="mobile-session-card" [class.completed]="session().completed">
      <div class="session-header">
        <div class="session-title-row">
          <h3>{{ session().name }}</h3>
          <mat-chip [class]="getMeditationTypeClass(session().type)">
            {{ session().type }}
          </mat-chip>
        </div>
        <p class="session-description">{{ session().description }}</p>
      </div>

      <div class="session-meta">
        <span class="duration">
          <mat-icon>timer</mat-icon>
          {{ session().duration }}
        </span>
      </div>

      @if (session().progress > 0) {
      <div class="progress-container">
        <div class="progress-info">
          <span class="progress-label">Progress</span>
          <span class="progress-value">{{ session().progress }}%</span>
        </div>
        <mat-progress-bar
          mode="determinate"
          [value]="session().progress"
        ></mat-progress-bar>
      </div>
      }

      <div class="session-action">
        <button
          mat-raised-button
          [color]="session().completed ? 'accent' : 'primary'"
          [disabled]="session().completed"
          (click)="onSessionStart()"
          class="action-button"
        >
          <mat-icon>{{
            session().completed ? 'check' : 'play_arrow'
          }}</mat-icon>
          {{ session().completed ? 'Completed' : 'Begin Session' }}
        </button>
      </div>
    </div>
  `,
  styleUrl: './mobile-meditation-card.component.scss',
})
export class MobileMeditationCardComponent {
  session = input.required<MeditationSession>();
  sessionStart = output<string>();

  onSessionStart(): void {
    if (!this.session().completed) {
      this.sessionStart.emit(this.session().id);
    }
  }

  getMeditationTypeClass(type: string): string {
    return type.toLowerCase().replace('-', '');
  }
}
