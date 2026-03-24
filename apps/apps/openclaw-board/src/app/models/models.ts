export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  date: string;
  featureFile?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  docs: string;
  color: string;
  tasks: Task[];
  createdAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface Activity {
  id: string;
  timestamp: string;
  action: string;
  title: string;
  description: string;
  metadata: ActivityMetadata;
  status: string;
}

export interface ActivityMetadata {
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskCount?: number;
  newStatus?: string;
}

export interface ActivityResponse {
  activities: Activity[];
}

export interface AgentStatus {
  status: 'available' | 'busy';
  text: string;
}

export interface ContextFile {
  name: string;
  description: string;
  exists: boolean;
  size: number;
}

export interface ContextFilesResponse {
  files: ContextFile[];
}

export type KanbanColumn = {
  id: Task['status'];
  title: string;
  icon: string;
};
