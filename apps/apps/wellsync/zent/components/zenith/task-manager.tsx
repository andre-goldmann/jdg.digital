
'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskManagerProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    handleAddTask: (text: string) => void;
    handleToggleTask: (id: string) => void;
    handleDeleteTask: (id: string) => void;
}

export default function TaskManager({ tasks, setTasks, handleAddTask, handleToggleTask, handleDeleteTask }: TaskManagerProps) {
  const [newTaskText, setNewTaskText] = useState('');

  const onAddTask = () => {
    handleAddTask(newTaskText);
    setNewTaskText('');
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddTask()}
        />
        <Button onClick={onAddTask} aria-label="Add task">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary/50"
            >
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
                aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}
              >
                {task.text}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTask(task.id)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                aria-label={`Delete task "${task.text}"`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
