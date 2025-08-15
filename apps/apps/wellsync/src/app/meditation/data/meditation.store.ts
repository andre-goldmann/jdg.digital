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
import { MeditationSession } from './models/meditation-session.model';

export interface MeditationState {
  loading: boolean;
  error: string | null;
  dayStreak: number;
}

const initialState: MeditationState = {
  loading: false,
  error: null,
  dayStreak: 21,
};

const meditationEntityConfig = entityConfig({
  entity: type<MeditationSession>(),
  collection: 'sessions',
  selectId: (session: MeditationSession) => session.id,
});

const initialSessions: MeditationSession[] = [
  {
    id: '1',
    name: 'Morning Mindfulness',
    duration: '10 min',
    type: 'Guided Meditation',
    description: 'Start your day with clarity and focus',
    completed: true,
    progress: 100,
  },
  {
    id: '2',
    name: 'Stress Relief',
    duration: '15 min',
    type: 'Breathing Exercise',
    description: 'Release tension and find inner calm',
    completed: false,
    progress: 0,
  },
  {
    id: '3',
    name: 'Sleep Preparation',
    duration: '20 min',
    type: 'Body Scan',
    description: 'Unwind and prepare for restful sleep',
    completed: false,
    progress: 0,
  },
  {
    id: '4',
    name: 'Focus Booster',
    duration: '5 min',
    type: 'Quick Session',
    description: 'Quick mental reset for productivity',
    completed: true,
    progress: 100,
  },
];

export const MeditationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities(meditationEntityConfig),
  withComputed((state) => ({
    completedSessions: computed(
      () =>
        state.sessionsEntities().filter((session) => session.completed).length
    ),
    totalMinutes: computed(() =>
      state
        .sessionsEntities()
        .filter((session) => session.completed)
        .reduce((acc, session) => acc + parseInt(session.duration), 0)
    ),
    completionRate: computed(() => {
      const total = state.sessionsEntities().length;
      return total > 0
        ? Math.round((state.sessionsEntities().filter((session) => session.completed).length / total) * 100)
        : 0;
    }),
  })),
  withMethods((store) => ({
    loadSessions() {
      patchState(store, { loading: true, error: null });
      // Simulating API call with setTimeout
      setTimeout(() => {
        patchState(
          store,
          setAllEntities(initialSessions, meditationEntityConfig),
          { loading: false }
        );
      }, 300);
    },

    beginSession(id: string) {
      // Here we would have logic to begin a meditation session
      // This is a placeholder for future implementation
      console.log(`Beginning meditation session ${id}`);
    },

    startReflection() {
      // Here we would have logic for the reflection feature
      // This is a placeholder for future implementation
      console.log('Starting daily reflection');
    },
  }))
);
