import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WorkoutStore } from '../../data/workout.store';
import { NavBarComponent } from '../../../shared/ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-workout-section',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    NavBarComponent,
  ],
  templateUrl: './workout-section.component.html',
  styleUrls: ['./workout-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutSectionComponent implements OnInit {
  readonly workoutStore = inject(WorkoutStore);

  ngOnInit(): void {
    this.workoutStore.loadWorkouts();
  }

  startWorkout(id: string): void {
    this.workoutStore.startWorkout(id);
  }

  completeWorkout(id: string): void {
    this.workoutStore.completeWorkout(id);
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'beginner';
      case 'intermediate':
        return 'intermediate';
      case 'advanced':
        return 'advanced';
      default:
        return '';
    }
  }
}
