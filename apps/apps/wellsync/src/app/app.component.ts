import {
  Component,
  inject,
  OnInit,
  signal,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';

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
export class AppComponent implements OnInit, AfterViewInit {

  server = false;
  client = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.server = isPlatformServer(this.platformId);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.client = true;
    }
  }

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
