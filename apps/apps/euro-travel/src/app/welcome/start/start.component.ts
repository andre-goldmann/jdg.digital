import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirstVisitService } from '../../services/first-visit.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  private router = inject(Router);
  private firstVisitService = inject(FirstVisitService);

  navigateToMain(): void {
    // Navigate to the welcome component
    this.router.navigate(['/welcome-page']);
  }
}
