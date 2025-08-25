
'use client';

import { ListTodo, Dumbbell, BrainCircuit, Sparkles } from 'lucide-react';
import Header from '@/components/zenith/header';
import PersonalizedSuggestions from '@/components/zenith/personalized-suggestions';
import ProgressOverview from '@/components/zenith/progress-overview';
import TaskManager from '@/components/zenith/task-manager';
import FitnessSection from '@/components/zenith/fitness-section';
import MeditationSection from '@/components/zenith/meditation-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { understandCommand } from '@/ai/flows/understand-command';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/types';


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Design the new Zenith app logo', completed: true },
    { id: '2', text: 'Schedule a team meeting for Friday', completed: false },
    { id: '3', text: 'Complete the 30-day fitness challenge intro', completed: false },
  ]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const handleAddTask = (taskText: string) => {
    if (taskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText.trim(),
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({ title: 'Task Added', description: `"${taskText}"` });
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice command:', transcript);
        try {
          const command = await understandCommand({ command: transcript });
          console.log('Understood command:', command);
          
          if (command.intent === 'navigate') {
            if (command.target) {
                setActiveTab(command.target);
            }
          } else if (command.intent === 'addTask') {
            if (command.task) {
              handleAddTask(command.task);
            }
          } else if (command.intent === 'completeTask') {
              const taskToComplete = tasks.find(t => t.text.toLowerCase().includes(command.task!.toLowerCase()) && !t.completed);
              if (taskToComplete) {
                  handleToggleTask(taskToComplete.id);
                  toast({ title: "Task Completed!", description: `"${taskToComplete.text}"` });
              } else {
                  toast({ variant: "destructive", title: "Task not found", description: `Could not find an incomplete task matching "${command.task}"` });
              }
          }
        } catch (error) {
            console.error('Error understanding command:', error);
            toast({ variant: 'destructive', title: 'Voice Error', description: 'Sorry, I didn\'t understand that.' });
        } finally {
            setIsListening(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

    }
  }, [tasks, toast]);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
        toast({ variant: 'destructive', title: 'Not Supported', description: 'Your browser does not support voice recognition.' });
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header isListening={isListening} onMicClick={toggleListening}/>
      <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <PersonalizedSuggestions />
            <ProgressOverview />
          </div>

          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                  <ListTodo className="mr-2 h-5 w-5" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="fitness" className="text-xs sm:text-sm">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Fitness
                </TabsTrigger>
                <TabsTrigger value="meditation" className="text-xs sm:text-sm">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Mindfulness
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskManager tasks={tasks} setTasks={setTasks} handleAddTask={handleAddTask} handleToggleTask={handleToggleTask} handleDeleteTask={handleDeleteTask} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="fitness">
                <FitnessSection />
              </TabsContent>
              <TabsContent value="meditation">
                <MeditationSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
