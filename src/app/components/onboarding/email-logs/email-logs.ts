// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

// interface OnboardingEmailLog {
//   id: number;
//   employeeBatchLogId: number;
//   totalEmployees: number;
//   emailsSent: number;
//   emailsFailed: number;
//   ineligibleDueToDate: number;
//   status: string;
// }

// @Component({
//   selector: 'app-email-logs',
//   standalone: true,
//   templateUrl: './email-logs.html'
// })
// export class EmailLogs implements OnInit {
//   emailLogs: OnboardingEmailLog[] = [];
//   private apiBase = 'http://localhost:8080/api';

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.loadEmailLogs();
//   }

//   loadEmailLogs() {
//     this.http.get<OnboardingEmailLog[]>(`${this.apiBase}/onboarding/email-logs`)
//       .subscribe({
//         next: (logs) => this.emailLogs = logs,
//         error: (error) => console.error('Error loading email logs:', error)
//       });
//   }

//   getStatusColor(status: string): string {
//     const colors: { [key: string]: string } = {
//       'COMPLETED': 'success',
//       'PROCESSING': 'warning', 
//       'FAILED': 'danger'
//     };
//     return colors[status] || 'secondary';
//   }

//   viewDetails(logId: number) {
//     this.router.navigate(['/app/onboarding/email-log-details', logId]);
//   }

//   resendFailed(logId: number) {
//     if(confirm('Resend failed emails?')) {
//       this.http.post(`${this.apiBase}/onboarding/email-logs/${logId}/resend-failed`, {})
//         .subscribe({
//           next: () => {
//             alert('Resend started');
//             this.loadEmailLogs();
//           },
//           error: (error) => alert('Resend failed: ' + error.message)
//         });
//     }
//   }
// }





import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common'; // ADD THIS
import { environment } from '../../../../environments/environment';

interface OnboardingEmailLog {
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

@Component({
  selector: 'app-email-logs',
  standalone: true,
  imports: [CommonModule, JsonPipe], // ADD JsonPipe HERE
  templateUrl: './email-logs.html'
})
export class EmailLogs implements OnInit {
  emailLogs: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('📧 EmailLogs component initialized');
    this.loadEmailLogs();
  }

  loadEmailLogs() {
    console.log('🔍 Loading email logs from:', `${environment.apiBaseUrl}/onboarding/email-logs`);
    
    this.http.get<any[]>(`${environment.apiBaseUrl}/onboarding/email-logs`)
      .subscribe({
        next: (response) => {
          console.log('✅ RAW Email logs response:', response);
          console.log('📊 Logs found:', response?.length);
          
          this.emailLogs = response || [];
        },
        error: (error) => {
          console.error('❌ Error loading email logs:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
        }
      });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'COMPLETED': 'success',
      'PROCESSING': 'warning', 
      'FAILED': 'danger'
    };
    return colors[status] || 'secondary';
  }

  viewDetails(logId: number) {
    this.router.navigate(['/app/onboarding/email-log-details', logId]);
  }


  // Add these methods to your component class
getTotalLogs(): number {
  return this.emailLogs.length;
}

getCompletedCount(): number {
  return this.emailLogs.filter(log => log.status === 'COMPLETED').length;
}

getProcessingCount(): number {
  return this.emailLogs.filter(log => log.status === 'PROCESSING').length;
}

getFailedCount(): number {
  return this.emailLogs.filter(log => log.status === 'FAILED').length;
}

getTotalSent(): number {
  return this.emailLogs.reduce((sum, log) => sum + (log.emailsSent || 0), 0);
}

getTotalFailed(): number {
  return this.emailLogs.reduce((sum, log) => sum + (log.emailsFailed || 0), 0);
}

getStatusIcon(status: string): string {
  const icons: { [key: string]: string } = {
    'COMPLETED': 'bi-check-circle',
    'PROCESSING': 'bi-arrow-repeat',
    'FAILED': 'bi-exclamation-triangle'
  };
  return icons[status] || 'bi-question-circle';
}

getStatusBadgeClass(status: string): string {
  const classes: { [key: string]: string } = {
    'COMPLETED': 'bg-success text-white',
    'PROCESSING': 'bg-warning text-dark',
    'FAILED': 'bg-danger text-white'
  };
  return classes[status] || 'bg-secondary text-white';
}
}