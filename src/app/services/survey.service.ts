// src/app/services/survey.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // adjust path if needed
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private base = `${environment.apiBaseUrl}/surveys`;

  constructor(private http: HttpClient) {}

  createSurvey(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}`, payload);
  }

  getAllSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}`);
  }

  getSurvey(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  publishSurvey(id: number): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}/publish`, {});
  }

  updateSurvey(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, payload);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
