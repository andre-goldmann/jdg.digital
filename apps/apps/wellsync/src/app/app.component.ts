import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskVoiceService } from './shared/data/task-voice.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected title = 'wellsync';

  // Initialize the task voice service
  private taskVoiceService = inject(TaskVoiceService);
}
