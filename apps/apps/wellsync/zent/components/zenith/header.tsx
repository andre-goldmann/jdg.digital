
'use client';

import { BrainCircuit, User, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
    isListening?: boolean;
    onMicClick?: () => void;
}

export default function Header({ isListening, onMicClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">Zenith</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", isListening && 'bg-destructive text-destructive-foreground animate-pulse')}
            onClick={onMicClick}
        >
          <Mic className="h-5 w-5" />
          <span className="sr-only">Toggle voice commands</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
