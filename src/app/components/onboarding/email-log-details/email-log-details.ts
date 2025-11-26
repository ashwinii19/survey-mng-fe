

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-email-log-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-log-details.html'
  , styleUrls: ['./email-log-details.css']
})
export class EmailLogDetails implements OnInit {
  logDetails: any = null;
  loading = true;
  error = '';
  activeTab: string = 'sent';
  logId: number | null = null;

  // Make environment accessible in template
  environment = environment;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🔧 Component initialized');
    
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      console.log('🆔 Raw ID from route:', idParam);
      
      this.logId = idParam ? Number(idParam) : null;
      console.log('🔍 Parsed log ID:', this.logId);
      
      if (this.logId && this.logId > 0) {
        console.log('✅ Valid ID found, loading data...');
        this.loadEmailLogDetails(this.logId);
      } else {
        this.error = `Invalid log ID: ${idParam}. ID must be a positive number.`;
        this.loading = false;
        console.error('❌ Invalid ID:', idParam);
      }
    });
  }

  loadEmailLogDetails(logId: number) {
    this.loading = true;
    this.error = '';
    
    const apiUrl = `${environment.apiBaseUrl}/onboarding/email-logs/${logId}`;
    console.log('🚀 Making API call to:', apiUrl);
    
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        console.log('✅ API Response received:', response);
        // The API returns the data directly, not nested under 'log'
        this.logDetails = response;
        this.loading = false;
        
        if (!this.logDetails) {
          this.error = 'Received empty response from server';
        }
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        
        if (error.status === 404) {
          this.error = `Email log with ID ${logId} not found on the server.`;
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          this.error = `Server error: ${error.status} - ${error.message}`;
        }
        this.loading = false;
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

  goBack() {
    this.router.navigate(['/app/onboarding/email-logs']);
  }

  resendFailedEmails() {
    if (!this.logDetails?.id) return;
    
    if (confirm('Resend failed emails?')) {
      const apiUrl = `${environment.apiBaseUrl}/onboarding/email-logs/${this.logDetails.id}/resend-failed`;
      console.log('🔄 Resending failed emails to:', apiUrl);
      
      this.http.post(apiUrl, {}).subscribe({
        next: () => {
          alert('Resend started successfully');
          this.loadEmailLogDetails(this.logDetails.id);
        },
        error: (error) => {
          console.error('❌ Resend failed:', error);
          alert(`Resend failed: ${error.message}`);
        }
      });
    }
  }

  // Helper methods to get email arrays (they're already arrays in the response)
  getSentEmails(): string[] {
    return this.logDetails?.sentEmails || [];
  }

  getFailedEmails(): string[] {
    return this.logDetails?.failedEmails || [];
  }

  getIneligibleEmails(): string[] {
    return this.logDetails?.ineligibleEmails || [];
  }

  getDateErrorEmails(): string[] {
    return this.logDetails?.dateErrorEmails || [];
  }

  getStatusBadgeClass(status: string): string {
  const classes: { [key: string]: string } = {
    'COMPLETED': 'bg-success text-white',
    'PROCESSING': 'bg-warning text-dark',
    'FAILED': 'bg-danger text-white'
  };
  return classes[status] || 'bg-secondary text-white';
}

  // Debug method to check data structure
  debugDataStructure() {
    console.log('🔍 Debug - Full logDetails:', this.logDetails);
    console.log('🔍 Debug - Available properties:', Object.keys(this.logDetails || {}));
  }


  // Add these to your component class
currentPage: number = 1;
pageSize: number = 10; // Adjust as needed

// Pagination methods
getCurrentPageEmails(type: string): string[] {
  const emails = this.getEmailsByType(type);
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return emails.slice(startIndex, endIndex);
}

getEmailsByType(type: string): string[] {
  switch (type) {
    case 'sent': return this.getSentEmails();
    case 'failed': return this.getFailedEmails();
    case 'ineligible': return this.getIneligibleEmails();
    case 'dateErrors': return this.getDateErrorEmails();
    default: return [];
  }
}

getTotalPages(type: string): number {
  const emails = this.getEmailsByType(type);
  return Math.ceil(emails.length / this.pageSize);
}

getStartIndex(): number {
  return (this.currentPage - 1) * this.pageSize;
}

getEndIndex(type: string): number {
  const emails = this.getEmailsByType(type);
  return Math.min(this.currentPage * this.pageSize, emails.length);
}

getPages(type: string): number[] {
  const totalPages = this.getTotalPages(type);
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
}

goToPage(page: number): void {
  this.currentPage = page;
}

nextPage(type: string): void {
  if (this.currentPage < this.getTotalPages(type)) {
    this.currentPage++;
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Reset pagination when tab changes
setActiveTab(tab: string): void {
  this.activeTab = tab;
  this.currentPage = 1; // Reset to first page when changing tabs
}
}