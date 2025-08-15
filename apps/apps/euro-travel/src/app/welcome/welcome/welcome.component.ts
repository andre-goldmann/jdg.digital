import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirstVisitService } from '../../services/first-visit.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private router = inject(Router);
  private firstVisitService = inject(FirstVisitService);

  phoneNumber = '';

  navigateToMain(): void {
    // Mark that the user has visited before
    this.firstVisitService.markAsVisited();

    // Navigate to the main page
    this.router.navigate(['/home']);
  }
}
