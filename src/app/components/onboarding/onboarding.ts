import { Component, OnInit } from '@angular/core';
import { OnboardingService, OnboardingEmailLog, OnboardingStatistics } from './../../services/onboarding.service';


import { Router } from '@angular/router';
//import { OnboardingService, OnboardingEmailLog, OnboardingStatistics } from './onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.html',
  styleUrls: ['./onboarding.css']
})
export class Onboarding implements OnInit {
  emailLogs: OnboardingEmailLog[] = [];
  statistics: OnboardingStatistics | null = null;
  loading = true;
  error = '';

  constructor(
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Load statistics
    this.onboardingService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.error = 'Failed to load statistics';
        console.error('Error loading statistics:', error);
      }
    });

    // Load email logs
    this.onboardingService.getEmailLogs().subscribe({
      next: (logs) => {
        this.emailLogs = logs;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load email logs';
        this.loading = false;
        console.error('Error loading email logs:', error);
      }
    });
  }

  refresh() {
    this.loadData();
  }

  viewEmployees() {
    this.router.navigate(['/app/onboarding/onboarded-employees']);
  }

  addEmployee() {
    this.router.navigate(['/app/onboarding/onboarded-employees/add']);
  }

  batchImport() {
    this.router.navigate(['/app/onboarding/onboarded-employees/batch/import']);
  }

  triggerOnboarding(batchId: number) {
    this.onboardingService.triggerOnboardingEmails(batchId).subscribe({
      next: (response) => {
        alert('Onboarding emails triggered successfully!');
        this.loadData();
      },
      error: (error) => {
        alert('Failed to trigger onboarding emails');
        console.error('Error triggering emails:', error);
      }
    });
  }

  resendFailedEmails(logId: number) {
    this.onboardingService.resendFailedEmails(logId).subscribe({
      next: (response) => {
        alert('Resending failed emails started!');
        this.loadData();
      },
      error: (error) => {
        alert('Failed to resend emails');
        console.error('Error resending emails:', error);
      }
    });
  }

  viewLogDetails(logId: number) {
    // Navigate to log details or open modal
    console.log('Viewing log details for:', logId);
    // You can implement a modal or separate page for this
  }

  // Safe getter for statistics to avoid template errors
  getStats() {
    return this.statistics || {
      totalOnboardingBatches: 0,
      completedBatches: 0,
      pendingBatches: 0,
      batchSuccessRate: '0%',
      totalEmailsSent: 0,
      totalEmailsFailed: 0,
      emailSuccessRate: '0%'
    };
  }

  // Helper method to format dates without DatePipe
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString(); // Simple formatting without DatePipe
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  }

  // Helper method for status badge classes
  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'processing':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}