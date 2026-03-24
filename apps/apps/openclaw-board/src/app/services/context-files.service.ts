import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ContextFile, ContextFilesResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContextFilesService {
  private readonly http = inject(HttpClient);

  getFiles(): Observable<ContextFile[]> {
    return this.http
      .get<ContextFilesResponse>('/api/context-files')
      .pipe(
        map((data) => data.files ?? []),
        catchError(() => of([]))
      );
  }

  getFileContent(filename: string): Observable<string> {
    return this.http
      .get(`/api/context-files/${encodeURIComponent(filename)}`, {
        responseType: 'text',
      })
      .pipe(catchError(() => of('Fehler beim Laden der Datei')));
  }

  saveFileContent(filename: string, content: string): Observable<boolean> {
    return this.http
      .put(
        `/api/context-files/${encodeURIComponent(filename)}`,
        content,
        {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        }
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
