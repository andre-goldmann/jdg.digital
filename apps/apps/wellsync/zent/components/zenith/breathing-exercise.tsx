'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const phaseConfig = {
  inhale: { duration: 4000, text: 'Breathe In...', next: 'hold' as Phase, scale: 'scale-110' },
  hold: { duration: 7000, text: 'Hold', next: 'exhale' as Phase, scale: 'scale-110' },
  exhale: { duration: 8000, text: 'Breathe Out...', next: 'inhale' as Phase, scale: 'scale-100' },
};

export default function BreathingExercise() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [text, setText] = useState('Start');
  const [scale, setScale] = useState('scale-100');

  useEffect(() => {
    if (phase === 'idle') return;

    const config = phaseConfig[phase];
    setText(config.text);
    setScale(config.scale);

    const timer = setTimeout(() => {
      setPhase(config.next);
    }, config.duration);

    return () => clearTimeout(timer);
  }, [phase]);

  const handleToggle = () => {
    if (phase === 'idle') {
      setPhase('inhale');
    } else {
      setPhase('idle');
      setText('Start');
      setScale('scale-100');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 rounded-lg bg-secondary/30 h-64">
      <div className="relative flex items-center justify-center h-32 w-32">
        <div
          className={cn(
            'absolute h-full w-full rounded-full bg-primary/20 transition-transform duration-[4000ms] ease-out',
            scale
          )}
        />
        <div
          className={cn(
            'absolute h-5/6 w-5/6 rounded-full bg-primary/40 transition-transform duration-[4000ms] ease-out',
            scale
          )}
        />
        <span className="relative text-lg font-medium text-primary-foreground drop-shadow-md">
          {text}
        </span>
      </div>
      <Button onClick={handleToggle} variant="secondary" size="lg" className="rounded-full w-24">
        {phase === 'idle' ? <><Play className="mr-2 h-4 w-4" /> Start</> : <><Pause className="mr-2 h-4 w-4" /> Stop</>}
      </Button>
    </div>
  );
}
