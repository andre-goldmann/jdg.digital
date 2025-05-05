import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getExample():Observable<string> {
    return this.http.get<string>('/api/example');
  }

  postData(payload: any) {
    return this.http.post('/api/submit', payload);
  }
}
