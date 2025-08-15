import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { TaskStore } from '../../../tasks/data/task.store';
import { WorkoutStore } from '../../../workouts/data/workout.store';
import { MeditationStore } from '../../../meditation/data/meditation.store';
import { ThemeService } from '../../../shared/data/services/theme.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let taskStore: jasmine.SpyObj<TaskStore>;
  let workoutStore: jasmine.SpyObj<WorkoutStore>;
  let meditationStore: jasmine.SpyObj<MeditationStore>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    // Create spies for stores
    taskStore = jasmine.createSpyObj('TaskStore', ['loadTasks'], {
      completedCount: jasmine.createSpy('completedCount').and.returnValue(3),
      totalHabits: jasmine.createSpy('totalHabits').and.returnValue(5),
      habitCount: jasmine.createSpy('habitCount').and.returnValue(3),
    });

    workoutStore = jasmine.createSpyObj('WorkoutStore', ['loadWorkouts'], {
      workoutsEntities: jasmine.createSpy('workoutsEntities').and.returnValue([
        {
          id: '1',
          name: 'Morning Yoga',
          completed: true,
          duration: 20,
          type: 'yoga',
        },
        {
          id: '2',
          name: 'Evening Run',
          completed: false,
          duration: 30,
          type: 'cardio',
        },
      ]),
      completedCount: jasmine.createSpy('completedCount').and.returnValue(1),
      averageDuration: jasmine.createSpy('averageDuration').and.returnValue(25),
    });

    meditationStore = jasmine.createSpyObj(
      'MeditationStore',
      ['loadMeditationSessions'],
      {
        meditationSessionsEntities: jasmine
          .createSpy('meditationSessionsEntities')
          .and.returnValue([
            {
              id: '1',
              name: 'Morning Meditation',
              completed: true,
              duration: 10,
              type: 'mindfulness',
            },
          ]),
        totalMinutesMeditated: jasmine
          .createSpy('totalMinutesMeditated')
          .and.returnValue(10),
        completedCount: jasmine.createSpy('completedCount').and.returnValue(1),
      }
    );

    themeService = jasmine.createSpyObj('ThemeService', [], {
      darkMode: jasmine.createSpy('darkMode').and.returnValue(false),
    });

    await MockBuilder(DashboardComponent)
      .mock(TaskStore, taskStore)
      .mock(WorkoutStore, workoutStore)
      .mock(MeditationStore, meditationStore)
      .mock(ThemeService, themeService)
      .keep(RouterTestingModule.withRoutes([]));

    fixture = MockRender(DashboardComponent);
    component = ngMocks.findInstance(DashboardComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    // Assert
    expect(taskStore.loadTasks).toHaveBeenCalled();
    expect(workoutStore.loadWorkouts).toHaveBeenCalled();
    expect(meditationStore.loadMeditationSessions).toHaveBeenCalled();
  });

  it('should display habit completion statistics', () => {
    // Act
    fixture.detectChanges();

    // Assert - find the habits dashboard card
    const habitCard = fixture.debugElement.query(
      By.css('.dashboard-section:nth-child(1) .dashboard-card')
    );
    const habitCardText = habitCard.nativeElement.textContent;

    expect(habitCardText).toContain('3/5'); // 3 out of 5 habits completed
  });

  it('should display workout statistics', () => {
    // Act
    fixture.detectChanges();

    // Assert - find the workout dashboard card
    const workoutCard = fixture.debugElement.query(
      By.css('.dashboard-section:nth-child(2) .dashboard-card')
    );
    const workoutCardText = workoutCard.nativeElement.textContent;

    expect(workoutCardText).toContain('25'); // average duration
  });

  it('should display meditation statistics', () => {
    // Act
    fixture.detectChanges();

    // Assert - find the meditation dashboard card
    const meditationCard = fixture.debugElement.query(
      By.css('.dashboard-section:nth-child(3) .dashboard-card')
    );
    const meditationCardText = meditationCard.nativeElement.textContent;

    expect(meditationCardText).toContain('10'); // total minutes meditated
  });

  it('should have navigation links', () => {
    // Act
    fixture.detectChanges();

    // Assert - find all navigation links
    const links = fixture.debugElement.queryAll(By.css('.nav-links a'));

    expect(links.length).toBeGreaterThanOrEqual(3); // At least links to Tasks, Workouts, Meditation

    const linkTexts = links.map((link) =>
      link.nativeElement.textContent.trim()
    );
    expect(linkTexts).toContain(jasmine.stringMatching(/Tasks/i));
    expect(linkTexts).toContain(jasmine.stringMatching(/Workout/i));
    expect(linkTexts).toContain(jasmine.stringMatching(/Meditation/i));
  });
});
