import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HelloResponse {
  message: string;
  timestamp: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getHello(): Observable<HelloResponse> {
    return this.http.get<HelloResponse>('/api/hello');
  }
}
