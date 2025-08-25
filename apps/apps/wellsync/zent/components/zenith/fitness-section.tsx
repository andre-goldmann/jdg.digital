'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import type { FitnessChallenge } from '@/lib/types';

const fitnessChallenges: FitnessChallenge[] = [
  {
    id: 'fc1',
    title: '30-Day Abs Challenge',
    description: 'Sculpt your core with this progressive 30-day ab workout plan.',
    duration: '30 days',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'fitness workout',
    workoutPlan: [
      { day: 1, activity: '20 Crunches, 10 Leg Raises, 30s Plank' },
      { day: 2, activity: '25 Crunches, 12 Leg Raises, 35s Plank' },
      { day: 3, activity: 'Rest Day' },
    ],
  },
  {
    id: 'fc2',
    title: 'Full Body Tone',
    description: 'A 4-week program to build strength and tone your entire body.',
    duration: '4 weeks',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'yoga stretching',
    workoutPlan: [
      { day: 1, activity: 'Full Body Strength A' },
      { day: 2, activity: 'Cardio & Core' },
      { day: 3, activity: 'Rest Day' },
    ],
  },
  {
    id: 'fc3',
    title: 'Yoga for Flexibility',
    description: 'Improve your flexibility and find your balance with this 14-day yoga series.',
    duration: '14 days',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'woman meditating',
    workoutPlan: [
        { day: 1, activity: 'Morning Flow' },
        { day: 2, activity: 'Hip Openers' },
        { day: 3, activity: 'Rest Day' },
    ]
  },
];

export default function FitnessSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Challenges</CardTitle>
        <CardDescription>Structured programs to help you reach your goals.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {fitnessChallenges.map(challenge => (
          <Dialog key={challenge.id}>
            <Card className="overflow-hidden">
                <div className="relative h-40 w-full">
                    <Image
                        src={challenge.imageUrl}
                        alt={challenge.title}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={challenge.imageHint}
                    />
                </div>
                <CardHeader>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </CardContent>
                <CardFooter>
                    <DialogTrigger asChild>
                        <Button className="w-full">View Challenge</Button>
                    </DialogTrigger>
                </CardFooter>
            </Card>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{challenge.title}</DialogTitle>
                <DialogDescription>{challenge.description}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <h4 className="font-semibold mb-2">Workout Plan</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {challenge.workoutPlan.map(day => (
                        <li key={day.day} className="flex justify-between">
                            <span>Day {day.day}</span>
                            <span className="text-right font-medium text-foreground">{day.activity}</span>
                        </li>
                    ))}
                     <li className="text-center">... and more</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  );
}
