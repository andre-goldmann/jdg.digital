import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskVoiceService } from './shared/data/task-voice.service';
import { ApiService, HelloResponse } from './shared/data/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected title = 'wellsync';
  protected serverResponse = signal<HelloResponse | null>(null);
  protected isLoading = signal<boolean>(false);
  protected error = signal<string | null>(null);

  // Initialize the task voice service
  private taskVoiceService = inject(TaskVoiceService);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.testServerConnection();
  }

  testServerConnection(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService.getHello().subscribe({
      next: (response) => {
        this.serverResponse.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to connect to server');
        this.isLoading.set(false);
        console.error('Server connection error:', err);
      },
    });
  }
}
