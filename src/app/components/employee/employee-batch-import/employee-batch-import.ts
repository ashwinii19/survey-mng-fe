



// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { HttpClient, HttpEventType } from '@angular/common/http';
// import { environment } from '../../../../environments/environment';

// @Component({
//   selector: 'app-employee-batch-import',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './employee-batch-import.html',
//   styleUrl: './employee-batch-import.css'
// })
// export class EmployeeBatchImportComponent {
//   selectedFile: File | null = null;
//   isUploading: boolean = false;
//   uploadProgress: number = 0;
//   uploadMessage: string = '';
//   uploadSuccess: boolean = false;
//   batchLogId: string | null = null;
//   totalRecords: number = 0;
//   sendWelcomeEmail: boolean = false;

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
    
//     if (file) {
//       // Validate file type
//       if (!file.name.toLowerCase().endsWith('.csv')) {
//         this.uploadMessage = 'Only CSV files are allowed';
//         this.uploadSuccess = false;
//         this.selectedFile = null;
//         this.clearFileInput();
//         return;
//       }

//       // Validate file size (max 10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         this.uploadMessage = 'File size must be less than 10MB';
//         this.uploadSuccess = false;
//         this.selectedFile = null;
//         this.clearFileInput();
//         return;
//       }

//       this.selectedFile = file;
//       this.uploadMessage = '';
//       this.uploadSuccess = false;
//       this.uploadProgress = 0;
//       this.batchLogId = null;
//       this.totalRecords = 0;
//     }
//   }

//   onUpload(): void {
//     if (!this.selectedFile) {
//       this.uploadMessage = 'Please select a file first';
//       this.uploadSuccess = false;
//       return;
//     }

//     this.isUploading = true;
//     this.uploadProgress = 0;
//     this.uploadMessage = 'Uploading and processing file...';
//     this.uploadSuccess = false;

//     const formData = new FormData();
//     formData.append('file', this.selectedFile);

//     this.http.post<any>(`${environment.apiBaseUrl}/employees/batch/import`, formData, {
//       reportProgress: true,
//       observe: 'events'
//     }).subscribe({
//       next: (event: any) => {
//         if (event.type === HttpEventType.UploadProgress) {
//           // Update progress during upload (only for upload phase)
//           if (event.total) {
//             this.uploadProgress = Math.round(100 * event.loaded / event.total);
//           }
//         } else if (event.type === HttpEventType.Response) {
//           // Upload complete
//           this.isUploading = false;
//           this.uploadProgress = 100;
//           this.uploadSuccess = true;
//           this.uploadMessage = event.body.message || 'File uploaded successfully!';
//           this.batchLogId = event.body.batchLogId;
//           this.totalRecords = event.body.totalRecords || 0;
          
//           // Auto-redirect to batch status page after 3 seconds if batchLogId exists
//           if (this.batchLogId) {
//             setTimeout(() => {
//               this.router.navigate(['/app/employees/batch/status', this.batchLogId]);
//             }, 3000);
//           }
//         }
//       },
//       error: (error) => {
//         this.isUploading = false;
//         this.uploadSuccess = false;
//         this.uploadProgress = 0;
        
//         if (error.status === 413) {
//           this.uploadMessage = 'File is too large. Please try a smaller file (max 10MB).';
//         } else if (error.status === 400) {
//           this.uploadMessage = error.error?.message || 'Invalid file format. Please check the CSV structure.';
//         } else if (error.status === 415) {
//           this.uploadMessage = 'Unsupported file type. Only CSV files are allowed.';
//         } else if (error.status === 500) {
//           this.uploadMessage = 'Server error. Please try again later.';
//         } else if (error.status === 0) {
//           this.uploadMessage = 'Unable to connect to server. Please check your connection.';
//         } else {
//           this.uploadMessage = error.error?.message || 'Upload failed. Please try again.';
//         }
        
//         console.error('Upload error:', error);
        
//         // Reset file selection on error
//         this.selectedFile = null;
//         this.clearFileInput();
//       }
//     });
//   }

//   onCancel(): void {
//     if (this.isUploading) {
//       // You might want to implement cancel logic for ongoing uploads
//       console.log('Upload cancelled by user');
//     }
//     this.router.navigate(['/app/employees']);
//   }

//   downloadTemplate(): void {
//     const template = `employeeId,name,email,position,department,status,joinDate
// EMP001,John Doe,john.doe@company.com,Software Engineer,Engineering,Active,2024-01-15
// EMP002,Jane Smith,jane.smith@company.com,Product Manager,Product,Active,2024-01-20
// EMP003,Bob Johnson,bob.johnson@company.com,HR Specialist,HR,Active,2024-02-01
// EMP004,Alice Brown,alice.brown@company.com,UX Designer,Design,Active,2024-02-10
// EMP005,Charlie Wilson,charlie.wilson@company.com,Data Analyst,Analytics,Inactive,2024-02-15

// # Instructions:
// # - Keep the header row as is
// # - employeeId must be unique
// # - status must be either "Active" or "Inactive"
// # - joinDate format: YYYY-MM-DD
// # - department must match existing departments in system
// # - email must be valid and unique
// # - All fields are required`;

//     const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'employee_import_template.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   }

//   // Clear the selected file
//   clearFile(): void {
//     this.selectedFile = null;
//     this.uploadMessage = '';
//     this.uploadProgress = 0;
//     this.batchLogId = null;
//     this.totalRecords = 0;
//     this.clearFileInput();
//   }

//   // Helper method to clear file input
//   private clearFileInput(): void {
//     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   // Get file size in readable format
//   getFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
    
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
    
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   // Check if upload can proceed
//   canUpload(): boolean {
//     return !this.isUploading && !!this.selectedFile;
//   }

//   // Check if file is selected
//   hasFileSelected(): boolean {
//     return !!this.selectedFile;
//   }
// }





import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // ADD ActivatedRoute
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-employee-batch-import',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-batch-import.html',
  styleUrl: './employee-batch-import.css'
})
export class EmployeeBatchImportComponent {
  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadMessage: string = '';
  uploadSuccess: boolean = false;
  batchLogId: string | null = null;
  totalRecords: number = 0;
  sendWelcomeEmail: boolean = false; // This will be set based on route
  isOnboardingFlow: boolean = false; // ADD THIS

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // ADD THIS
  ) {}

  ngOnInit(): void {
    // CHECK IF ACCESSED FROM ONBOARDING
    this.route.queryParams.subscribe(params => {
      this.isOnboardingFlow = params['onboarding'] === 'true';
      this.sendWelcomeEmail = this.isOnboardingFlow; // TRUE for onboarding, FALSE for regular
      
      console.log('Batch import mode:', this.isOnboardingFlow ? 'ONBOARDING' : 'REGULAR');
      console.log('Send welcome email:', this.sendWelcomeEmail);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        this.uploadMessage = 'Only CSV files are allowed';
        this.uploadSuccess = false;
        this.selectedFile = null;
        this.clearFileInput();
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.uploadMessage = 'File size must be less than 10MB';
        this.uploadSuccess = false;
        this.selectedFile = null;
        this.clearFileInput();
        return;
      }

      this.selectedFile = file;
      this.uploadMessage = '';
      this.uploadSuccess = false;
      this.uploadProgress = 0;
      this.batchLogId = null;
      this.totalRecords = 0;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a file first';
      this.uploadSuccess = false;
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadMessage = 'Uploading and processing file...';
    this.uploadSuccess = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('sendWelcomeEmail', this.sendWelcomeEmail.toString()); // ADD THIS

    this.http.post<any>(`${environment.apiBaseUrl}/employees/batch/import`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update progress during upload (only for upload phase)
          if (event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          // Upload complete
          this.isUploading = false;
          this.uploadProgress = 100;
          this.uploadSuccess = true;
          this.uploadMessage = event.body.message || 'File uploaded successfully!';
          this.batchLogId = event.body.batchLogId;
          this.totalRecords = event.body.totalRecords || 0;
          
          // Auto-redirect to batch status page after 3 seconds if batchLogId exists
          if (this.batchLogId) {
            setTimeout(() => {
              this.router.navigate(['/app/employees/batch/status', this.batchLogId]);
            }, 3000);
          }
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadSuccess = false;
        this.uploadProgress = 0;
        
        if (error.status === 413) {
          this.uploadMessage = 'File is too large. Please try a smaller file (max 10MB).';
        } else if (error.status === 400) {
          this.uploadMessage = error.error?.message || 'Invalid file format. Please check the CSV structure.';
        } else if (error.status === 415) {
          this.uploadMessage = 'Unsupported file type. Only CSV files are allowed.';
        } else if (error.status === 500) {
          this.uploadMessage = 'Server error. Please try again later.';
        } else if (error.status === 0) {
          this.uploadMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          this.uploadMessage = error.error?.message || 'Upload failed. Please try again.';
        }
        
        console.error('Upload error:', error);
        
        // Reset file selection on error
        this.selectedFile = null;
        this.clearFileInput();
      }
    });
  }

  onCancel(): void {
    if (this.isUploading) {
      // You might want to implement cancel logic for ongoing uploads
      console.log('Upload cancelled by user');
    }
    
    // REDIRECT BASED ON FLOW
    if (this.isOnboardingFlow) {
      this.router.navigate(['/app/onboarding']);
    } else {
      this.router.navigate(['/app/employees']);
    }
  }

  // ... rest of your methods remain the same
  downloadTemplate(): void {
    const template = `employeeId,name,email,position,department,status,joinDate
EMP001,John Doe,john.doe@company.com,Software Engineer,Engineering,Active,2024-01-15
EMP002,Jane Smith,jane.smith@company.com,Product Manager,Product,Active,2024-01-20
EMP003,Bob Johnson,bob.johnson@company.com,HR Specialist,HR,Active,2024-02-01
EMP004,Alice Brown,alice.brown@company.com,UX Designer,Design,Active,2024-02-10
EMP005,Charlie Wilson,charlie.wilson@company.com,Data Analyst,Analytics,Inactive,2024-02-15

# Instructions:
# - Keep the header row as is
# - employeeId must be unique
# - status must be either "Active" or "Inactive"
# - joinDate format: YYYY-MM-DD
# - department must match existing departments in system
# - email must be valid and unique
# - All fields are required`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Clear the selected file
  clearFile(): void {
    this.selectedFile = null;
    this.uploadMessage = '';
    this.uploadProgress = 0;
    this.batchLogId = null;
    this.totalRecords = 0;
    this.clearFileInput();
  }

  // Helper method to clear file input
  private clearFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Get file size in readable format
  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if upload can proceed
  canUpload(): boolean {
    return !this.isUploading && !!this.selectedFile;
  }

  // Check if file is selected
  hasFileSelected(): boolean {
    return !!this.selectedFile;
  }
}