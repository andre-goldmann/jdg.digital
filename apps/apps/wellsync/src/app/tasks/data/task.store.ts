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
  addEntity,
  updateEntity,
  removeEntity,
  setAllEntities,
} from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { Task } from './models/task.model';

// Define the state interface without entities (entities are handled by withEntities)
export interface TaskState {
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  loading: false,
  error: null,
};

// Entity configuration
export const taskEntityConfig = entityConfig({
  entity: type<Task>(),
  collection: 'tasks',
  selectId: (task: Task) => task.id,
});

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    text: 'Drink 8 glasses of water',
    completed: false,
    isHabit: true,
  },
  { id: '2', text: 'Complete morning workout', completed: true, isHabit: true },
  { id: '3', text: 'Finish project presentation', completed: false },
  { id: '4', text: 'Meditate for 10 minutes', completed: true, isHabit: true },
];

// Create the store
export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities(taskEntityConfig),
  withComputed((state) => ({
    completedCount: computed(
      () => state.tasksEntities().filter((task) => task.completed).length
    ),
    habitCount: computed(
      () =>
        state.tasksEntities().filter((task) => task.isHabit && task.completed)
          .length
    ),
    totalHabits: computed(
      () => state.tasksEntities().filter((task) => task.isHabit).length
    ),
    completionRate: computed(() => {
      const total = state.tasksEntities().length;
      return total > 0
        ? Math.round(
            (state.tasksEntities().filter((task) => task.completed).length /
              total) *
              100
          )
        : 0;
    }),
  })),
  withMethods((store) => ({
    loadTasks() {
      patchState(store, { loading: true, error: null });
      // Simulating API call with setTimeout
      setTimeout(() => {
        patchState(store, setAllEntities(initialTasks, taskEntityConfig), {
          loading: false,
        });
      }, 300);
    },

    addTask(text: string) {
      if (text.trim()) {
        const newTask: Task = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
        };

        patchState(store, addEntity(newTask, taskEntityConfig));
      }
    },

    toggleTask(id: string) {
      const task = store.tasksEntityMap()[id];
      if (task) {
        patchState(
          store,
          updateEntity(
            {
              id,
              changes: { completed: !task.completed },
            },
            taskEntityConfig
          )
        );
      }
    },

    deleteTask(id: string) {
      patchState(store, removeEntity(id, taskEntityConfig));
    },
  }))
);
