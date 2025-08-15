import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import {
  withEntities,
  entityConfig,
  setAllEntities,
} from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { Workout } from './models/workout.model';

export interface WorkoutState {
  loading: boolean;
  error: string | null;
  caloriesBurned: number;
  dayStreak: number;
}

const initialState: WorkoutState = {
  loading: false,
  error: null,
  caloriesBurned: 450,
  dayStreak: 7,
};

const workoutEntityConfig = entityConfig({
  entity: type<Workout>(),
  collection: 'workouts',
  selectId: (workout: Workout) => workout.id,
});

const initialWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Morning Energy Boost',
    duration: '15 min',
    difficulty: 'Beginner',
    exercises: ['Jumping Jacks', 'Push-ups', 'Squats', 'Plank'],
    completed: false,
  },
  {
    id: '2',
    name: 'Core Strength',
    duration: '20 min',
    difficulty: 'Intermediate',
    exercises: ['Crunches', 'Russian Twists', 'Mountain Climbers', 'Dead Bug'],
    completed: true,
  },
  {
    id: '3',
    name: 'Full Body HIIT',
    duration: '30 min',
    difficulty: 'Advanced',
    exercises: ['Burpees', 'High Knees', 'Lunges', 'Pull-ups'],
    completed: false,
  },
];

export const WorkoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities(workoutEntityConfig),
  withComputed((state) => ({
    completedWorkouts: computed(
      () =>
        state.workoutsEntities().filter((workout) => workout.completed).length
    ),
    completionRate: computed(() => {
      const total = state.workoutsEntities().length;
      return total > 0
        ? Math.round((state.workoutsEntities().filter((workout) => workout.completed).length / total) * 100)
        : 0;
    }),
  })),
  withMethods((store) => ({
    loadWorkouts() {
      patchState(store, { loading: true, error: null });
      // Simulating API call with setTimeout
      setTimeout(() => {
        patchState(
          store,
          setAllEntities(initialWorkouts, workoutEntityConfig),
          { loading: false }
        );
      }, 300);
    },

    startWorkout(id: string) {
      // Here we would have logic to start a workout
      // This is a placeholder for future implementation
      console.log(`Starting workout ${id}`);
    },

    completeWorkout(id: string) {
      // Here we would have logic to complete a workout
      // This is a placeholder for future implementation
      console.log(`Completed workout ${id}`);
    },
  }))
);
