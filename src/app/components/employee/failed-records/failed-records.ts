// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../environments/environment';

// export interface FailedRecord {
//   id: number;
//   employeeData: string;
//   errorMessage: string;
//   reason: string;
//   failedAt: string;
//   batchLogId: string;
// }

// @Component({
//   selector: 'app-failed-records',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './failed-records.html'
// })
// export class FailedRecordsComponent implements OnInit {
//   @Input() batchLogId: string = '';
//   @Input() showModal: boolean = false;
//   @Output() modalClosed = new EventEmitter<void>();

//   failedRecords: FailedRecord[] = [];
//   loading: boolean = false;
//   error: string = '';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     if (this.showModal && this.batchLogId) {
//       this.loadFailedRecords();
//     }
//   }

//   loadFailedRecords(): void {
//     this.loading = true;
//     this.error = '';
    
//     this.http.get<FailedRecord[]>(`${environment.apiBaseUrl}/failed-records/batch/${this.batchLogId}`)
//       .subscribe({
//         next: (response) => {
//           this.failedRecords = response;
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading failed records:', error);
//           this.loading = false;
//           this.error = 'Failed to load failed records. Please try again.';
//         }
//       });
//   }

//   close(): void {
//     this.modalClosed.emit();
//   }

//   downloadCSV(): void {
//     const csvContent = this.convertToCSV(this.failedRecords);
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `failed_records_batch_${this.batchLogId}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   }

//   private convertToCSV(records: FailedRecord[]): string {
//     const headers = ['Employee Data', 'Error Message', 'Reason', 'Failed At'];
//     const rows = records.map(record => [
//       record.employeeData,
//       record.errorMessage,
//       record.reason,
//       new Date(record.failedAt).toLocaleString()
//     ]);

//     return [headers, ...rows]
//       .map(row => row.map(field => `"${field}"`).join(','))
//       .join('\n');
//   }

//   getTotalFailed(): number {
//     return this.failedRecords.length;
//   }
// }



// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../environments/environment';

// export interface EmployeeData {
//   employeeId: string;
//   name: string;
//   email: string;
//   position: string;
//   status: string;
//   joinDate: string;
//   departmentId: number;
// }

// export interface FailedRecord {
//   id: number;
//   employeeData: string; // This is JSON string from backend
//   employeeDetails?: EmployeeData; // Parsed employee data
//   errorMessage: string;
//   reason: string;
//   failedAt: string;
//   batchLogId: number;
// }

// @Component({
//   selector: 'app-failed-records',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './failed-records.html'
// })
// export class FailedRecordsComponent implements OnInit {
//   @Input() batchLogId: string = '';
//   @Input() showModal: boolean = false;
//   @Output() modalClosed = new EventEmitter<void>();

//   failedRecords: FailedRecord[] = [];
//   loading: boolean = false;
//   error: string = '';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     if (this.showModal && this.batchLogId) {
//       this.loadFailedRecords();
//     }
//   }

//   loadFailedRecords(): void {
//     this.loading = true;
//     this.error = '';
    
//     const batchId = Number(this.batchLogId);
    
//     console.log('Loading failed records for batch ID:', batchId);
    
//     this.http.get<FailedRecord[]>(`${environment.apiBaseUrl}/failed-records/batch/${batchId}`)
//       .subscribe({
//         next: (response) => {
//           console.log('API Response:', response);
          
//           // Parse the employeeData JSON and add it as employeeDetails
//           this.failedRecords = response.map(record => ({
//             ...record,
//             employeeDetails: this.parseEmployeeData(record.employeeData)
//           }));
          
//           this.loading = false;
//           console.log('Processed failed records:', this.failedRecords);
//         },
//         error: (error) => {
//           console.error('Error loading failed records:', error);
//           this.loading = false;
//           this.error = 'Failed to load failed records. Please try again.';
//         }
//       });
//   }

//   private parseEmployeeData(employeeData: string): EmployeeData {
//     try {
//       return JSON.parse(employeeData);
//     } catch (error) {
//       console.error('Error parsing employee data:', error);
//       // Return a fallback object if parsing fails
//       return {
//         employeeId: 'N/A',
//         name: 'Parse Error',
//         email: 'N/A',
//         position: 'N/A',
//         status: 'N/A',
//         joinDate: 'N/A',
//         departmentId: 0
//       };
//     }
//   }

//   close(): void {
//     this.modalClosed.emit();
//   }

//   downloadCSV(): void {
//     const csvContent = this.convertToCSV(this.failedRecords);
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `failed_records_batch_${this.batchLogId}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   }

//   private convertToCSV(records: FailedRecord[]): string {
//     const headers = ['Employee ID', 'Name', 'Email', 'Position', 'Status', 'Join Date', 'Error Message', 'Reason', 'Failed At'];
//     const rows = records.map(record => [
//       record.employeeDetails?.employeeId || 'N/A',
//       record.employeeDetails?.name || 'N/A',
//       record.employeeDetails?.email || 'N/A',
//       record.employeeDetails?.position || 'N/A',
//       record.employeeDetails?.status || 'N/A',
//       record.employeeDetails?.joinDate || 'N/A',
//       record.errorMessage,
//       record.reason,
//       new Date(record.failedAt).toLocaleString()
//     ]);

//     return [headers, ...rows]
//       .map(row => row.map(field => `"${field}"`).join(','))
//       .join('\n');
//   }

//   getTotalFailed(): number {
//     return this.failedRecords.length;
//   }

//   // Helper method to format the employee data for display
//   formatEmployeeData(record: FailedRecord): string {
//     if (record.employeeDetails) {
//       const emp = record.employeeDetails;
//       return `${emp.employeeId}, ${emp.name}, ${emp.email}, ${emp.position}`;
//     }
//     return record.employeeData; // Fallback to raw data
//   }
// }











import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface FailedRecord {
  id: number;
  employeeData: string;
  errorMessage: string;
  reason: string;
  failedAt: string;
  batchLogId: number;
}

@Component({
  selector: 'app-failed-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './failed-records.html'
})
export class FailedRecordsComponent implements OnInit {
  @Input() batchLogId: string = '';
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();

  failedRecords: FailedRecord[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.showModal && this.batchLogId) {
      this.loadFailedRecords();
    }
  }

  loadFailedRecords(): void {
    this.loading = true;
    this.error = '';
    this.failedRecords = [];
    
    const batchId = Number(this.batchLogId);
    
    console.log('🔍 Loading failed records for batch ID:', batchId);
    console.log('📡 API URL:', `${environment.apiBaseUrl}/failed-records/batch/${batchId}`);
    
    this.http.get<FailedRecord[]>(`${environment.apiBaseUrl}/failed-records/batch/${batchId}`)
      .subscribe({
        next: (response) => {
          console.log('✅ API Response:', response);
          console.log('📊 Records found:', response.length);
          
          this.failedRecords = response;
          this.loading = false;
          
          console.log('🎯 Final failedRecords:', this.failedRecords);
          console.log('🎯 Final length:', this.failedRecords.length);
        },
        error: (error) => {
          console.error('❌ Error loading failed records:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          
          this.loading = false;
          this.error = 'Failed to load failed records. Please try again.';
        }
      });
  }

  getEmployeeDetails(record: FailedRecord): any {
    try {
      return JSON.parse(record.employeeData);
    } catch (error) {
      console.error('Error parsing employee data:', error);
      return null;
    }
  }

  close(): void {
    this.modalClosed.emit();
  }

  downloadCSV(): void {
    const csvContent = this.convertToCSV(this.failedRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `failed_records_batch_${this.batchLogId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(records: FailedRecord[]): string {
    const headers = ['Employee ID', 'Name', 'Email', 'Position', 'Error Message', 'Reason', 'Failed At'];
    const rows = records.map(record => {
      const employeeDetails = this.getEmployeeDetails(record);
      return [
        employeeDetails?.employeeId || 'N/A',
        employeeDetails?.name || 'N/A',
        employeeDetails?.email || 'N/A',
        employeeDetails?.position || 'N/A',
        record.errorMessage,
        record.reason,
        new Date(record.failedAt).toLocaleString()
      ];
    });

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  getTotalFailed(): number {
    return this.failedRecords.length;
  }
}