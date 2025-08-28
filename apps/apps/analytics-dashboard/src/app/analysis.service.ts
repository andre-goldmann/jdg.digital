import { Injectable, signal, linkedSignal } from '@angular/core';
import { runFlow } from 'genkit/beta/client';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

const USER = 'USER';
const AGENT = 'AGENT';
const ENDPOINT = '/analysisFlow';

type Role = 'AGENT' | 'USER';

interface Chat {
  id: number;
  role: Role;
  text: string;
}

interface AnalyisResponse {
  agentResponse: string;
}

interface WhaleWisdomData {
  filer_name: string;
  url: string;
  fund_info?: {
    name?: string;
    description?: string;
    location?: string;
    market_value?: string;
    top_10_concentration?: string;
    largest_holding?: string;
  };
  top_buys?: Array<{
    symbol: string;
    name: string;
    percentage_change: string;
  }>;
  top_sells?: Array<{
    symbol: string;
    name: string;
    percentage_change: string;
  }>;
  activity_data: Record<string, string>;
  scraped_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private readonly http = inject(HttpClient);

  userInput = signal('');
  analysisResult = signal<AnalyisResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // WhaleWisdom related signals
  investorInput = signal('');
  whaleWisdomData = signal<WhaleWisdomData | null>(null);
  isLoadingWhaleWisdom = signal(false);
  whaleWisdomError = signal<string | null>(null);

  // Only set this on the initial request
  // Note: for demonstration purposes only; use security best practices for managing sessions
  sessionId = linkedSignal<AnalyisResponse | null, string>({
    source: () => this.analysisResult(),
    computation: (_result, previous): string =>
      !previous
        ? Date.now() + '' + Math.floor(Math.random() * 1000000000)
        : previous.value,
  });

  // Set to true on the initial request, otherwise false to preserve the session
  clearSession = linkedSignal({
    source: () => this.analysisResult(),
    computation: (_result, previous): boolean => !previous,
  });

  chat = linkedSignal<AnalyisResponse | null, Chat[]>({
    source: () => this.analysisResult(),
    computation: (result, previous): Chat[] => {
      if (!result?.agentResponse) {
        return previous?.value || [];
      }

      const chatItem = this.chatItem(result.agentResponse, AGENT);
      return previous ? [chatItem, ...previous.value] : [chatItem];
    },
  });

  async loadAnalysis(userInput: string): Promise<void> {
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
      this.analysisResult.set(result);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'An error occurred');
      this.analysisResult.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateChatFromUser(userInput: string): void {
    const chatItem = this.chatItem(userInput, USER);
    this.chat.update((value) => [chatItem, ...value]);
    this.userInput.set(userInput);
    this.loadAnalysis(userInput);
  }

  chatItem(text: string, role: Role): Chat {
    return {
      id: Math.floor(Math.random() * 2000),
      role,
      text,
    };
  }

  async loadInvestorData(investor: string): Promise<void> {
    this.isLoadingWhaleWisdom.set(true);
    this.whaleWisdomError.set(null);

    try {
      const response = await this.http
        .post<WhaleWisdomData>('/api/whale-wisdom', {
          investor,
        })
        .toPromise();

      this.whaleWisdomData.set(response || null);
    } catch (err) {
      this.whaleWisdomError.set(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching investor data'
      );
      this.whaleWisdomData.set(null);
    } finally {
      this.isLoadingWhaleWisdom.set(false);
    }
  }

  searchInvestor(investor: string): void {
    this.investorInput.set(investor);
    this.loadInvestorData(investor);
  }
}
