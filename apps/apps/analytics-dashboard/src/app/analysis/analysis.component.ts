import { Component, inject } from '@angular/core';
import { AnalysisService } from '../analysis.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-analysis',
  imports: [MatIconModule, FormsModule, MatProgressBarModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css',
})
export class AnalysisComponent {
  analysisService = inject(AnalysisService);
  userInput = '';

  onSubmit(): void {
    if (this.userInput !== '') {
      this.analysisService.updateChatFromUser(this.userInput);
      this.userInput = '';
    }
  }
}
