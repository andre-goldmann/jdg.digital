'use client';

import { BarChart, LineChart, Activity, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const workoutData = [
  { month: 'Jan', workouts: 12 },
  { month: 'Feb', workouts: 18 },
  { month: 'Mar', workouts: 22 },
  { month: 'Apr', workouts: 15 },
  { month: 'May', workouts: 25 },
  { month: 'Jun', workouts: 21 },
];

const meditationData = [
  { day: 'Mon', minutes: 10 },
  { day: 'Tue', minutes: 15 },
  { day: 'Wed', minutes: 5 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 15 },
  { day: 'Sat', minutes: 25 },
  { day: 'Sun', minutes: 10 },
];

const chartConfig: ChartConfig = {
  workouts: {
    label: 'Workouts',
    color: 'hsl(var(--primary))',
    icon: Activity,
  },
  minutes: {
    label: 'Minutes',
    color: 'hsl(var(--accent))',
    icon: Brain,
  },
};

export default function ProgressOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your wellness journey at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center"><Activity className="h-4 w-4 mr-2 text-primary" />Monthly Workouts</h4>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <RechartsBarChart data={workoutData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="workouts" fill="var(--color-workouts)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center"><Brain className="h-4 w-4 mr-2 text-accent" />Weekly Meditation Minutes</h4>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <RechartsLineChart data={meditationData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={{ fill: "var(--color-minutes)" }} activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
