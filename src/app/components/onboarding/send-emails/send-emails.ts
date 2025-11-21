import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-send-emails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-emails.html',
  styleUrls: ['./send-emails.css']
})
export class SendEmailsComponent {
  batchId: number | null = null;
  sending = false;
  error = '';
  success = '';

  private apiUrl = 'http://localhost:8080/api/onboarding';

  constructor(private http: HttpClient) {}

  sendEmails() {
    if (!this.batchId) {
      this.error = 'Please enter a Batch ID';
      return;
    }

    this.sending = true;
    this.error = '';
    this.success = '';

    this.http.post<any>(`${this.apiUrl}/batches/${this.batchId}/send-welcome-emails`, {}).subscribe({
      next: (response) => {
        this.sending = false;
        this.success = `✅ Emails triggered successfully! 
          Batch ID: ${response.batchId} 
          Status: ${response.status}
          Message: ${response.message}`;
        
        // Clear success after 5 seconds
        setTimeout(() => {
          this.success = '';
        }, 5000);
      },
      error: (error) => {
        this.sending = false;
        this.error = error.error?.error || 'Failed to trigger emails. Please check the batch ID and try again.';
        
        // Clear error after 5 seconds
        setTimeout(() => {
          this.error = '';
        }, 5000);
      }
    });
  }

  resetForm() {
    this.batchId = null;
    this.error = '';
    this.success = '';
  }
}