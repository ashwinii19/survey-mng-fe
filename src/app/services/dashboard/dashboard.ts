import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<any> { return this.http.get(`${this.baseUrl}/summary`); }
  getDepartments(): Observable<any> { return this.http.get(`${this.baseUrl}/departments`); }
  getSurveys(): Observable<any> { return this.http.get(`${this.baseUrl}/surveys`); }
  getEmployeesByStatus(submitted: boolean): Observable<any> { return this.http.get(`${this.baseUrl}/employees?submitted=${submitted}`); }

  getResponseBreakdownByDepartment(dept: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/responseBreakdown/department?department=${dept}`);
  }

  getResponseBreakdownBySurvey(survey: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/responseBreakdown/survey?survey=${survey}`);
  }
}
