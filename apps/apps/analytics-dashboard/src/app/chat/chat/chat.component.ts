import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat',
  imports: [MatIconModule, FormsModule, MatProgressBarModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  chatService = inject(ChatService);
  userInput = '';

  onSubmit(): void {
    if (this.userInput !== '') {
      this.chatService.updateChatFromUser(this.userInput);
      this.userInput = '';
    }
  }
}
