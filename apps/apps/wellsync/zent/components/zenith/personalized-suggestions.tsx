'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getPersonalizedRecommendations } from '@/app/actions';
import type { PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';

const formSchema = z.object({
  taskHistory: z.string().min(10, 'Please describe your task history in at least 10 characters.'),
  fitnessHistory: z.string().min(10, 'Please describe your fitness history in at least 10 characters.'),
  meditationHistory: z.string().min(10, 'Please describe your meditation history in at least 10 characters.'),
  goals: z.string().min(10, 'Please describe your wellness goals in at least 10 characters.'),
});

export default function PersonalizedSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskHistory: '',
      fitnessHistory: '',
      meditationHistory: '',
      goals: '',
    },
  });

  async function onSubmit(data: PersonalizedRecommendationsInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const recommendations = await getPersonalizedRecommendations(data);
      setResult(recommendations);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Personalized Suggestions
        </CardTitle>
        <CardDescription>Get AI-powered recommendations tailored to your goals and history.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="taskHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Productivity History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I use to-do lists daily but struggle with large projects." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fitnessHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I walk 3 times a week and occasionally do yoga." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meditationHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meditation History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I'm new to meditation, tried a few apps." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wellness Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I want to build a consistent workout routine and reduce stress." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                 <Wand2 className="mr-2 h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
            {result && (
              <div className="mt-4 space-y-4 rounded-lg border bg-secondary/50 p-4 text-sm">
                <h4 className="font-bold">Your Recommendations:</h4>
                <div className="space-y-2">
                  <p><strong>Workout:</strong> {result.workoutRecommendation}</p>
                  <p><strong>Meditation:</strong> {result.meditationRecommendation}</p>
                  <p><strong>Productivity:</strong> {result.productivityTaskRecommendation}</p>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
