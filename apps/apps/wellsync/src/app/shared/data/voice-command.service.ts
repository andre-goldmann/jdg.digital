import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

export interface VoiceCommand {
  command: string;
  route?: string;
  action?: 'navigate' | 'add-task' | 'complete-task' | 'delete-task';
  description: string;
}

export interface VoiceCommandResult {
  command: VoiceCommand;
  extractedText?: string;
  taskId?: string;
}

export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  error: string | null;
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult:
      | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
      | null;
    onerror:
      | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
      | null;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VoiceCommandService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private _voiceState = new BehaviorSubject<VoiceState>({
    isListening: false,
    isSupported: false,
    lastCommand: null,
    error: null,
  });

  private _commandExecuted = new Subject<VoiceCommandResult>();

  // Voice commands mapping
  private readonly voiceCommands: VoiceCommand[] = [
    // Navigation commands
    {
      command: 'dashboard',
      route: '/',
      action: 'navigate',
      description: 'Go to dashboard',
    },
    {
      command: 'tasks',
      route: '/tasks',
      action: 'navigate',
      description: 'Go to tasks',
    },
    {
      command: 'workouts',
      route: '/workouts',
      action: 'navigate',
      description: 'Go to workouts',
    },
    {
      command: 'meditation',
      route: '/meditation',
      action: 'navigate',
      description: 'Go to meditation',
    },
    {
      command: 'home',
      route: '/',
      action: 'navigate',
      description: 'Go to home',
    },
    {
      command: 'fitness',
      route: '/workouts',
      action: 'navigate',
      description: 'Go to fitness',
    },
    {
      command: 'mindfulness',
      route: '/meditation',
      action: 'navigate',
      description: 'Go to mindfulness',
    },

    // Task management commands
    { command: 'add task', action: 'add-task', description: 'Add a new task' },
    {
      command: 'create task',
      action: 'add-task',
      description: 'Create a new task',
    },
    {
      command: 'new task',
      action: 'add-task',
      description: 'Create a new task',
    },
    {
      command: 'complete task',
      action: 'complete-task',
      description: 'Mark task as complete',
    },
    {
      command: 'finish task',
      action: 'complete-task',
      description: 'Mark task as complete',
    },
    {
      command: 'done task',
      action: 'complete-task',
      description: 'Mark task as complete',
    },
    {
      command: 'delete task',
      action: 'delete-task',
      description: 'Delete a task',
    },
    {
      command: 'remove task',
      action: 'delete-task',
      description: 'Remove a task',
    },
  ];

  readonly voiceState$ = this._voiceState.asObservable();
  readonly commandExecuted$ = this._commandExecuted.asObservable();

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }

  private initializeSpeechSynthesis(): void {
    // Only initialize in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private initializeSpeechRecognition(): void {
    // Only initialize in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      this.updateState({
        isSupported: false,
        error: `Speech recognition only available in browser (platformId: ${this.platformId})`,
      });
      return;
    }

    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      this.updateState({
        isSupported: false,
        error: 'Speech recognition not supported',
      });
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.updateState({ isListening: true, error: null });
      };

      this.recognition.onend = () => {
        this.updateState({ isListening: false });
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        this.processVoiceCommand(transcript);
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        this.updateState({
          isListening: false,
          error: `Speech recognition error: ${event.error}`,
        });
      };

      this.updateState({ isSupported: true });
    }
  }

  startListening(): void {
    if (!this.recognition || this._voiceState.value.isListening) {
      return;
    }

    try {
      this.recognition.start();
    } catch {
      this.updateState({
        error: 'Failed to start speech recognition',
      });
    }
  }

  stopListening(): void {
    if (this.recognition && this._voiceState.value.isListening) {
      this.recognition.stop();
    }
  }

  private processVoiceCommand(transcript: string): void {
    this.updateState({ lastCommand: transcript });

    // Find matching command
    const matchedCommand = this.voiceCommands.find(
      (cmd) =>
        transcript.includes(cmd.command) ||
        transcript.includes(`go to ${cmd.command}`) ||
        transcript.includes(`show ${cmd.command}`) ||
        transcript.includes(`open ${cmd.command}`)
    );

    if (matchedCommand) {
      // Extract additional context for task commands
      let extractedText = '';
      const taskId = '';

      if (matchedCommand.action === 'add-task') {
        // Extract task text after the command
        const commandPatterns = ['add task', 'create task', 'new task'];
        const pattern = commandPatterns.find((p) => transcript.includes(p));
        if (pattern) {
          extractedText = transcript.replace(pattern, '').trim();
        }
      } else if (
        matchedCommand.action === 'complete-task' ||
        matchedCommand.action === 'delete-task'
      ) {
        // Extract task identifier (for now, we'll use partial text matching)
        const commandPatterns = [
          'complete task',
          'finish task',
          'done task',
          'delete task',
          'remove task',
        ];
        const pattern = commandPatterns.find((p) => transcript.includes(p));
        if (pattern) {
          extractedText = transcript.replace(pattern, '').trim();
        }
      }

      this.executeCommand(matchedCommand, extractedText, taskId);
    } else {
      this.updateState({
        error: `Command not recognized: "${transcript}". Try saying "go to tasks", "add task buy groceries", or "complete task workout"`,
      });
    }
  }

  speak(text: string): void {
    if (!this.synthesis || !isPlatformBrowser(this.platformId)) {
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; // Slightly faster
    utterance.pitch = 1;
    utterance.volume = 0.8;

    this.synthesis.speak(utterance);
  }

  private executeCommand(
    command: VoiceCommand,
    extractedText?: string,
    taskId?: string
  ): void {
    const result: VoiceCommandResult = {
      command,
      extractedText,
      taskId,
    };

    // Handle navigation commands with audio feedback
    if (command.action === 'navigate' && command.route) {
      this.router.navigate([command.route]);

      // Provide audio feedback for navigation
      const feedbackText = this.getNavigationFeedback(command.command);
      this.speak(feedbackText);
    }

    // Emit the command for other components to handle
    this._commandExecuted.next(result);
    this.updateState({ error: null });
  }

  private getNavigationFeedback(commandKey: string): string {
    const feedbackMap: { [key: string]: string } = {
      dashboard: 'Switched to dashboard',
      tasks: 'Switched to tasks',
      workouts: 'Switched to workouts',
      meditation: 'Switched to meditation',
      home: 'Switched to home',
      fitness: 'Switched to fitness',
      mindfulness: 'Switched to mindfulness',
    };

    return feedbackMap[commandKey] || `Switched to ${commandKey}`;
  }

  private updateState(partialState: Partial<VoiceState>): void {
    const currentState = this._voiceState.value;
    this._voiceState.next({ ...currentState, ...partialState });
  }

  getAvailableCommands(): VoiceCommand[] {
    return [...this.voiceCommands];
  }

  isVoiceSupported(): boolean {
    return this._voiceState.value.isSupported;
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
