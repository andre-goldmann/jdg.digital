import { Injectable } from '@angular/core';
import { ConfigRowSimple } from '../flags/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  convertAndStoreData(service: string, tenant: string, fileContent: string, fileName: string): Observable<ConfigRowSimple[]>{
    return this.http.post<ConfigRowSimple[]>('/api/upload/yaml', {service, tenant, fileContent, fileName });
  }
}
