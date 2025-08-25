'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Meditation } from '@/lib/types';
import BreathingExercise from './breathing-exercise';
import { Separator } from '@/components/ui/separator';

const meditations: Meditation[] = [
  { id: 'm1', title: 'Mindful Morning', duration: 10, category: 'Mindfulness', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'sunrise meditation' },
  { id: 'm2', title: 'Stress Relief', duration: 5, category: 'Stress', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'calm water' },
  { id: 'm3', title: 'Deep Sleep', duration: 15, category: 'Sleep', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'night sky' },
];

export default function MeditationSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Guided Meditations</CardTitle>
          <CardDescription>Find calm and focus with our guided sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {meditations.map(meditation => (
            <div key={meditation.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <Image
                src={meditation.imageUrl}
                alt={meditation.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
                data-ai-hint={meditation.imageHint}
              />
              <div className="flex-1">
                <h4 className="font-semibold">{meditation.title}</h4>
                <p className="text-sm text-muted-foreground">{meditation.category}</p>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{meditation.duration} min</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breathing Exercise</CardTitle>
          <CardDescription>Center yourself with a simple breathing technique.</CardDescription>
        </CardHeader>
        <CardContent>
          <BreathingExercise />
        </CardContent>
      </Card>
    </div>
  );
}
