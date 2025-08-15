import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading your experience...</p>
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: 'Quicksand', sans-serif;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(64, 181, 159, 0.2);
        border-radius: 50%;
        border-top-color: #40b59f;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 1rem;
      }

      p {
        color: #333;
        font-size: 16px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion) {
        .loading-spinner {
          animation: none;
          border-top-color: #40b59f;
        }
      }
    `,
  ],
})
export class AppEntryComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Get the data from the resolver
    const data = this.route.snapshot.data;

    if (data['firstVisitCheck']?.isFirstVisit) {
      // If it's the first visit, navigate to the welcome page
      this.router.navigate(['/welcome']);
    } else {
      // If it's not the first visit, navigate to the home page
      this.router.navigate(['/home']);
    }
  }
}
