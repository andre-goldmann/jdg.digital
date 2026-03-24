import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Activity, ActivityResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly http = inject(HttpClient);

  getActivities(limit = 50): Observable<Activity[]> {
    return this.http
      .get<ActivityResponse>(`/api/activity?limit=${limit}`)
      .pipe(
        map((data) => data.activities ?? []),
        catchError(() => of([]))
      );
  }

  getRecentActivities(): Observable<Activity[]> {
    return this.getActivities(5);
  }
}
