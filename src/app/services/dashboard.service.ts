

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// import { DashboardResponse } from '../models/dashboard-response';
// import { Survey } from '../models/survey';
// import { DepartmentStats } from '../models/department-stats';
// import { Auth } from './auth/auth';

// @Injectable({ providedIn: 'root' })
// export class DashboardService {
//   private dashboardBase = `${environment.apiBaseUrl}/admin/dashboard`;

//   private surveyBase = `${environment.apiBaseUrl}/surveys`;
//   private departmentBase = `${environment.apiBaseUrl}/departments`;

//   constructor(
//     private http: HttpClient,
//     private auth: Auth
//   ) {}

//   private getAuthHeaders(): HttpHeaders {
//     const token = this.auth.getToken();

//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       ...(token ? { 'Authorization': `Bearer ${token}` } : {})
//     });
//   }

//   // -----------------------------------------
//   // MAIN DASHBOARD REQUEST
//   // -----------------------------------------
//   getDashboard(surveyId?: number, departmentId?: number): Observable<DashboardResponse> {
//     let params = new HttpParams();
//     if (surveyId) params = params.set('surveyId', surveyId);
//     if (departmentId) params = params.set('departmentId', departmentId);

//     const headers = this.getAuthHeaders();
//     return this.http.get<DashboardResponse>(this.dashboardBase, { params, headers });
//   }

//   // -----------------------------------------
//   // SURVEYS (FROM REAL SURVEY API)
//   // -----------------------------------------
//   getSurveys(): Observable<Survey[]> {
//     const headers = this.getAuthHeaders();
//     return this.http.get<Survey[]>(this.surveyBase, { headers });
//   }

//   // -----------------------------------------
//   // DEPARTMENTS (REAL DEPARTMENT API)
//   // -----------------------------------------
//   getDepartments(): Observable<any[]> {
//     const headers = this.getAuthHeaders();
//     return this.http.get<any[]>(this.departmentBase, { headers });
//   }

//   // -----------------------------------------
//   // RECENT SURVEYS (ALSO COMING FROM /surveys)
//   // -----------------------------------------
//   getRecentSurveys(limit: number = 5): Observable<Survey[]> {
//     const headers = this.getAuthHeaders();
//     return this.http.get<Survey[]>(`${this.surveyBase}`, { headers });
//   }

//   // -----------------------------------------
//   // STATS + TABLES
//   // -----------------------------------------
//   getDepartmentStats(surveyId?: number, departmentId?: number): Observable<DepartmentStats[]> {
//     let params = new HttpParams();
//     if (surveyId) params = params.set('surveyId', surveyId);
//     if (departmentId) params = params.set('departmentId', departmentId);

//     const headers = this.getAuthHeaders();
//     return this.http.get<DepartmentStats[]>(`${this.dashboardBase}/department-stats`, { params, headers });
//   }

//   getSurveyStats(surveyId: number): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.get<any>(`${this.dashboardBase}/survey/${surveyId}/stats`, { headers });
//   }

//   getSubmitted(surveyId?: number, departmentId?: number): Observable<string[]> {
//     let params = new HttpParams();
//     if (surveyId) params = params.set('surveyId', surveyId);
//     if (departmentId) params = params.set('departmentId', departmentId);

//     const headers = this.getAuthHeaders();
//     return this.http.get<string[]>(`${this.dashboardBase}/submitted`, { params, headers });
//   }

//   getPending(surveyId?: number, departmentId?: number): Observable<string[]> {
//     let params = new HttpParams();
//     if (surveyId) params = params.set('surveyId', surveyId);
//     if (departmentId) params = params.set('departmentId', departmentId);

//     const headers = this.getAuthHeaders();
//     return this.http.get<string[]>(`${this.dashboardBase}/pending`, { params, headers });
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs';
// import { DashboardResponse } from '../models/dashboard-response';

// @Injectable({ providedIn: 'root' })
// export class DashboardService {
//   private base = `${environment.apiBaseUrl}`;

//   constructor(private http: HttpClient) {}

//   getSurveys(): Observable<any[]> {
//     // adapt endpoint if different in your backend
//     return this.http.get<any[]>(`${this.base}/surveys`);
//   }

//   getDepartments(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.base}/departments`);
//   }

//   getDashboard(surveyId?: number | string, departmentId?: number | string): Observable<DashboardResponse> {
//     let params = new HttpParams();
//     if (surveyId !== undefined && surveyId !== null && surveyId !== '') {
//       params = params.set('surveyId', String(surveyId));
//     }
//     if (departmentId !== undefined && departmentId !== null && departmentId !== '') {
//       params = params.set('departmentId', String(departmentId));
//     }
//     return this.http.get<DashboardResponse>(`${this.base}/dashboard`, { params });
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard-response';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private base = `${environment.apiBaseUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  /** GET ALL SURVEYS */
  getSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/surveys`);
  }

  /** GET ALL DEPARTMENTS */
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/departments`);
  }

  /** MAIN DASHBOARD DATA */
  getDashboard(surveyId?: number | string, departmentId?: number | string): Observable<DashboardResponse> {
    let params = new HttpParams();

    if (surveyId != null && surveyId !== '') {
      params = params.set('surveyId', String(surveyId));
    }
    if (departmentId != null && departmentId !== '') {
      params = params.set('departmentId', String(departmentId));
    }

    return this.http.get<DashboardResponse>(`${this.base}`, { params });
  }
}
