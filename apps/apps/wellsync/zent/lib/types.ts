export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type FitnessChallenge = {
  id: string;
  title: string;
  description: string;
  duration: string;
  imageUrl: string;
  imageHint: string;
  workoutPlan: { day: number; activity: string }[];
};

export type Meditation = {
  id: string;
  title: string;
  duration: number;
  category: string;
  imageUrl: string;
  imageHint: string;
};
