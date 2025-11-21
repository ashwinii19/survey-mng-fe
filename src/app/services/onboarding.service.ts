

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OnboardingEmailLog {
  id: number;
  employeeBatchLogId: number;
  totalEmployees: number;
  emailsSent: number;
  emailsFailed: number;
  ineligibleDueToDate: number;
  dateFormatErrors: number;
  status: string;
  sentEmailsList: string;
  failedEmailsList: string;
  ineligibleEmailsList: string;
  dateErrorEmailsList: string;
  startedAt: string;
  completedAt: string;
}

export interface OnboardingStatistics {
  totalOnboardingBatches: number;
  completedBatches: number;
  failedBatches: number;
  pendingBatches: number;
  totalEmailsSent: number;
  totalEmailsFailed: number;
  batchSuccessRate: string;
  emailSuccessRate: string;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private baseUrl = '/api/onboarding';

  constructor(private http: HttpClient) { }

  // Get all onboarding email logs
  getEmailLogs(): Observable<OnboardingEmailLog[]> {
    return this.http.get<OnboardingEmailLog[]>(`${this.baseUrl}/email-logs`);
  }

  // Get specific email log details
  getEmailLogDetails(logId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/email-logs/${logId}`);
  }

  // Trigger onboarding emails for a batch
  triggerOnboardingEmails(batchId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/batches/${batchId}/send-welcome-emails`, {});
  }

  // Check employee eligibility
  checkEmployeeEligibility(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees/${email}/eligibility`);
  }

  // Get onboarding statistics
  getStatistics(): Observable<OnboardingStatistics> {
    return this.http.get<OnboardingStatistics>(`${this.baseUrl}/statistics`);
  }

  // Resend failed emails
  resendFailedEmails(logId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/email-logs/${logId}/resend-failed`, {});
  }

  // Get email logs by batch ID
  getEmailLogsByBatchId(batchId: number): Observable<OnboardingEmailLog[]> {
    return this.http.get<OnboardingEmailLog[]>(`${this.baseUrl}/batches/${batchId}/email-logs`);
  }
}