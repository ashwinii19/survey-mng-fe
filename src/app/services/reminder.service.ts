// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReminderService {

//   private baseUrl = `${environment.apiBaseUrl}/admin/reminders`;

//   constructor(private http: HttpClient) {}

//   createReminder(payload: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}`, payload);
//   }

//   listReminders(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}`);
//   }

//   sendNow(id: number): Observable<any> {
//     return this.http.post(`${this.baseUrl}/${id}/send-now`, {});
//   }

//   deleteReminder(id: number) {
//     return this.http.delete(`${this.baseUrl}/${id}`);
//   }

//   getSubmissionStatus(id: number): Observable<any> {
//     return this.http.get(`${this.baseUrl}/${id}/submission-status`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Correct import
import { ReminderRequest } from '../models/reminders.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  private base = environment.apiBaseUrl + "/admin/reminders";

  constructor(private http: HttpClient) {}

  createReminder(dto: ReminderRequest) {
    return this.http.post(`${this.base}`, dto);
  }

  listReminders() {
    return this.http.get<any[]>(`${this.base}`);
  }

  sendReminderNow(id: number) {
    return this.http.post(`${this.base}/${id}/send-now`, {});
  }

  // // GLOBAL SCHEDULER (NO ID)
  // runSchedulerNow() {
  //   return this.http.post(`${this.base}/run-scheduler-now`, {});
  // }

  deleteReminder(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
