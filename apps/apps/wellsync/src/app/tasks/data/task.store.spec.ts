import { TestBed } from '@angular/core/testing';
import { unprotected } from '@ngrx/signals/testing';
import { setAllEntities } from '@ngrx/signals/entities';
import { patchState } from '@ngrx/signals';
import { TaskStore, taskEntityConfig } from './task.store';
import { Task } from './models/task.model';
import { fakeAsync, tick } from '@angular/core/testing';

describe('TaskStore', () => {
  let taskStore: ReturnType<typeof TaskStore>;

  // Mock tasks for testing
  const mockTasks: Task[] = [
    { id: '1', text: 'Test Task 1', completed: false, isHabit: true },
    { id: '2', text: 'Test Task 2', completed: true, isHabit: true },
    { id: '3', text: 'Test Task 3', completed: false },
    { id: '4', text: 'Test Task 4', completed: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskStore],
    });

    taskStore = TestBed.inject(TaskStore);

    // Start with a clean state for each test
    patchState(unprotected(taskStore), setAllEntities([], taskEntityConfig));
  });

  it('should be created', () => {
    expect(taskStore).toBeTruthy();
  });

  it('should have initial state with empty tasks', () => {
    expect(taskStore.tasksEntities().length).toBe(0);
    expect(taskStore.loading()).toBe(false);
    expect(taskStore.error()).toBeNull();
  });

  it('should load tasks', fakeAsync(() => {
    // Initial state
    expect(taskStore.tasksEntities().length).toBe(0);
    expect(taskStore.loading()).toBe(false);

    // Start loading tasks
    taskStore.loadTasks();

    // Should be in loading state
    expect(taskStore.loading()).toBe(true);

    // Wait for the simulated API call to complete
    tick(400);

    // Should have loaded initial tasks
    expect(taskStore.tasksEntities().length).toBeGreaterThan(0);
    expect(taskStore.loading()).toBe(false);
  }));

  it('should correctly calculate completedCount', () => {
    // Set mock tasks
    patchState(
      unprotected(taskStore),
      setAllEntities(mockTasks, taskEntityConfig)
    );

    // Should calculate 2 completed tasks
    expect(taskStore.completedCount()).toBe(2);
  });

  it('should correctly calculate habitCount', () => {
    // Set mock tasks
    patchState(
      unprotected(taskStore),
      setAllEntities(mockTasks, taskEntityConfig)
    );

    // Should calculate 1 completed habit
    expect(taskStore.habitCount()).toBe(1);
  });

  it('should correctly calculate totalHabits', () => {
    // Set mock tasks
    patchState(
      unprotected(taskStore),
      setAllEntities(mockTasks, taskEntityConfig)
    );

    // Should calculate 2 total habits
    expect(taskStore.totalHabits()).toBe(2);
  });

  it('should correctly calculate completionRate', () => {
    // Set mock tasks
    patchState(
      unprotected(taskStore),
      setAllEntities(mockTasks, taskEntityConfig)
    );

    // Should calculate 50% completion rate (2 of 4 tasks completed)
    expect(taskStore.completionRate()).toBe(50);
  });

  it('should add a new task', () => {
    const initialCount = taskStore.tasksEntities().length;

    taskStore.addTask('New Test Task');

    // Should increase task count by 1
    expect(taskStore.tasksEntities().length).toBe(initialCount + 1);
    // New task should be added with correct text and not be completed
    const newTask =
      taskStore.tasksEntities()[taskStore.tasksEntities().length - 1];
    expect(newTask.text).toBe('New Test Task');
    expect(newTask.completed).toBe(false);
  });

  it('should not add an empty task', () => {
    const initialCount = taskStore.tasksEntities().length;

    taskStore.addTask('');
    taskStore.addTask('   ');

    // Task count should remain the same
    expect(taskStore.tasksEntities().length).toBe(initialCount);
  });

  it('should toggle task completion status', () => {
    // Set mock tasks
    patchState(
      unprotected(taskStore),
      setAllEntities(mockTasks, taskEntityConfig)
    );

    // Toggle task with id '1' (initially not completed)
    taskStore.toggleTask('1');

    // The task should now be completed
    const toggledTask = taskStore.tasksEntityMap()['1'];
    expect(toggledTask.completed).toBe(true);
  });
});
