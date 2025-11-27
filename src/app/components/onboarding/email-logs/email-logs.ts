

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, JsonPipe, FormsModule],
  templateUrl: './email-logs.html',
  styleUrls: ['./email-logs.css']
})
export class EmailLogs implements OnInit {
  // Data
  allEmailLogs: OnboardingEmailLog[] = [];
  filteredEmailLogs: OnboardingEmailLog[] = [];
  displayedEmailLogs: OnboardingEmailLog[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10; // Default value
  // itemsPerPageOptions: number[] = [5, 10, 20, 50, 100]; // Options for user to select
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Search filter
  searchTerm: string = '';

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
    
    this.http.get<OnboardingEmailLog[]>(`${environment.apiBaseUrl}/onboarding/email-logs`)
      .subscribe({
        next: (response) => {
          console.log('✅ RAW Email logs response:', response);
          console.log('📊 Logs found:', response?.length);
          
          this.allEmailLogs = response || [];
          this.applyFilters();
        },
        error: (error) => {
          console.error('❌ Error loading email logs:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
        }
      });
  }

  // Filter and pagination methods
  applyFilters() {
    // Apply search filter
    if (this.searchTerm) {
      this.filteredEmailLogs = this.allEmailLogs.filter(log => 
        log.id.toString().includes(this.searchTerm) ||
        log.employeeBatchLogId.toString().includes(this.searchTerm) ||
        log.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredEmailLogs = [...this.allEmailLogs];
    }
    
    this.totalItems = this.filteredEmailLogs.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Reset to page 1 if current page is invalid
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEmailLogs = this.filteredEmailLogs.slice(startIndex, endIndex);
  }

  // Items per page change handler
  // onItemsPerPageChange() {
  //   this.currentPage = 1; // Reset to first page when changing items per page
  //   this.applyFilters();
  // }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Search method
  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Status methods
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

  // Summary methods
  getTotalLogs(): number {
    return this.allEmailLogs.length;
  }

  getCompletedCount(): number {
    return this.allEmailLogs.filter(log => log.status === 'COMPLETED').length;
  }

  getFailedCount(): number {
    return this.allEmailLogs.filter(log => log.status === 'FAILED').length;
  }

  getTotalSent(): number {
    return this.allEmailLogs.reduce((sum, log) => sum + (log.emailsSent || 0), 0);
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
      'COMPLETED': 'bg-success bg-opacity-10 text-success border border-success border-opacity-25',
      'PROCESSING': 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25',
      'FAILED': 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
    };
    return classes[status] || 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25';
  }
}