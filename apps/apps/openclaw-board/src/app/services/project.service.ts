import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project, ProjectsResponse, Task, AgentStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  readonly projects = signal<Project[]>([]);
  readonly activeProjectId = signal<string | null>(null);
  readonly loading = signal(true);

  readonly activeProject = computed(() => {
    const id = this.activeProjectId();
    return this.projects().find(p => p.id === id) ?? null;
  });

  fetchProjects(): void {
    this.http.get<ProjectsResponse>('/api/projects').subscribe({
      next: (data) => {
        this.projects.set(data.projects ?? []);
        const lastId = localStorage.getItem('lastProjectId');
        if (lastId && this.projects().some(p => p.id === lastId)) {
          this.activeProjectId.set(lastId);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setActiveProject(projectId: string): void {
    this.activeProjectId.set(projectId);
    localStorage.setItem('lastProjectId', projectId);
  }

  createProject(name: string, description: string): void {
    this.http
      .post<Project>('/api/projects', { name, description })
      .subscribe(() => this.fetchProjects());
  }

  addTask(projectId: string, title: string, status: string): void {
    this.http
      .post<Task>(`/api/projects/${encodeURIComponent(projectId)}/tasks`, {
        title,
        status,
        priority: 'medium',
      })
      .subscribe(() => this.fetchProjects());
  }

  updateTask(taskId: string, updates: Partial<Task>): void {
    this.http
      .put<Task>(`/api/tasks/${encodeURIComponent(taskId)}`, updates)
      .subscribe(() => this.fetchProjects());
  }

  fetchAgentStatus(callback: (status: AgentStatus) => void): void {
    this.http.get<AgentStatus>('/api/agent-status').subscribe({
      next: callback,
      error: () => callback({ status: 'available', text: 'Nicht verfugbar' }),
    });
  }
}
