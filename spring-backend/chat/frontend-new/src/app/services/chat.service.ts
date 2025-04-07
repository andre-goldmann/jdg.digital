import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  message: string;
  response?: string;
}

export interface ChatResponse {
  generation: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat/ai/generate'; // Update with your API URL

  constructor(private http: HttpClient) { }

  sendMessage(message: ChatMessage): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, message);
  }
}
