import { Injectable } from '@angular/core';
import { ConfigData } from './flags/model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  getConfigData() {
    return this.http.get<ConfigData>('/api/config');
  }
}
