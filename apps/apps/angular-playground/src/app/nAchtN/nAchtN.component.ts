import { Component, inject } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs/operators';

// Interface für die Antwort des Endpunkts

interface Result {
  results: BookResponse[]
}

interface BookResponse {
  title: string;
  price: string;
}

@Component({
  selector: 'app-n-acht-n',
  standalone: true,
  imports: [
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
    const prompt = "List 10 books to read about Rust. Return the result as a single-line, minified JSON array of objects in the format: [{\"title\": \"Book Title\"}, ...] with no extra whitespace or line breaks.";
    this.http.post<Result[]>('http://localhost:5678/webhook-test/21037c0b-6c2a-4c67-a0f1-55547c6f8ec6', {id:1, msg:prompt})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response[0].results);
          this.bookData = response[0].results;
        },
        error: (error) => {
          console.error('Fehler aufgetreten:', error);
        }
      });
  }
}
