import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlagDto } from './model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {

  constructor(private http: HttpClient) { }

  parseDescription(env: string, service: string, tenant: string, fileContent: any, fileName: string): Observable<FlagDto[]> {
    return this.http.post<FlagDto[]>('/api/upload/csv', {env, service, tenant, fileContent, fileName });
  }

  getConfigurations(page:number, pageSize:number): Observable<FlagDto[]> {
    return this.http.get<FlagDto[]>(`api/flags?page=${page}&pageSize=${pageSize}`);
  }
}
