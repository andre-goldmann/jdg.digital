export interface MeditationSession {
  id: string;
  name: string;
  duration: string;
  type: string;
  description: string;
  completed: boolean;
  progress: number;
}
