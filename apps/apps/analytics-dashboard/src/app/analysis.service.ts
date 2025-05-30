import { Injectable, signal, resource, linkedSignal } from '@angular/core';
import { runFlow } from 'genkit/beta/client';

const USER = 'USER';
const AGENT = 'AGENT';
const ENDPOINT = '/analysisFlow';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  userInput = signal('');

  // Only set this on the initial request
  // Note: for demonstration purposes only; use security best practices for managing sessions
  sessionId = linkedSignal<string, string>({
    source: () => this.analysisResource.value()?.agentResponse || '',
    computation: (_agentResponse, previous): string =>
      (!previous ? Date.now() + '' + Math.floor(Math.random() * 1000000000) : previous.value)
  });

  // Set to true on the initial request, otherwise false to preserve the session
  clearSession = linkedSignal({
    source: () => this.analysisResource.value()?.agentResponse,
    computation: (_agentResponse, previous): boolean => !previous
  });

  chat = linkedSignal<string, Chat[]>({
    source: () => this.analysisResource.value().agentResponse,
    computation: (agentResponse, previous): Chat[] => {
      if (agentResponse === '') {
        return previous?.value || [];
      }

      const chatItem = this.chatItem(agentResponse, AGENT);
      return (previous) ? [chatItem, ...previous.value] : [chatItem];
    }
  });

  analysisResource = resource({
    defaultValue: { agentResponse: ''},
    request: () => this.userInput(),
    loader: ({request}): Promise<AnalyisResponse> => {
      return runFlow({ url: ENDPOINT, input: {
          userInput: request,
          sessionId: this.sessionId(),
          clearSession: this.clearSession()
        }});
    }
  });

  updateChatFromUser(userInput: string): void {
    const chatItem = this.chatItem(userInput, USER);
    this.chat.update(value => [chatItem, ...value]);
    this.userInput.set(userInput);
  }

  chatItem(text: string, role: Role): Chat {
    return {
      id: Math.floor(Math.random() * 2000),
      role,
      text
    };
  }
}

type Role = 'AGENT' | 'USER';

interface Chat {
  id: number,
  role: Role;
  text: string;
}

interface AnalyisResponse {
  agentResponse: string;
}

