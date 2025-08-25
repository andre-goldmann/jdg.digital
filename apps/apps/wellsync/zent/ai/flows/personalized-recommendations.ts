'use server';

/**
 * @fileOverview Provides personalized recommendations for workouts, meditations, and productivity tasks based on user history and goals.
 *
 * - personalizedRecommendations - A function that generates personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the personalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the personalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  taskHistory: z.string().describe('A summary of the user\'s task management history.'),
  fitnessHistory: z.string().describe('A summary of the user\'s fitness history.'),
  meditationHistory: z.string().describe('A summary of the user\'s meditation history.'),
  goals: z.string().describe('The user\'s stated wellness goals.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  workoutRecommendation: z.string().describe('A personalized workout recommendation.'),
  meditationRecommendation: z.string().describe('A personalized meditation recommendation.'),
  productivityTaskRecommendation: z.string().describe('A personalized productivity task recommendation.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function personalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a wellness expert who provides personalized recommendations based on a user's history and goals.

  Analyze the following information to provide tailored recommendations for workouts, meditations, and productivity tasks.

  Task Management History: {{{taskHistory}}}
  Fitness History: {{{fitnessHistory}}}
  Meditation History: {{{meditationHistory}}}
  Wellness Goals: {{{goals}}}

  Provide a specific and actionable recommendation for each of the following:

  Workout Recommendation:
  Meditation Recommendation:
  Productivity Task Recommendation:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
