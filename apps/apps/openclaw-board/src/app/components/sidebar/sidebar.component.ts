import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  readonly currentUrl = signal(this.router.url);
  readonly projectsExpanded = signal(this.router.url.startsWith('/projects'));

  private routerSubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.currentUrl.set(event.urlAfterRedirects);
    }
  });

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  selectProject(projectId: string): void {
    this.projectService.setActiveProject(projectId);
    this.projectsExpanded.set(true);
  }

  toggleProjects(): void {
    this.projectsExpanded.update((expanded) => !expanded);
  }

  isActiveTab(path: string): boolean {
    const currentUrl = this.currentUrl();
    if (path === '/') {
      return currentUrl === '/';
    }
    return currentUrl.startsWith(path);
  }
}
