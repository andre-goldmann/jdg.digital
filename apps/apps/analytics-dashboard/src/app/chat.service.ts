import { Injectable, signal, linkedSignal } from '@angular/core';
import { runFlow } from 'genkit/beta/client';

const USER = 'USER';
const AGENT = 'AGENT';
const ENDPOINT = '/chatFlow';

type Role = 'AGENT' | 'USER';

interface Chat {
  id: number;
  role: Role;
  text: string;
}

interface AgentResponse {
  agentResponse: string;
  options: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  userInput = signal('');
  chatResult = signal<AgentResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Only set this on the initial request
  // Note: for demonstration purposes only; use security best practices for managing sessions
  sessionId = linkedSignal<AgentResponse | null, string>({
    source: () => this.chatResult(),
    computation: (_result, previous): string =>
      !previous
        ? Date.now() + '' + Math.floor(Math.random() * 1000000000)
        : previous.value,
  });

  // Set to true on the initial request, otherwise false to preserve the session
  clearSession = linkedSignal({
    source: () => this.chatResult(),
    computation: (_result, previous): boolean => !previous,
  });

  chat = linkedSignal<AgentResponse | null, Chat[]>({
    source: () => this.chatResult(),
    computation: (result, previous): Chat[] => {
      if (!result?.agentResponse) {
        return previous?.value || [];
      }

      const chatItem = this.chatItem(result.agentResponse, AGENT);
      return previous ? [chatItem, ...previous.value] : [chatItem];
    },
  });

  async loadChat(userInput: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const result = await runFlow({
        url: ENDPOINT,
        input: {
          userInput,
          sessionId: this.sessionId(),
          clearSession: this.clearSession(),
        },
      });
      this.chatResult.set(result);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'An error occurred');
      this.chatResult.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateChatFromUser(userInput: string): void {
    const chatItem = this.chatItem(userInput, USER);
    this.chat.update((value) => [chatItem, ...value]);
    this.userInput.set(userInput);
    this.loadChat(userInput);
  }

  chatItem(text: string, role: Role): Chat {
    return {
      id: Math.floor(Math.random() * 2000),
      role,
      text,
    };
  }
}
