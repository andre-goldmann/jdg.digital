import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigRowSimple } from './model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {

  constructor(private http: HttpClient) { }

  parseDescription(service: string, tenant: string, file: File, fileName: string): Observable<ConfigRowSimple[]>{
    return this.http.post<ConfigRowSimple[]>('/api/upload/csv', {service, tenant, file, fileName });
  }
}
