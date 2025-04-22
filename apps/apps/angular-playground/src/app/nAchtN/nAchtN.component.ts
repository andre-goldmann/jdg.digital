import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs/operators';

// Interface für die Antwort des Endpunkts
interface BookResponse {
  title: string;
  price: string;
}

@Component({
  selector: 'app-n-acht-n',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './nAchtN.component.html',
  styleUrl: './nAchtN.component.css',
})
export class NAchtNComponent {
  private http = inject(HttpClient);
  isLoading = false;
  bookData: BookResponse[] = [];

  testEndpoint(): void {
    this.isLoading = true;
    this.bookData = [];

    this.http.post<BookResponse[]>('http://localhost:5678/webhook/f70edaa3-140b-48a0-bbe5-074324633f0d', {})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Antwort erhalten:', response);
          this.bookData = response;
        },
        error: (error) => {
          console.error('Fehler aufgetreten:', error);
        }
      });
  }
}
