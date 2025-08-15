import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { NavBarComponent } from './nav-bar.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
  let fixture: ComponentFixture<NavBarComponent>;
  let component: NavBarComponent;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate'], { url: '/' });

    await MockBuilder(NavBarComponent).mock(Router, routerMock);

    fixture = MockRender(NavBarComponent);
    component = ngMocks.findInstance(NavBarComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('.nav-links a'));
    expect(links.length).toBe(4);

    const linkTexts = links.map((link) =>
      link.nativeElement.textContent.trim()
    );
    expect(linkTexts).toContain('Dashboard');
    expect(linkTexts).toContain('Tasks');
    expect(linkTexts).toContain('Workouts');
    expect(linkTexts).toContain('Meditation');
  });

  it('should return current route from router', () => {
    expect(component.currentRoute).toBe('/');

    Object.defineProperty(routerMock, 'url', { get: () => '/tasks' });
    expect(component.currentRoute).toBe('/tasks');
  });

  it('should check if route is active', () => {
    Object.defineProperty(routerMock, 'url', { get: () => '/tasks' });

    expect(component.isActive('/tasks')).toBe(true);
    expect(component.isActive('/')).toBe(false);
  });
});
