
'use server';

/**
 * @fileOverview Processes natural language commands to control the application.
 *
 * - understandCommand - A function that interprets a user's spoken command.
 * - UnderstandCommandInput - The input type for the understandCommand function.
 * - UnderstandCommandOutput - The return type for the understandCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandCommandInputSchema = z.object({
  command: z.string().describe('The natural language command from the user.'),
});
export type UnderstandCommandInput = z.infer<typeof UnderstandCommandInputSchema>;

const UnderstandCommandOutputSchema = z.object({
  intent: z.enum(['navigate', 'addTask', 'completeTask', 'unknown']).describe('The user\'s primary intent.'),
  target: z.enum(['tasks', 'fitness', 'meditation']).optional().describe('The navigation target tab, if applicable.'),
  task: z.string().optional().describe('The content of the task, if applicable.'),
});
export type UnderstandCommandOutput = z.infer<typeof UnderstandCommandOutputSchema>;

export async function understandCommand(input: UnderstandCommandInput): Promise<UnderstandCommandOutput> {
  return understandCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'understandCommandPrompt',
  input: {schema: UnderstandCommandInputSchema},
  output: {schema: UnderstandCommandOutputSchema},
  prompt: `You are a command interpreter for a wellness app called Zenith. Your job is to understand the user's command and translate it into a structured format.

  The app has three main sections (tabs): 'tasks', 'fitness', and 'meditation'.

  Possible intents are:
  - 'navigate': To switch between the main tabs.
  - 'addTask': To add a new to-do item to the task list.
  - 'completeTask': To mark an existing task as complete.
  - 'unknown': If the command is unclear or doesn't fit other intents.

  Analyze the user's command and determine the intent.

  - If the intent is 'navigate', identify the target tab ('tasks', 'fitness', or 'meditation').
  - If the intent is 'addTask', extract the full text of the task. For example, if the command is "add a new task to buy groceries", the task is "buy groceries".
  - If the intent is 'completeTask', extract the key phrase of the task to be marked as complete. For example, if the command is "mark the groceries task as done", the task is "groceries".

  Here are some examples:
  - "Go to the fitness tab" -> { "intent": "navigate", "target": "fitness" }
  - "Show me my tasks" -> { "intent": "navigate", "target": "tasks" }
  - "I want to meditate" -> { "intent": "navigate", "target": "meditation" }
  - "Add a new task: schedule dentist appointment" -> { "intent": "addTask", "task": "schedule dentist appointment" }
  - "Create a to-do to call mom" -> { "intent": "addTask", "task": "call mom" }
  - "I need to water the plants" -> { "intent": "addTask", "task": "water the plants" }
  - "Mark 'call mom' as complete" -> { "intent": "completeTask", "task": "call mom" }
  - "I finished the logo design" -> { "intent": "completeTask", "task": "logo design" }

  User Command: "{{{command}}}"
  `,
});

const understandCommandFlow = ai.defineFlow(
  {
    name: 'understandCommandFlow',
    inputSchema: UnderstandCommandInputSchema,
    outputSchema: UnderstandCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
