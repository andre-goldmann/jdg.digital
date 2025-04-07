import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatService, ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  currentMessage: string = '';
  messages: ChatMessage[] = [];
  isLoading: boolean = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    const message: ChatMessage = {
      message: this.currentMessage
    };

    this.isLoading = true;
    this.messages.push(message);
    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        console.info(response);
        message.response = response.generation;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        message.response = 'Error: Could not get response';
        this.isLoading = false;
      }
    });

    this.currentMessage = '';
  }
}
