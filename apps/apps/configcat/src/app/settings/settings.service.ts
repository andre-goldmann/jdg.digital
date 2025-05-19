import { Injectable } from '@angular/core';
import { ConfigFile } from '../flags/model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  convertAndStoreData(env:string, service: string, tenant: string, fileContent: string, fileName: string): Observable<ConfigFile[]>{
    return this.http.post<ConfigFile[]>('/api/upload/yaml', {env, service, tenant, fileContent, fileName });
  }
}
