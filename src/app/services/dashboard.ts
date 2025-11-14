import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard-response';
import { Survey } from '../models/survey';
import { DepartmentStats } from '../models/department-stats';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = `${environment.apiBaseUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(surveyId?: number, departmentId?: number): Observable<DashboardResponse> {
    let params = new HttpParams();
    if (surveyId != null) params = params.set('surveyId', String(surveyId));
    if (departmentId != null) params = params.set('departmentId', String(departmentId));
    return this.http.get<DashboardResponse>(this.base, { params });
  }

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.base}/surveys`);
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/departments`);
  }

  getRecentSurveys(limit = 5): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.base}/recent-surveys?limit=${limit}`);
  }

  getDepartmentStats(surveyId?: number, departmentId?: number): Observable<DepartmentStats[]> {
    let params = new HttpParams();
    if (surveyId != null) params = params.set('surveyId', String(surveyId));
    if (departmentId != null) params = params.set('departmentId', String(departmentId));
    return this.http.get<DepartmentStats[]>(`${this.base}/department-stats`, { params });
  }

  getSurveyStats(surveyId: number) {
    return this.http.get<any>(`${this.base}/survey/${surveyId}/stats`);
  }

  getSubmitted(surveyId?: number, departmentId?: number) {
    let params = new HttpParams();
    if (surveyId != null) params = params.set('surveyId', String(surveyId));
    if (departmentId != null) params = params.set('departmentId', String(departmentId));
    return this.http.get<string[]>(`${this.base}/submitted`, { params });
  }

  getPending(surveyId?: number, departmentId?: number) {
    let params = new HttpParams();
    if (surveyId != null) params = params.set('surveyId', String(surveyId));
    if (departmentId != null) params = params.set('departmentId', String(departmentId));
    return this.http.get<string[]>(`${this.base}/pending`, { params });
  }
}
