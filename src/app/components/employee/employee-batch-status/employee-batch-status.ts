

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { interval, Subscription } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { environment } from '../../../../environments/environment';
// import { FailedRecordsComponent } from '../failed-records/failed-records.component';

// interface BatchStatus {
//   id: string;
//   status: string;
//   totalCount: number;
//   processedCount: number;
//   failedCount: number;
//   createdAt: string;
//   completedAt?: string;
//   errorMessage?: string;
// }

// @Component({
//   selector: 'app-employee-batch-status',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FailedRecordsComponent], 
//   templateUrl: './employee-batch-status.html',
//   styleUrl: './employee-batch-status.css'
// })
// export class EmployeeBatchStatusComponent implements OnInit, OnDestroy {
//   batchLogId: string = '';
//   batchStatus: BatchStatus | null = null;
//   isLoading: boolean = true;
//   pollSubscription: Subscription | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.batchLogId = this.route.snapshot.paramMap.get('id') || '';
    
//     if (this.batchLogId) {
//       this.startPolling();
//     } else {
//       this.isLoading = false;
//     }
//   }

//   startPolling(): void {
//     this.pollSubscription = interval(2000) // Poll every 2 seconds
//       .pipe(
//         switchMap(() => this.http.get<BatchStatus>(`${environment.apiBaseUrl}/employees/batch/status/${this.batchLogId}`))
//       )
//       .subscribe({
//         next: (status) => {
//           this.batchStatus = status;
//           this.isLoading = false;

//           // Stop polling if job is completed
//           if (status.status === 'COMPLETED' || status.status === 'FAILED') {
//             this.stopPolling();
//           }
//         },
//         error: (error) => {
//           console.error('Error fetching batch status:', error);
//           this.isLoading = false;
//           this.stopPolling();
//         }
//       });
//   }

//   stopPolling(): void {
//     if (this.pollSubscription) {
//       this.pollSubscription.unsubscribe();
//       this.pollSubscription = null;
//     }
//   }

//   getProgressPercentage(): number {
//     if (!this.batchStatus || this.batchStatus.totalCount === 0) {
//       return 0;
//     }
//     return Math.round((this.batchStatus.processedCount / this.batchStatus.totalCount) * 100);
//   }

//   getStatusClass(): string {
//     if (!this.batchStatus) return '';
    
//     switch (this.batchStatus.status) {
//       case 'STARTED':
//       case 'PROCESSING':
//         return 'bg-warning';
//       case 'COMPLETED':
//         return 'bg-success';
//       case 'FAILED':
//         return 'bg-danger';
//       default:
//         return 'bg-secondary';
//     }
//   }

//   ngOnDestroy(): void {
//     this.stopPolling();
//   }
// }



import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FailedRecordsComponent } from '../failed-records/failed-records';

interface BatchStatus {
  id: string;
  status: string;
  totalCount: number;
  processedCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

@Component({
  selector: 'app-employee-batch-status',
  standalone: true,
  imports: [CommonModule, RouterModule, FailedRecordsComponent],
  templateUrl: './employee-batch-status.html',
  styleUrl: './employee-batch-status.css'
})
export class EmployeeBatchStatusComponent implements OnInit, OnDestroy {
  batchLogId: string = '';
  batchStatus: BatchStatus | null = null;
  isLoading: boolean = true;
  pollSubscription: Subscription | null = null;
  showFailedModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.batchLogId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.batchLogId) {
      this.startPolling();
    } else {
      this.isLoading = false;
    }
  }

  startPolling(): void {
    this.pollSubscription = interval(2000)
      .pipe(
        switchMap(() => this.http.get<BatchStatus>(`${environment.apiBaseUrl}/employees/batch/status/${this.batchLogId}`))
      )
      .subscribe({
        next: (status) => {
          this.batchStatus = status;
          this.isLoading = false;
          // Stop polling if job is completed
          if (status.status === 'COMPLETED' || status.status === 'FAILED') {
            this.stopPolling();
          }
        },
        error: (error) => {
          console.error('Error fetching batch status:', error);
          this.isLoading = false;
          this.stopPolling();
        }
      });
  }

  stopPolling(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      this.pollSubscription = null;
    }
  }

  getProgressPercentage(): number {
    if (!this.batchStatus || this.batchStatus.totalCount === 0) {
      return 0;
    }
    return Math.round((this.batchStatus.processedCount / this.batchStatus.totalCount) * 100);
  }

  getStatusClass(): string {
    if (!this.batchStatus) return '';
    
    switch (this.batchStatus.status) {
      case 'STARTED':
      case 'PROCESSING':
        return 'bg-warning';
      case 'COMPLETED':
        return 'bg-success';
      case 'FAILED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  hasFailedRecords(): boolean {
    return (this.batchStatus?.failedCount || 0) > 0;
  }

  viewFailedRecords(): void {
    this.showFailedModal = true;
  }

  onFailedModalClosed(): void {
    this.showFailedModal = false;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}