









// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';

// // import { Sidebar } from '../../layout/sidebar/sidebar';
// // import Header from '../../layout/header/header';

// // import { CardsPanel } from '../cards-panel/cards-panel';
// // import { FiltersPanel } from '../filters-panel/filters-panel';
// // import DepartmentCharts from '../department-charts/department-charts';
// // import SurveyCharts from '../survey-charts/survey-charts';

// // import { DashboardService } from '../../services/dashboard.service';
// // import { DashboardResponse } from '../../models/dashboard-response';

// // import jsPDF from 'jspdf';
// // import html2canvas from 'html2canvas';

// // @Component({
// //   selector: 'app-dashboard-root',
// //   standalone: true,
// //   imports: [
// //     CommonModule, FormsModule,
// //     Sidebar, Header,
// //     CardsPanel, FiltersPanel,
// //     DepartmentCharts, SurveyCharts
// //   ],
// //   templateUrl: './dashboard-root.html',
// //   styleUrls: ['./dashboard-root.css']
// // })
// // export default class DashboardRoot implements OnInit {

// //   dashboard?: DashboardResponse;
// //   filteredDashboard?: DashboardResponse; // ADDED: For filtered data

// //   surveys: any[] = [];
// //   departments: any[] = [];

// //   selectedSurveyId?: number;
// //   selectedDepartmentId?: number;

  
// //   showFilteredData: boolean = false;
// //   showUnassignedAlert: boolean = false;
// //   hasAssignedFeedback: boolean = false;
// //   totalEmployees: number = 0;
// //   submittedCount: number = 0;
// //   remainingCount: number = 0;
// //   submissionRate: number = 0;
  
  
// //   exportSuccess: boolean = false;
// //   exportMessage: string = '';
// //   isExporting: boolean = false;

// //   constructor(private svc: DashboardService) {}

// //   ngOnInit(): void {
// //     this.waitForAuth();
// //   }

// //   private waitForAuth() {
// //     const timer = setInterval(() => {
// //       if (localStorage.getItem("authToken")) {
// //         clearInterval(timer);
// //         this.loadFilters();
// //       }
// //     }, 300);
// //   }

 
// //   loadFilters() {
// //     this.svc.getSurveys().subscribe(res => {
// //       this.surveys = res;
      
// //       // Auto-select the first survey by default
// //       if (this.surveys.length > 0 && !this.selectedSurveyId) {
// //         this.selectedSurveyId = this.surveys[0].id || this.surveys[0].surveyId;
// //         console.log('Auto-selected first survey:', this.selectedSurveyId);
        
// //         // Set showFilteredData to true since we have a survey selected
// //         this.showFilteredData = true;
// //       }
      
// //       // Load dashboard after surveys are loaded and default is set
// //       this.loadDashboard();
// //     });
    
// //     this.svc.getDepartments().subscribe(res => {
// //       this.departments = res;
// //       console.log('=== LOADED DEPARTMENTS ===', res);
// //     });
// //   }

 
// //   loadDashboard() {
// //     console.log('=== LOADING DASHBOARD ===');
// //     console.log('Calling API with - Survey ID:', this.selectedSurveyId, 'Department ID:', this.selectedDepartmentId);
    
// //     this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
// //       .subscribe({
// //         next: (res) => {
// //           this.dashboard = res;
// //           console.log('=== DASHBOARD API RESPONSE ===');
          
// //           // FILTER DATA FOR "ALL DEPARTMENTS" CASE
// //           this.filterDashboardData();
          
// //           // Check if survey is assigned to the selected department
// //           this.checkSurveyAssignment();
// //           this.calculateSubmissionStats();
// //         },
// //         error: (error) => {
// //           console.error('=== DASHBOARD API ERROR ===', error);
// //         }
// //       });
// //   }

// //   // NEW METHOD: Filter dashboard data for "All Departments"
// //   private filterDashboardData() {
// //     if (!this.dashboard) return;

// //     // Reset filtered dashboard
// //     this.filteredDashboard = undefined;

// //     // If specific department is selected OR no survey selected, use original data
// //     if (this.selectedDepartmentId || !this.selectedSurveyId) {
// //       return;
// //     }

// //     // For "All Departments" case - filter data to show only assigned departments
// //     const selectedSurvey = this.surveys.find(s => 
// //       s.id === this.selectedSurveyId || s.surveyId === this.selectedSurveyId
// //     );

// //     if (!selectedSurvey || !selectedSurvey.targetDepartment || !selectedSurvey.targetDepartment.name) {
// //       return;
// //     }

// //     const assignedDeptName = selectedSurvey.targetDepartment.name;
// //     console.log('=== FILTERING DATA FOR ALL DEPARTMENTS ===');
// //     console.log('Assigned department:', assignedDeptName);

// //     // Create filtered dashboard data
// //     this.filteredDashboard = { ...this.dashboard };

// //     // Filter departmentStats to only show assigned department
// //     if (this.filteredDashboard.departmentStats) {
// //       this.filteredDashboard.departmentStats = this.filteredDashboard.departmentStats.filter(
// //         (dept: any) => {
// //           const deptName = dept.name || dept.departmentName || dept.department || '';
// //           const matches = deptName.toLowerCase() === assignedDeptName.toLowerCase();
// //           console.log('Checking department:', deptName, 'matches assigned:', matches);
// //           return matches;
// //         }
// //       );
// //     }

// //     // Recalculate totals based on filtered department stats
// //     if (this.filteredDashboard.departmentStats && this.filteredDashboard.departmentStats.length > 0) {
// //       const assignedDeptData = this.filteredDashboard.departmentStats[0];
// //       this.filteredDashboard.totalEmployees = assignedDeptData.totalEmployees || 0;
// //       this.filteredDashboard.totalSubmitted = assignedDeptData.submittedCount || 0;
// //       this.filteredDashboard.totalPending = assignedDeptData.pendingCount || 0;
// //     } else {
// //       // If no matching department found in stats, set totals to zero
// //       this.filteredDashboard.totalEmployees = 0;
// //       this.filteredDashboard.totalSubmitted = 0;
// //       this.filteredDashboard.totalPending = 0;
// //     }

// //     console.log('Filtered dashboard:', this.filteredDashboard);
// //   }

// //   // Get the dashboard data to display (original or filtered)
// //   private getDisplayDashboard(): DashboardResponse | undefined {
// //     return this.filteredDashboard || this.dashboard;
// //   }

// //   onFilterChange() {
// //     this.showFilteredData = !!this.selectedSurveyId || !!this.selectedDepartmentId;
// //     this.showUnassignedAlert = false;
// //     this.loadDashboard();
// //   }

// //   private checkSurveyAssignment() {
// //     const displayDashboard = this.getDisplayDashboard();
    
// //     if (!displayDashboard) {
// //       this.hasAssignedFeedback = false;
// //       if (this.showFilteredData) {
// //         this.showUnassignedAlert = true;
// //       }
// //       return;
// //     }

// //     // Check if survey is actually assigned to the selected department
// //     const isSurveyAssigned = this.isSurveyAssignedToDepartment();
    
// //     console.log('=== SURVEY ASSIGNMENT RESULT ===');
// //     console.log('Is survey assigned?', isSurveyAssigned);
// //     console.log('Show filtered data?', this.showFilteredData);
    
// //     if (!isSurveyAssigned && this.showFilteredData) {
// //       this.hasAssignedFeedback = false;
// //       this.showUnassignedAlert = true;
// //       console.log('=== SHOWING UNASSIGNED ALERT ===');
// //     } else {
// //       this.hasAssignedFeedback = true;
// //       this.showUnassignedAlert = false;
// //       console.log('=== SHOWING ANALYTICS DATA ===');
// //     }
// //   }
// // private isSurveyAssignedToDepartment(): boolean {
// //   const displayDashboard = this.getDisplayDashboard();
  
// //   if (!displayDashboard) {
// //     console.log('No dashboard data available');
// //     return false;
// //   }

// //   console.log('=== DEBUG: Checking Survey Assignment ===');
// //   console.log('Selected Department ID:', this.selectedDepartmentId);
// //   console.log('Selected Department Name:', this.getSelectedDepartmentName());
// //   console.log('Dashboard Data:', displayDashboard);

// //   // Get the selected survey
// //   const selectedSurvey = this.surveys.find(s => 
// //     s.id === this.selectedSurveyId || s.surveyId === this.selectedSurveyId
// //   );

// //   // If no department is selected ("All Departments" case)
// //   if (!this.selectedDepartmentId) {
// //     console.log('=== ALL DEPARTMENTS SELECTED ===');
    
// //     // For "All Departments", check if we have filtered data (meaning assigned department has data)
// //     const hasFilteredData = !!(this.filteredDashboard && 
// //       this.filteredDashboard.departmentStats && 
// //       this.filteredDashboard.departmentStats.length > 0);
    
// //     console.log('Has filtered data for assigned department:', hasFilteredData);
// //     return hasFilteredData;
// //   }

// //   // Specific department is selected
// //   const selectedDeptName = this.getSelectedDepartmentName();
  
// //   if (!selectedDeptName) {
// //     console.log('Could not find department name for selected ID:', this.selectedDepartmentId);
// //     return false;
// //   }

// //   // Check if survey belongs to selected department (same as RemindersComponent logic)
// //   if (selectedSurvey && selectedSurvey.targetDepartment && selectedSurvey.targetDepartment.name) {
// //     const assignedDept = selectedSurvey.targetDepartment.name;
    
// //     // If the selected department doesn't match the survey's assigned department, return false
// //     if (selectedDeptName !== assignedDept) {
// //       console.log(`❌ Survey belongs to department: ${assignedDept}, but selected: ${selectedDeptName}`);
// //       return false;
// //     }
    
// //     console.log(`✅ Survey belongs to selected department: ${selectedDeptName}`);
// //     return true;
// //   }

// //   // Fallback to department stats check if targetDepartment is not available
// //   return this.checkDepartmentStatsFallback(selectedDeptName, displayDashboard);
// // }
// //   private checkDepartmentStatsFallback(selectedDeptName: string, displayDashboard: DashboardResponse): boolean {
// //     // If departmentStats is empty, it means NO departments have this survey assigned
// //     if (!displayDashboard.departmentStats || displayDashboard.departmentStats.length === 0) {
// //       console.log('❌ No department stats available - survey not assigned to any department');
// //       return false;
// //     }

// //     // Check if selected department exists in departmentStats
// //     const departmentData = displayDashboard.departmentStats.find(
// //       (dept: any) => {
// //         const deptAny = dept as any;
// //         const deptName = deptAny.name || deptAny.departmentName || deptAny.department || '';
// //         const matches = deptName.toLowerCase() === selectedDeptName.toLowerCase();
// //         return matches;
// //       }
// //     );
    
// //     if (departmentData) {
// //       console.log('✅ Department found in departmentStats - survey IS assigned');
// //       return true;
// //     } else {
// //       console.log('❌ Department NOT found in departmentStats - survey NOT assigned');
// //       return false;
// //     }
// //   }

// //   private getSelectedDepartmentName(): string {
// //     if (!this.selectedDepartmentId) return '';
    
// //     const department = this.departments.find(dept => 
// //       dept.id == this.selectedDepartmentId || 
// //       dept.departmentId == this.selectedDepartmentId
// //     );
    
// //     return department ? (department.name || department.departmentName || '') : '';
// //   }

// //   private calculateSubmissionStats() {
// //     const displayDashboard = this.getDisplayDashboard();
    
// //     if (displayDashboard && this.hasAssignedFeedback) {
// //       this.submittedCount = displayDashboard.totalSubmitted || 0;
// //       this.remainingCount = displayDashboard.totalPending || 0;
// //       this.totalEmployees = this.submittedCount + this.remainingCount;
// //       this.submissionRate = this.totalEmployees > 0 
// //         ? Math.round((this.submittedCount / this.totalEmployees) * 100) 
// //         : 0;
// //     } else {
// //       this.submittedCount = 0;
// //       this.remainingCount = 0;
// //       this.totalEmployees = 0;
// //       this.submissionRate = 0;
// //     }
// //   }

// //   async exportPDF() {
// //     if (!this.showFilteredData || !this.hasAssignedFeedback) {
// //       this.exportMessage = 'Please select a survey that is assigned to this department to export data';
// //       this.exportSuccess = false;
// //       return;
// //     }

// //     this.isExporting = true;
    
// //     try {
// //       const element = document.querySelector('.content') as HTMLElement;
      
// //       if (!element) {
// //         throw new Error('Could not find dashboard content');
// //       }

// //       const canvas = await html2canvas(element, {
// //         scale: 2, 
// //         useCORS: true,
// //         logging: false,
// //         backgroundColor: '#ffffff'
// //       });

// //       const imgData = canvas.toDataURL('image/png');
      
// //       const pdf = new jsPDF('p', 'mm', 'a4');
// //       const imgWidth = 210; 
// //       const pageHeight = 295; 
// //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// //       let heightLeft = imgHeight;
// //       let position = 0;

// //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //       heightLeft -= pageHeight;

// //       while (heightLeft >= 0) {
// //         position = heightLeft - imgHeight;
// //         pdf.addPage();
// //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //         heightLeft -= pageHeight;
// //       }

// //       const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
// //       const filename = `Survey-Dashboard-${timestamp}.pdf`;
      
// //       pdf.save(filename);
      
// //       this.exportSuccess = true;
// //       this.exportMessage = 'PDF downloaded successfully!';
      
// //     } catch (error) {
// //       console.error('PDF export error:', error);
// //       this.exportSuccess = false;
// //       this.exportMessage = 'Failed to export PDF. Please try again.';
// //     } finally {
// //       this.isExporting = false;
// //       setTimeout(() => {
// //         this.exportSuccess = false;
// //         this.exportMessage = '';
// //       }, 5000);
// //     }
// //   }

// //   async exportPPT() {
// //     if (!this.showFilteredData || !this.hasAssignedFeedback) {
// //       this.exportMessage = 'Please select a survey that is assigned to this department to export data';
// //       this.exportSuccess = false;
// //       return;
// //     }

// //     this.isExporting = true;
    
// //     try {
// //       // Simple PPT implementation without external library for now
// //       this.exportMessage = 'PPT export is temporarily unavailable. Please use PDF or CSV export.';
// //       this.exportSuccess = false;
      
// //     } catch (error) {
// //       console.error('PPT export error:', error);
// //       this.exportSuccess = false;
// //       this.exportMessage = 'Failed to export PowerPoint. Please try PDF export instead.';
// //     } finally {
// //       this.isExporting = false;
// //       setTimeout(() => {
// //         this.exportSuccess = false;
// //         this.exportMessage = '';
// //       }, 5000);
// //     }
// //   }

  
// //   exportCSV() {
// //     const displayDashboard = this.getDisplayDashboard();
    
// //     if (!displayDashboard || !this.hasAssignedFeedback) {
// //       this.exportMessage = 'No survey data available for the selected department';
// //       this.exportSuccess = false;
// //       return;
// //     }

// //     try {
// //       let csvContent = 'Survey Dashboard Export\n\n';
// //       csvContent += 'Metric,Value\n';
// //       csvContent += `Total Employees,${this.totalEmployees}\n`;
// //       csvContent += `Submitted,${this.submittedCount}\n`;
// //       csvContent += `Remaining,${this.remainingCount}\n`;
// //       csvContent += `Submission Rate,${this.submissionRate}%\n\n`;
      
// //       if (displayDashboard.departmentStats?.length) {
// //         csvContent += 'Department,Response Rate\n';
// //         displayDashboard.departmentStats.forEach((dept: any) => {
// //           const deptAny = dept as any;
// //           const deptName = deptAny.name || deptAny.departmentName || deptAny.department || 'Unknown Department';
// //           const responseRate = deptAny.responseRate || deptAny.rate || deptAny.percentage || 0;
// //           csvContent += `${deptName},${responseRate}%\n`;
// //         });
// //       }

// //       const blob = new Blob([csvContent], { type: 'text/csv' });
// //       const url = window.URL.createObjectURL(blob);
// //       const link = document.createElement('a');
// //       const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
// //       link.href = url;
// //       link.download = `Survey-Data-${timestamp}.csv`;
// //       link.click();
      
// //       window.URL.revokeObjectURL(url);
      
// //       this.exportSuccess = true;
// //       this.exportMessage = 'CSV downloaded successfully!';
      
// //     } catch (error) {
// //       console.error('CSV export error:', error);
// //       this.exportSuccess = false;
// //       this.exportMessage = 'Failed to export CSV. Please try again.';
// //     } finally {
// //       setTimeout(() => {
// //         this.exportSuccess = false;
// //         this.exportMessage = '';
// //       }, 5000);
// //     }
// //   }
// // }







// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { Sidebar } from '../../layout/sidebar/sidebar';
// import Header from '../../layout/header/header';

// import { CardsPanel } from '../cards-panel/cards-panel';
// import { FiltersPanel } from '../filters-panel/filters-panel';
// import DepartmentCharts from '../department-charts/department-charts';
// import SurveyCharts from '../survey-charts/survey-charts';

// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardResponse } from '../../models/dashboard-response';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import pptxgen from 'pptxgenjs';

// @Component({
//   selector: 'app-dashboard-root',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule,
//     Sidebar, Header,
//     CardsPanel, FiltersPanel,
//     DepartmentCharts, SurveyCharts
//   ],
//   templateUrl: './dashboard-root.html',
//   styleUrls: ['./dashboard-root.css']
// })
// export default class DashboardRoot implements OnInit {

//   dashboard?: DashboardResponse;
//   filteredDashboard?: DashboardResponse;

//   surveys: any[] = [];
//   departments: any[] = [];

//   selectedSurveyId?: number;
//   selectedDepartmentId?: number;

  
//   showFilteredData: boolean = false;
//   showUnassignedAlert: boolean = false;
//   hasAssignedFeedback: boolean = false;
//   totalEmployees: number = 0;
//   submittedCount: number = 0;
//   remainingCount: number = 0;
//   submissionRate: number = 0;
  
  
//   exportSuccess: boolean = false;
//   exportMessage: string = '';
//   isExporting: boolean = false;

//   constructor(private svc: DashboardService) {}

//   ngOnInit(): void {
//     this.waitForAuth();
//   }

//   private waitForAuth() {
//     const timer = setInterval(() => {
//       if (localStorage.getItem("authToken")) {
//         clearInterval(timer);
//         this.loadFilters();
//       }
//     }, 300);
//   }

 
//   loadFilters() {
//     this.svc.getSurveys().subscribe(res => {
//       this.surveys = res;
      
//       if (this.surveys.length > 0 && !this.selectedSurveyId) {
//         this.selectedSurveyId = this.surveys[0].id || this.surveys[0].surveyId;
//         console.log('Auto-selected first survey:', this.selectedSurveyId);
//         this.showFilteredData = true;
//       }
      
//       this.loadDashboard();
//     });
    
//     this.svc.getDepartments().subscribe(res => {
//       this.departments = res;
//     });
//   }

 
//   loadDashboard() {
//     console.log('=== LOADING DASHBOARD ===');
    
//     this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe({
//         next: (res) => {
//           this.dashboard = res;
//           this.filterDashboardData();
//           this.checkSurveyAssignment();
//           this.calculateSubmissionStats();
//         },
//         error: (error) => {
//           console.error('=== DASHBOARD API ERROR ===', error);
//         }
//       });
//   }

//   private filterDashboardData() {
//     if (!this.dashboard) return;
//     this.filteredDashboard = undefined;

//     if (this.selectedDepartmentId || !this.selectedSurveyId) {
//       return;
//     }

//     const selectedSurvey = this.surveys.find(s => 
//       s.id === this.selectedSurveyId || s.surveyId === this.selectedSurveyId
//     );

//     if (!selectedSurvey || !selectedSurvey.targetDepartment || !selectedSurvey.targetDepartment.name) {
//       return;
//     }

//     const assignedDeptName = selectedSurvey.targetDepartment.name;
//     this.filteredDashboard = { ...this.dashboard };

//     if (this.filteredDashboard.departmentStats) {
//       this.filteredDashboard.departmentStats = this.filteredDashboard.departmentStats.filter(
//         (dept: any) => {
//           const deptName = dept.name || dept.departmentName || dept.department || '';
//           return deptName.toLowerCase() === assignedDeptName.toLowerCase();
//         }
//       );
//     }

//     if (this.filteredDashboard.departmentStats && this.filteredDashboard.departmentStats.length > 0) {
//       const assignedDeptData = this.filteredDashboard.departmentStats[0];
//       this.filteredDashboard.totalEmployees = assignedDeptData.totalEmployees || 0;
//       this.filteredDashboard.totalSubmitted = assignedDeptData.submittedCount || 0;
//       this.filteredDashboard.totalPending = assignedDeptData.pendingCount || 0;
//     } else {
//       this.filteredDashboard.totalEmployees = 0;
//       this.filteredDashboard.totalSubmitted = 0;
//       this.filteredDashboard.totalPending = 0;
//     }
//   }

//   private getDisplayDashboard(): DashboardResponse | undefined {
//     return this.filteredDashboard || this.dashboard;
//   }

//   onFilterChange() {
//     this.showFilteredData = !!this.selectedSurveyId || !!this.selectedDepartmentId;
//     this.showUnassignedAlert = false;
//     this.loadDashboard();
//   }

//   private checkSurveyAssignment() {
//     const displayDashboard = this.getDisplayDashboard();
    
//     if (!displayDashboard) {
//       this.hasAssignedFeedback = false;
//       if (this.showFilteredData) {
//         this.showUnassignedAlert = true;
//       }
//       return;
//     }

//     const isSurveyAssigned = this.isSurveyAssignedToDepartment();
    
//     if (!isSurveyAssigned && this.showFilteredData) {
//       this.hasAssignedFeedback = false;
//       this.showUnassignedAlert = true;
//     } else {
//       this.hasAssignedFeedback = true;
//       this.showUnassignedAlert = false;
//     }
//   }

//   private isSurveyAssignedToDepartment(): boolean {
//     const displayDashboard = this.getDisplayDashboard();
    
//     if (!displayDashboard) {
//       return false;
//     }

//     const selectedSurvey = this.surveys.find(s => 
//       s.id === this.selectedSurveyId || s.surveyId === this.selectedSurveyId
//     );

//     if (!this.selectedDepartmentId) {
//       const hasFilteredData = !!(this.filteredDashboard && 
//         this.filteredDashboard.departmentStats && 
//         this.filteredDashboard.departmentStats.length > 0);
//       return hasFilteredData;
//     }

//     const selectedDeptName = this.getSelectedDepartmentName();
    
//     if (!selectedDeptName) {
//       return false;
//     }

//     if (selectedSurvey && selectedSurvey.targetDepartment && selectedSurvey.targetDepartment.name) {
//       const assignedDept = selectedSurvey.targetDepartment.name;
//       return selectedDeptName === assignedDept;
//     }

//     return this.checkDepartmentStatsFallback(selectedDeptName, displayDashboard);
//   }

//   private checkDepartmentStatsFallback(selectedDeptName: string, displayDashboard: DashboardResponse): boolean {
//     if (!displayDashboard.departmentStats || displayDashboard.departmentStats.length === 0) {
//       return false;
//     }

//     const departmentData = displayDashboard.departmentStats.find(
//       (dept: any) => {
//         const deptAny = dept as any;
//         const deptName = deptAny.name || deptAny.departmentName || deptAny.department || '';
//         return deptName.toLowerCase() === selectedDeptName.toLowerCase();
//       }
//     );
    
//     return !!departmentData;
//   }

//   private getSelectedDepartmentName(): string {
//     if (!this.selectedDepartmentId) return '';
    
//     const department = this.departments.find(dept => 
//       dept.id == this.selectedDepartmentId || 
//       dept.departmentId == this.selectedDepartmentId
//     );
    
//     return department ? (department.name || department.departmentName || '') : '';
//   }

//   private calculateSubmissionStats() {
//     const displayDashboard = this.getDisplayDashboard();
    
//     if (displayDashboard && this.hasAssignedFeedback) {
//       this.submittedCount = displayDashboard.totalSubmitted || 0;
//       this.remainingCount = displayDashboard.totalPending || 0;
//       this.totalEmployees = this.submittedCount + this.remainingCount;
//       this.submissionRate = this.totalEmployees > 0 
//         ? Math.round((this.submittedCount / this.totalEmployees) * 100) 
//         : 0;
//     } else {
//       this.submittedCount = 0;
//       this.remainingCount = 0;
//       this.totalEmployees = 0;
//       this.submissionRate = 0;
//     }
//   }

//   async exportPDF() {
//     if (!this.showFilteredData || !this.hasAssignedFeedback) {
//       this.exportMessage = 'Please select a survey that is assigned to this department to export data';
//       this.exportSuccess = false;
//       return;
//     }

//     this.isExporting = true;
    
//     try {
//       const element = document.querySelector('.content') as HTMLElement;
      
//       if (!element) {
//         throw new Error('Could not find dashboard content');
//       }

//       const canvas = await html2canvas(element, {
//         scale: 2, 
//         useCORS: true,
//         logging: false,
//         backgroundColor: '#ffffff'
//       });

//       const imgData = canvas.toDataURL('image/png');
      
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210; 
//       const pageHeight = 295; 
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
//       const filename = `Survey-Dashboard-${timestamp}.pdf`;
      
//       pdf.save(filename);
      
//       this.exportSuccess = true;
//       this.exportMessage = 'PDF downloaded successfully!';
      
//     } catch (error) {
//       console.error('PDF export error:', error);
//       this.exportSuccess = false;
//       this.exportMessage = 'Failed to export PDF. Please try again.';
//     } finally {
//       this.isExporting = false;
//       setTimeout(() => {
//         this.exportSuccess = false;
//         this.exportMessage = '';
//       }, 5000);
//     }
//   }

//   async exportPPT() {
//     if (!this.showFilteredData || !this.hasAssignedFeedback) {
//       this.exportMessage = 'Please select a survey that is assigned to this department to export data';
//       this.exportSuccess = false;
//       return;
//     }

//     this.isExporting = true;
    
//     try {
//       const displayDashboard = this.getDisplayDashboard();
//       if (!displayDashboard) {
//         throw new Error('No dashboard data available');
//       }

//       // Create a new PowerPoint presentation
//       const pptx = new pptxgen();
      
//       // Add a title slide
//       const titleSlide = pptx.addSlide();
//       titleSlide.addText('Survey Dashboard Report', {
//         x: 1, y: 1, w: '90%', h: 1.5,
//         fontSize: 24,
//         bold: true,
//         color: '2C3E50',
//         align: 'center'
//       });

//       titleSlide.addText(`Generated on: ${new Date().toLocaleDateString()}`, {
//         x: 1, y: 2.5, w: '90%', h: 0.5,
//         fontSize: 12,
//         color: '7F8C8D',
//         align: 'center'
//       });

//       // Add summary slide
//       const summarySlide = pptx.addSlide();
//       summarySlide.addText('Survey Summary', {
//         x: 0.5, y: 0.5, w: '90%', h: 0.6,
//         fontSize: 18,
//         bold: true,
//         color: '2C3E50'
//       });

//       // Add summary data
//       const summaryData = [
//         [{ text: 'Metric' }, { text: 'Value' }],
//         [{ text: 'Total Employees' }, { text: this.totalEmployees.toString() }],
//         [{ text: 'Submitted' }, { text: `${this.submittedCount} (${this.submissionRate}%)` }],
//         [{ text: 'Remaining' }, { text: this.remainingCount.toString() }]
//       ];

//       summarySlide.addTable(summaryData, {
//         x: 0.5, y: 1.5, w: 8,
//         colW: [3, 2],
//         border: { pt: 1, color: 'BDC3C7' },
//         fill: { color: 'ECF0F1' }
//       });

//       // Add department stats slide if available
//       if (displayDashboard.departmentStats && displayDashboard.departmentStats.length > 0) {
//         const deptSlide = pptx.addSlide();
//         deptSlide.addText('Department Response Rates', {
//           x: 0.5, y: 0.5, w: '90%', h: 0.6,
//           fontSize: 18,
//           bold: true,
//           color: '2C3E50'
//         });

//         const deptData = [
//           [{ text: 'Department' }, { text: 'Response Rate' }]
//         ];

//         displayDashboard.departmentStats.forEach((dept: any) => {
//           const deptName = dept.name || dept.departmentName || dept.department || 'Unknown';
//           const responseRate = dept.responseRate || dept.rate || dept.percentage || 0;
//           deptData.push([{ text: deptName }, { text: `${responseRate}%` }]);
//         });

//         deptSlide.addTable(deptData, {
//           x: 0.5, y: 1.5, w: 8,
//           colW: [5, 3],
//           border: { pt: 1, color: 'BDC3C7' },
//           fill: { color: 'ECF0F1' }
//         });
//       }

//       // Generate and download the PowerPoint file
//       const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
//       const filename = `Survey-Dashboard-${timestamp}.pptx`;
      
//       await pptx.writeFile({ fileName: filename });
      
//       this.exportSuccess = true;
//       this.exportMessage = 'PowerPoint downloaded successfully!';
      
//     } catch (error) {
//       console.error('PPT export error:', error);
//       this.exportSuccess = false;
//       this.exportMessage = 'Failed to export PowerPoint. Please try again.';
//     } finally {
//       this.isExporting = false;
//       setTimeout(() => {
//         this.exportSuccess = false;
//         this.exportMessage = '';
//       }, 5000);
//     }
//   }

  
//   exportCSV() {
//     const displayDashboard = this.getDisplayDashboard();
    
//     if (!displayDashboard || !this.hasAssignedFeedback) {
//       this.exportMessage = 'No survey data available for the selected department';
//       this.exportSuccess = false;
//       return;
//     }

//     try {
//       let csvContent = 'Survey Dashboard Export\n\n';
//       csvContent += 'Metric,Value\n';
//       csvContent += `Total Employees,${this.totalEmployees}\n`;
//       csvContent += `Submitted,${this.submittedCount}\n`;
//       csvContent += `Remaining,${this.remainingCount}\n`;
//       csvContent += `Submission Rate,${this.submissionRate}%\n\n`;
      
//       if (displayDashboard.departmentStats?.length) {
//         csvContent += 'Department,Response Rate\n';
//         displayDashboard.departmentStats.forEach((dept: any) => {
//           const deptAny = dept as any;
//           const deptName = deptAny.name || deptAny.departmentName || deptAny.department || 'Unknown Department';
//           const responseRate = deptAny.responseRate || deptAny.rate || deptAny.percentage || 0;
//           csvContent += `${deptName},${responseRate}%\n`;
//         });
//       }

//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
//       link.href = url;
//       link.download = `Survey-Data-${timestamp}.csv`;
//       link.click();
      
//       window.URL.revokeObjectURL(url);
      
//       this.exportSuccess = true;
//       this.exportMessage = 'CSV downloaded successfully!';
      
//     } catch (error) {
//       console.error('CSV export error:', error);
//       this.exportSuccess = false;
//       this.exportMessage = 'Failed to export CSV. Please try again.';
//     } finally {
//       setTimeout(() => {
//         this.exportSuccess = false;
//         this.exportMessage = '';
//       }, 5000);
//     }
//   }
// }
// src/app/pages/dashboard-root/dashboard-root.ts


// // src/app/pages/dashboard-root/dashboard-root.ts
// // src/app/pages/dashboard-root/dashboard-root.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardResponse } from '../../models/dashboard-response';

// import { FiltersPanel } from '../filters-panel/filters-panel';
// import DepartmentCharts from '../department-charts/department-charts';
// import SubmittedTable from '../submitted-table/submitted-table';
// import PendingTable from '../pending-table/pending-table';

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import PptxGenJS from 'pptxgenjs';
// import * as XLSX from 'xlsx';

// @Component({
//   selector: 'app-dashboard-root',
//   standalone: true,
//   imports: [CommonModule, FormsModule, FiltersPanel, DepartmentCharts, SubmittedTable, PendingTable],
//   templateUrl: './dashboard-root.html',
//   styleUrls: ['./dashboard-root.css']
// })
// export default class DashboardRoot implements OnInit {

//   dashboard?: DashboardResponse;
//   surveys: any[] = [];
//   departments: any[] = [];

//   // RAW lists from backend (string[] like "E101 - Rahul Sharma")
//   submittedEmployeesRaw: string[] = [];
//   pendingEmployeesRaw: string[] = [];

//   // Parsed structured lists
//   submittedEmployees: Array<{ employeeId: string, employeeName: string }> = [];
//   pendingEmployees: Array<{ employeeId: string, employeeName: string }> = [];

//   // selected filter values
//   selectedSurveyId?: number | null = null;
//   selectedDepartmentId?: number | null = null;

//   // UI state
//   showResults = false;
//   showAssignmentAlert = false;

//   // KPI values
//   totalEmployees = 0;
//   submittedCount = 0;
//   remainingCount = 0;
//   submissionRate = 0;

//   // export UI
//   isExporting = false;
//   exportMessage = '';

//   constructor(private svc: DashboardService) {}

//   ngOnInit(): void {
//     this.loadFilters();
//   }

//   loadFilters() {
//     this.svc.getSurveys().subscribe({
//       next: (res) => {
//         this.surveys = res ?? [];
//         if (this.surveys.length > 0) {
//           const sorted = [...this.surveys].sort((a,b) => {
//             const aDate = new Date(a.createdAt ?? a.publishedAt ?? 0).getTime();
//             const bDate = new Date(b.createdAt ?? b.publishedAt ?? 0).getTime();
//             return aDate - bDate;
//           });
//           const first = sorted[0];
//           this.selectedSurveyId = first?.id ?? first?.surveyId ?? null;
//         }
//       },
//       error: err => console.error('Failed to load surveys', err)
//     });

//     this.svc.getDepartments().subscribe({
//       next: (res) => this.departments = res ?? [],
//       error: err => console.error('Failed to load departments', err)
//     });
//   }

//   onFilterChange() {
//     this.showResults = true;
//     this.loadDashboard();
//   }

//   loadDashboard() {
//     const sId = this.selectedSurveyId ?? undefined;
//     const dId = this.selectedDepartmentId ?? undefined;

//     this.svc.getDashboard(sId as any, dId as any).subscribe({
//       next: (res) => {
//         this.dashboard = res;

//         // RAW arrays from backend
//         this.submittedEmployeesRaw = res?.submittedEmployees ?? [];
//         this.pendingEmployeesRaw = res?.pendingEmployees ?? [];

//         // Parse to structured objects for internal usage & Excel
//         this.submittedEmployees = this.parseList(this.submittedEmployeesRaw, 'id-first');
//         this.pendingEmployees = this.parseList(this.pendingEmployeesRaw, 'id-first');

//         this.computeKPIs();
//         this.checkSurveyDepartmentMatch();
//       },
//       error: (err) => {
//         console.error('Dashboard API error', err);
//         this.dashboard = undefined;
//         this.submittedEmployeesRaw = [];
//         this.pendingEmployeesRaw = [];
//         this.submittedEmployees = [];
//         this.pendingEmployees = [];
//         this.computeKPIs();
//         this.checkSurveyDepartmentMatch();
//       }
//     });
//   }

//   private parseList(list: string[], format: 'id-first' | 'name-first' = 'id-first') {
//     return (list || []).map(s => {
//       if (typeof s !== 'string') return { employeeId: '', employeeName: String(s ?? '') };
//       const parts = s.split('-').map(p => p.trim()).filter(Boolean);
//       if (parts.length >= 2) {
//         if (format === 'id-first') return { employeeId: parts[0], employeeName: parts.slice(1).join(' - ') };
//         else return { employeeName: parts[0], employeeId: parts.slice(1).join(' - ') };
//       }
//       // fallback: entire string as name
//       return { employeeId: '', employeeName: s.trim() };
//     });
//   }

//   private computeKPIs() {
//     if (!this.dashboard) {
//       this.totalEmployees = 0; this.submittedCount = 0; this.remainingCount = 0; this.submissionRate = 0;
//       return;
//     }
//     this.totalEmployees = Number(this.dashboard.totalEmployees ?? 0);
//     this.submittedCount = Number(this.dashboard.totalSubmitted ?? 0);
//     this.remainingCount = Number(this.dashboard.totalPending ?? 0);
//     this.submissionRate = this.totalEmployees > 0 ? Math.round((this.submittedCount / this.totalEmployees) * 100) : 0;
//   }

//   private checkSurveyDepartmentMatch() {
//     this.showAssignmentAlert = false;
//     if (!this.selectedSurveyId || !this.selectedDepartmentId) return;
//     const survey = this.surveys.find(s => (s.id ?? s.surveyId) === this.selectedSurveyId);
//     if (!survey) return;
//     const target = survey.targetDepartment?.id ?? survey.targetDepartmentId ?? survey.target_department_id;
//     if (!target) return;
//     const targetId = typeof target === 'object' ? Number(target.id ?? target.departmentId ?? target) : Number(target);
//     if (!isNaN(targetId) && targetId !== Number(this.selectedDepartmentId)) this.showAssignmentAlert = true;
//     else this.showAssignmentAlert = false;
//   }

//   /* ---------------------------
//      Helpers to temporarily expand scrollable areas
//      --------------------------- */
//   private expandForCapture(selectors: string[]) {
//     const backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}> = [];
//     selectors.forEach(sel => {
//       const els = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
//       els.forEach(el => {
//         // backup current inline styles we will modify
//         backups.push({
//           el,
//           style: {
//             overflow: el.style.overflow,
//             maxHeight: el.style.maxHeight,
//             height: el.style.height
//           }
//         });
//         // expand
//         el.style.overflow = 'visible';
//         el.style.maxHeight = 'none';
//         el.style.height = 'auto';
//       });
//     });
//     return backups;
//   }

//   private restoreAfterCapture(backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}>) {
//     backups.forEach(b => {
//       const s = b.style;
//       if (s.overflow !== undefined) b.el.style.overflow = s.overflow as string;
//       if (s.maxHeight !== undefined) b.el.style.maxHeight = s.maxHeight as string;
//       if (s.height !== undefined) b.el.style.height = s.height as string;
//     });
//   }

//   /* ---------------------------
//      EXPORT: Full-page PDF (captures full document and splits across pages)
//      --------------------------- */
//  /* ----------------------------------------------------
//     EXPORT PDF — ONLY DASHBOARD, EXACT TO UI
//     MULTI-PAGE, NO SIDEBAR/HEADER
// -----------------------------------------------------*/
// async exportPDF() {
//   if (!this.dashboard) {
//     this.exportMessage = 'No data to export';
//     setTimeout(() => (this.exportMessage = ''), 2000);
//     return;
//   }

//   this.isExporting = true;

//   try {
//     /* -------------------------------
//        1) Expand ALL clip containers
//     --------------------------------*/
//     const expandSelectors = [
//       '.employee-list-wrapper',
//       '.table-wrapper',      // 🔥 IMPORTANT FIX
//       '.row',
//       '.col-md-6',
//       '#dashboard-section'
//     ];

//     const originalStyles: Array<{ el: HTMLElement; style: any }> = [];

//     expandSelectors.forEach(sel => {
//       document.querySelectorAll(sel).forEach((el: any) => {

//         originalStyles.push({
//           el,
//           style: {
//             overflow: el.style.overflow,
//             maxHeight: el.style.maxHeight,
//             height: el.style.height
//           }
//         });

//         el.style.overflow = 'visible';
//         el.style.maxHeight = 'none';
//         el.style.height = 'auto';
//       });
//     });

//     /* -------------------------------
//        2) html2canvas screenshot
//     --------------------------------*/
//     const dashboard = document.getElementById('dashboard-section')!;
//     const canvas = await html2canvas(dashboard, {
//       scale: 2.5,
//       useCORS: true,
//       backgroundColor: '#ffffff',
//       logging: false
//     });

//     /* -------------------------------
//        3) Restore original styles
//     --------------------------------*/
//     originalStyles.forEach(item => {
//       item.el.style.overflow = item.style.overflow;
//       item.el.style.maxHeight = item.style.maxHeight;
//       item.el.style.height = item.style.height;
//     });

//     /* -------------------------------
//        4) Multi-page PDF generation
//     --------------------------------*/
//     const img = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');

//     const pageW = pdf.internal.pageSize.getWidth();
//     const pageH = pdf.internal.pageSize.getHeight();

//     const imgW = pageW;
//     const imgH = (canvas.height / canvas.width) * imgW;

//     let heightLeft = imgH;
//     let pos = 0;

//     pdf.addImage(img, 'PNG', 0, pos, imgW, imgH);
//     heightLeft -= pageH;

//     while (heightLeft > 0) {
//       pdf.addPage();
//       pos = pos - pageH;
//       pdf.addImage(img, 'PNG', 0, pos, imgW, imgH);
//       heightLeft -= pageH;
//     }

//     pdf.save(`Dashboard-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`);
//     this.exportMessage = 'PDF downloaded';

//   } catch (err) {
//     console.error('PDF export error:', err);
//     this.exportMessage = 'PDF export failed';

//   } finally {
//     this.isExporting = false;
//     setTimeout(() => (this.exportMessage = ''), 3000);
//   }
// }

//   /* ---------------------------
//      EXPORT: Excel (.xlsx) using XLSX
//   --------------------------- */
//   exportExcel() {
//     if (!this.dashboard) {
//       this.exportMessage = 'No data to export';
//       setTimeout(() => (this.exportMessage = ''), 2000);
//       return;
//     }

//     try {
//       const wb = XLSX.utils.book_new();

//       const surveyTitle = this.surveys.find(s => (s.id ?? s.surveyId) === this.selectedSurveyId)?.title ?? 'All Surveys';
//       const deptName = this.departments.find(d => (d.id ?? d.departmentId) === this.selectedDepartmentId)?.name ?? 'All Departments';

//       const summary = [
//         ['Survey', surveyTitle],
//         ['Department', deptName],
//         [],
//         ['Metric', 'Value'],
//         ['Total Employees', this.totalEmployees],
//         ['Submitted', this.submittedCount],
//         ['Pending', this.remainingCount],
//         ['Submission Rate (%)', this.submissionRate + '%']
//       ];
//       const ws1 = XLSX.utils.aoa_to_sheet(summary);
//       XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

//       const deptData = (this.dashboard.departmentStats ?? []).map((d: any) => ({
//         Department: d.departmentName ?? d.name ?? '',
//         Total: d.totalEmployees ?? d.total ?? 0,
//         Submitted: d.submitted ?? 0,
//         Pending: d.pending ?? 0,
//         ResponseRate: (d.responseRate ?? d.responseRatePct ?? 0)
//       }));
//       const ws2 = XLSX.utils.json_to_sheet(deptData);
//       XLSX.utils.book_append_sheet(wb, ws2, 'Department Stats');

//       // Submitted sheet (EmployeeID, EmployeeName)
//       const submittedRows = this.submittedEmployees.map(s => ({
//         EmployeeID: s.employeeId || '',
//         EmployeeName: s.employeeName || ''
//       }));
//       const ws3 = XLSX.utils.json_to_sheet(submittedRows);
//       // set column widths for readability
//       ws3['!cols'] = [{ wch: 12 }, { wch: 30 }];
//       XLSX.utils.book_append_sheet(wb, ws3, 'Submitted');

//       // Pending sheet
//       const pendingRows = this.pendingEmployees.map(p => ({
//         EmployeeID: p.employeeId || '',
//         EmployeeName: p.employeeName || ''
//       }));
//       const ws4 = XLSX.utils.json_to_sheet(pendingRows);
//       ws4['!cols'] = [{ wch: 12 }, { wch: 30 }];
//       XLSX.utils.book_append_sheet(wb, ws4, 'Pending');

//       const fileName = `Dashboard-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.xlsx`;
//       XLSX.writeFile(wb, fileName);

//       this.exportMessage = 'Excel downloaded';
//     } catch (err) {
//       console.error('Excel export error:', err);
//       this.exportMessage = 'Excel export failed';
//     } finally {
//       setTimeout(() => (this.exportMessage = ''), 3000);
//     }
//   }

//   // Alias for previous naming
//   exportCSV() {
//     this.exportExcel();
//   }

//   /* ---------------------------
//      EXPORT: PPT (captures specific dashboard sections and puts each on slides)
//   --------------------------- */
//   async exportPPT() {
//   if (!this.showResults || !this.dashboard) {
//     this.exportMessage = 'No data to export';
//     setTimeout(() => (this.exportMessage = ''), 2000);
//     return;
//   }

//   this.isExporting = true;

//   try {
//     // TEMPORARY EXPAND scrollable submitted/pending tables
//     const scrollAreas = document.querySelectorAll('.employee-list-wrapper') as NodeListOf<HTMLElement>;

//     scrollAreas.forEach(el => {
//       el.setAttribute('data-old-height', el.style.height);
//       el.setAttribute('data-old-overflow', el.style.overflow);

//       el.style.height = 'auto';
//       el.style.maxHeight = 'none';
//       el.style.overflow = 'visible';
//     });

//     // Capture ONLY dashboard section
//     const dashboardEl = document.getElementById('dashboard-section')!;
//     const canvas = await html2canvas(dashboardEl, {
//       scale: 2.5,
//       useCORS: true,
//       backgroundColor: null,
//       logging: false
//     });

//     // RESTORE original scroll styles
//     scrollAreas.forEach(el => {
//       el.style.height = el.getAttribute('data-old-height') || '';
//       el.style.overflow = el.getAttribute('data-old-overflow') || '';
//     });

//     const img = canvas.toDataURL('image/png');

//     // Create PPT
//     const ppt = new PptxGenJS();
//     ppt.layout = 'LAYOUT_WIDE';

//     const slide = ppt.addSlide();

//     const slideWidth = 13.33;
//     const imgWidth = slideWidth;
//     const imgHeight = (canvas.height / canvas.width) * imgWidth;

//     slide.addImage({
//       data: img,
//       x: 0,
//       y: 0,
//       w: imgWidth,
//       h: imgHeight
//     });

//     await ppt.writeFile({
//       fileName: `Dashboard-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pptx`
//     });

//     this.exportMessage = 'PPT downloaded';
//   } catch (err) {
//     console.error(err);
//     this.exportMessage = 'PPT export failed';
//   } finally {
//     this.isExporting = false;
//     setTimeout(() => (this.exportMessage = ''), 3000);
//   }
// }

// }


/* --- IMPORTS --- */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response';

import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SubmittedTable from '../submitted-table/submitted-table';
import PendingTable from '../pending-table/pending-table';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';

/* ------------------------------------------------------------- */

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltersPanel, DepartmentCharts, SubmittedTable, PendingTable],
  templateUrl: './dashboard-root.html',
  styleUrls: ['./dashboard-root.css']
})
export default class DashboardRoot implements OnInit {

  /* ------------------ DATA ------------------ */
  dashboard?: DashboardResponse;
  surveys: any[] = [];
  departments: any[] = [];

  submittedEmployeesRaw: string[] = [];
  pendingEmployeesRaw: string[] = [];

  submittedEmployees: Array<{ employeeId: string, employeeName: string }> = [];
  pendingEmployees: Array<{ employeeId: string, employeeName: string }> = [];

  selectedSurveyId: number | null = null;
  selectedDepartmentId: number | null = null;

  showResults = false;
  showAssignmentAlert = false;  // 👈 alert for NOT_ASSIGNED or invalid department selection
  assignmentMessage = "";       // 👈 show message like “Survey not assigned to HR”

  totalEmployees = 0;
  submittedCount = 0;
  remainingCount = 0;
  submissionRate = 0;

  isExporting = false;
  exportMessage = '';

  constructor(private svc: DashboardService) {}

  /* ------------------ INIT ------------------ */
  ngOnInit(): void {
    this.loadFilters();
  }

  /* =============================================================
      LOAD SURVEYS + DEPARTMENTS
  ============================================================= */
  private loadFilters(): void {

    // ---------------- Surveys ----------------
    this.svc.getSurveys().subscribe({
      next: (res: any[]) => {
        this.surveys = res ?? [];

        if (this.surveys.length > 0) {
          const sorted = [...this.surveys].sort((a, b) => {
            const aDate = new Date(a.createdAt ?? a.publishedAt ?? 0).getTime();
            const bDate = new Date(b.createdAt ?? b.publishedAt ?? 0).getTime();
            return aDate - bDate;
          });
          this.selectedSurveyId = sorted[0]?.id ?? null;
        }
      },
      error: () => {
        console.warn("Failed to load surveys (401)");
      }
    });

    // ---------------- Departments ----------------
    this.svc.getDepartments().subscribe({
      next: (res: any[]) => {
        this.departments = res ?? [];
      },
      error: () => {
        console.warn("Failed to load departments (401)");
      }
    });
  }

  /* =============================================================
      HANDLES FILTER VALIDATION FROM FILTER-PANEL (Frontend)
  ============================================================= */
  onFilterChange(canApply: boolean) {
    if (!canApply) {
      this.showResults = false;
      this.dashboard = undefined;

      this.showAssignmentAlert = true;
      this.assignmentMessage = "This survey is not assigned to the selected department.";

      return;
    }

    this.showAssignmentAlert = false;
    this.assignmentMessage = "";

    this.showResults = true;
    this.loadDashboard();
  }

  /* =============================================================
      LOAD DASHBOARD DATA  → FIXED ERROR HANDLING
  ============================================================= */
  private loadDashboard(): void {

    const sId = this.selectedSurveyId ?? undefined;
    const dId = this.selectedDepartmentId ?? undefined;

    this.svc.getDashboard(sId as any, dId as any).subscribe({
      next: (res: any) => {

        // Backend might send: { error: "NOT_ASSIGNED" }
        if (res?.error) {
          this.showResults = false;
          this.showAssignmentAlert = true;

          if (res.error === "NOT_ASSIGNED") {
            this.assignmentMessage = "This survey is not assigned to the selected department.";
          } else {
            this.assignmentMessage = res.error;
          }

          return;
        }

        // NO ERROR → NORMAL FLOW
        this.showAssignmentAlert = false;
        this.assignmentMessage = "";

        this.dashboard = res;

        this.submittedEmployeesRaw = res?.submittedEmployees ?? [];
        this.pendingEmployeesRaw = res?.pendingEmployees ?? [];

        this.submittedEmployees = this.parseList(this.submittedEmployeesRaw);
        this.pendingEmployees = this.parseList(this.pendingEmployeesRaw);

        this.computeKPIs();
        this.showResults = true;
      },

      /* ------------------ SERVER 500 FIX ------------------ */
      error: (err) => {
        console.warn("Backend Dashboard Error: ", err);

        this.showResults = false;
        this.dashboard = undefined;
        this.showAssignmentAlert = true;

        const msg = err?.error?.message ?? err?.error?.error ?? "";

        if (typeof msg === "string" && msg.toLowerCase().includes("assigned")) {
          this.assignmentMessage = "This survey is not assigned to the selected department.";
        } else {
          this.assignmentMessage = "Failed to load dashboard. Please check assignments.";
        }
      }
    });
  }

  /* =============================================================
      Parse Employee List
  ============================================================= */
  private parseList(list: string[]): Array<{ employeeId: string, employeeName: string }> {
    return list.map(s => {
      const parts = s.split('-').map(p => p.trim());

      if (parts.length >= 2) {
        return { employeeId: parts[1], employeeName: parts[0] };
      }
      return { employeeId: '', employeeName: s };
    });
  }

  /* =============================================================
      COMPUTE KPIs
  ============================================================= */
  private computeKPIs() {
    if (!this.dashboard) {
      this.totalEmployees = 0;
      this.submittedCount = 0;
      this.remainingCount = 0;
      this.submissionRate = 0;
      return;
    }

    this.totalEmployees = Number(this.dashboard.totalEmployees ?? 0);
    this.submittedCount = Number(this.dashboard.totalSubmitted ?? 0);
    this.remainingCount = Number(this.dashboard.totalPending ?? 0);

    this.submissionRate =
      this.totalEmployees > 0
        ? Math.round((this.submittedCount / this.totalEmployees) * 100)
        : 0;
  }

  /* ---------------------------
     Expand helper (used by both PDF and PPT)
  --------------------------- */
  private expandForExport(selectors: string[]) {
    const backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}> = [];
    selectors.forEach(sel => {
      const els = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
      els.forEach(el => {
        backups.push({
          el,
          style: {
            overflow: el.style.overflow,
            maxHeight: el.style.maxHeight,
            height: el.style.height
          }
        });
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      });
    });
    return backups;
  }

  private restoreAfterExport(backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}>) {
    backups.forEach(b => {
      const s = b.style;
      if (s.overflow !== undefined) b.el.style.overflow = s.overflow as string;
      if (s.maxHeight !== undefined) b.el.style.maxHeight = s.maxHeight as string;
      if (s.height !== undefined) b.el.style.height = s.height as string;
    });
  }

  /* ---------------------------
     EXPORT: Excel (.xlsx)
  --------------------------- */
  exportExcel() {
  if (!this.dashboard) {
    this.exportMessage = "No data to export";
    setTimeout(() => (this.exportMessage = ""), 2000);
    return;
  }

  try {
    const wb = XLSX.utils.book_new();

    const surveyTitle =
      this.surveys.find((s) => (s.id ?? s.surveyId) === this.selectedSurveyId)
        ?.title ?? "All Surveys";

    const deptName =
      this.departments.find(
        (d) => (d.id ?? d.departmentId) === this.selectedDepartmentId
      )?.name ?? "All Departments";

    /* -------------------------------------------------------------------
       SHEET 1 — COMPLETE SUMMARY (Survey, Dept, KPI + Lists)
    --------------------------------------------------------------------*/
    const summaryAoa: any[] = [
      ["Survey Name", surveyTitle],
      ["Department Name", deptName],
      [],
      ["Metric", "Value"],
      ["Total Employees", this.totalEmployees],
      ["Submitted", this.submittedCount],
      ["Pending", this.remainingCount],
      ["Submission Rate (%)", this.submissionRate + "%"],
      [],
      ["Submitted Employee ID", "Submitted Employee Name"],
      ...this.submittedEmployees.map((e) => [e.employeeId, e.employeeName]),
      [],
      ["Pending Employee ID", "Pending Employee Name"],
      ...this.pendingEmployees.map((e) => [e.employeeId, e.employeeName]),
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
    wsSummary["!cols"] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");


    /* -------------------------------------------------------------------
       SHEET 2 — Department Stats
    --------------------------------------------------------------------*/
    const deptData = (this.dashboard?.departmentStats ?? []).map((d: any) => ({
      Department: d.departmentName ?? d.name ?? "",
      Total: d.totalEmployees ?? d.total ?? 0,
      Submitted: d.submitted ?? 0,
      Pending: d.pending ?? 0,
      ResponseRate: d.responseRate ?? d.responseRatePct ?? 0,
    }));

    const wsDept = XLSX.utils.json_to_sheet(deptData);
    XLSX.utils.book_append_sheet(wb, wsDept, "Department Stats");


    /* -------------------------------------------------------------------
       SHEET 3 — Submitted Employees
    --------------------------------------------------------------------*/
    const submittedRows = this.submittedEmployees.map((s) => ({
      EmployeeID: s.employeeId,
      EmployeeName: s.employeeName,
    }));

    const wsSubmitted = XLSX.utils.json_to_sheet(submittedRows);
    wsSubmitted["!cols"] = [{ wch: 12 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsSubmitted, "Submitted Employees");


    /* -------------------------------------------------------------------
       SHEET 4 — Pending Employees
    --------------------------------------------------------------------*/
    const pendingRows = this.pendingEmployees.map((p) => ({
      EmployeeID: p.employeeId,
      EmployeeName: p.employeeName,
    }));

    const wsPending = XLSX.utils.json_to_sheet(pendingRows);
    wsPending["!cols"] = [{ wch: 12 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsPending, "Pending Employees");


    /* -------------------------------------------------------------------
       SHEET 5 — Combined Employee List
    --------------------------------------------------------------------*/
    const combined = [
      ["Type", "Employee ID", "Employee Name"],
      ...this.submittedEmployees.map((e) => ["Submitted", e.employeeId, e.employeeName]),
      ...this.pendingEmployees.map((e) => ["Pending", e.employeeId, e.employeeName]),
    ];

    const wsCombined = XLSX.utils.aoa_to_sheet(combined);
    wsCombined["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsCombined, "All Employees");


    /* -------------------------------------------------------------------
       SAVE FILE
    --------------------------------------------------------------------*/
    const fileName = `Dashboard-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.exportMessage = "Excel downloaded";
  } catch (err) {
    console.error("Excel export error:", err);
    this.exportMessage = "Excel export failed";
  } finally {
    setTimeout(() => (this.exportMessage = ""), 3000);
  }
}

  /* ---------------------------
     EXPORT: PDF (ONLY dashboard, hide buttons, no gradient)
  --------------------------- */
//   async exportPDF() {
//   if (!this.dashboard) return;

//   this.isExporting = true;
//   this.exportMessage = "Exporting PDF...";

//   const dashboardEl = document.getElementById("dashboard-section")!;
//   dashboardEl.classList.add("pdf-capture");

//   const backups = this.expandForExport([
//     ".table-wrapper",
//     ".employee-list-wrapper",
//     ".row",
//     ".col-md-6",
//     "#dashboard-section",
//   ]);

//   try {
//     const canvas = await html2canvas(dashboardEl, {
//       scale: 2.4,
//       backgroundColor: "#ffffff"
//     });

//     this.restoreAfterExport(backups);
//     dashboardEl.classList.remove("pdf-capture");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgData = canvas.toDataURL("image/png");

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const imgHeight = (canvas.height * pageWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
//     heightLeft -= pdf.internal.pageSize.height;

//     while (heightLeft > 0) {
//       pdf.addPage();
//       position -= pdf.internal.pageSize.height;
//       pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
//       heightLeft -= pdf.internal.pageSize.height;
//     }

//     pdf.save(`Dashboard-${Date.now()}.pdf`);
//     this.exportSuccess();

//   } catch (err) {
//     console.error(err);
//     alert("PDF Export Failed");
//   }

//   this.isExporting = false;
// }

async exportPDF() {
  if (!this.dashboard) return;

  this.isExporting = true;
  this.exportMessage = "Exporting PDF...";

  const dashboardEl = document.getElementById("dashboard-section")!;
  dashboardEl.classList.add("pdf-capture");

  const backups = this.expandForExport([
    ".table-wrapper",
    ".employee-list-wrapper",
    ".row",
    ".col-md-6",
    "#dashboard-section",
  ]);

  try {
    const canvas = await html2canvas(dashboardEl, {
      scale: 2.4,
      backgroundColor: "#ffffff"
    });

    this.restoreAfterExport(backups);
    dashboardEl.classList.remove("pdf-capture");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    const imgWidth = usableW;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const fullImg = canvas;

    let remainingHeight = imgHeight;
    let currentY = 0;

    // Create temporary canvas for slicing
    const sliceCanvas = document.createElement("canvas");
    const sliceCtx = sliceCanvas.getContext("2d")!;
    sliceCanvas.width = fullImg.width;
    sliceCanvas.height = (usableH * fullImg.width) / usableW;

    let pageIndex = 0;

    while (remainingHeight > 0) {
      const sliceHeight = sliceCanvas.height / 1.0;
      sliceCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);

      sliceCtx.drawImage(
        fullImg,
        0,
        currentY,
        fullImg.width,
        sliceHeight,
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height
      );

      const slicedImg = sliceCanvas.toDataURL("image/png");

      if (pageIndex > 0) pdf.addPage();

      pdf.addImage(
        slicedImg,
        "PNG",
        margin,
        margin,
        usableW,
        usableH
      );

      currentY += sliceHeight;
      remainingHeight -= usableH;
      pageIndex++;
    }

    pdf.save(`Dashboard-${Date.now()}.pdf`);
    this.exportSuccess();

  } catch (err) {
    console.error(err);
    alert("PDF Export Failed");
  }

  this.isExporting = false;
}


  /* ---------------------------
     EXPORT: PPT (ONLY dashboard area, expands tables)
  --------------------------- */
 async exportPPT() {
  if (!this.dashboard) return;

  this.isExporting = true;
  this.exportMessage = "Exporting PPT...";

  const dashboardEl = document.getElementById("dashboard-section")!;
  dashboardEl.classList.add("ppt-capture");

  const backups = this.expandForExport([
    ".table-wrapper",
    ".employee-list-wrapper",
    ".row",
    ".col-md-6",
    "#dashboard-section"
  ]);

  try {
    /* ----------------------- CAPTURE KPI + CHART IMAGES ----------------------- */
    const capture = async (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return null;

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff"
      });

      return canvas.toDataURL("image/png");
    };

    const kpiImg = await capture("#ppt-kpi-section");
    const chartImg = await capture("#ppt-chart-section");

    this.restoreAfterExport(backups);
    dashboardEl.classList.remove("ppt-capture");

    /* ------------------------------ CREATE PPT ------------------------------ */
    const ppt = new PptxGenJS();
    ppt.layout = "LAYOUT_WIDE";

    const slideW = 13.33;
    const slideH = 7.5;

    /* ---------------------------- Slide 1: KPI + Logo ---------------------------- */
/* ---------------------------- Slide 1: KPI + Logo ---------------------------- */
const s1 = ppt.addSlide();

/* --- Logo (Top Left) --- */
s1.addImage({
  path: "assets/images/aurionpro-logo.jpg",
  x: 0.4,
  y: 0.3,
  w: 2.6,     // medium-normal logo size
});

/* --- BIG CLEAN GAP + Heading --- */
s1.addText("Dashboard Summary", {
  x: 0.4,
  y: 1.9,      // MUCH bigger gap
  fontSize: 34,
  bold: true,
  color: "#009B8C"
});

/* --- KPI IMAGE (Medium Sized) --- */
if (kpiImg) {
  s1.addImage({
    data: kpiImg,
    x: 0.5,
    y: 3.0,          // placed lower for gap
    w: slideW - 3,   // reduced width → medium
    h: 3.2           // reduced height → medium
  });
}



    /* ----------------------------- Slide 2: Chart ----------------------------- */
    const s2 = ppt.addSlide();
    s2.addText("Department Chart", {
      x: 0.4, y: 0.3, fontSize: 28, bold: true, color: "#009B8C"
    });

    if (chartImg) {
      s2.addImage({
        data: chartImg,
        x: 0.3,
        y: 1.0,
        w: slideW - 0.6,
        h: slideH - 1.2
      });
    }

    /* ====================================================================== */
    /*                     PAGINATION FOR SUBMITTED EMPLOYEES                */
    /* ====================================================================== */

    const submitted = this.submittedEmployeesRaw;
    let submittedChunks = [];

    for (let i = 0; i < submitted.length; i += 10) {
      submittedChunks.push(submitted.slice(i, i + 10));
    }

    submittedChunks.forEach((chunk, index) => {
      const slide = ppt.addSlide();
      slide.addText(`Submitted Employees (Page ${index + 1})`, {
        x: 0.4,
        y: 0.3,
        fontSize: 26,
        bold: true,
        color: "#009B8C"
      });

      const rows = chunk.map((emp, i) => [{ text: `${i + 1}` }, { text: emp }]);

      slide.addTable(
        [
          [{ text: "Sr.No", options: { bold: true } }, { text: "Employee", options: { bold: true } }],
          ...rows
        ],
        {
          x: 0.5,
          y: 1.2,
          w: slideW - 1,
          border: { pt: 1, color: "999999" },
          fontSize: 18,
          fill: { color: "F8F9FA" }
        }
      );
    });

    /* ====================================================================== */
    /*                     PAGINATION FOR PENDING EMPLOYEES                  */
    /* ====================================================================== */

    const pending = this.pendingEmployeesRaw;
    let pendingChunks = [];

    for (let i = 0; i < pending.length; i += 10) {
      pendingChunks.push(pending.slice(i, i + 10));
    }

    pendingChunks.forEach((chunk, index) => {
      const slide = ppt.addSlide();

      slide.addText(`Pending Employees (Page ${index + 1})`, {
        x: 0.4,
        y: 0.3,
        fontSize: 26,
        bold: true,
        color: "#009B8C"
      });

      const rows = chunk.map((emp, i) => [{ text: `${i + 1}` }, { text: emp }]);

      slide.addTable(
        [
          [{ text: "Sr.No", options: { bold: true } }, { text: "Employee", options: { bold: true } }],
          ...rows
        ],
        {
          x: 0.5,
          y: 1.2,
          w: slideW - 1,
          border: { pt: 1, color: "999999" },
          fontSize: 18,
          fill: { color: "F8F9FA" }
        }
      );
    });

    /* ---------------------------- SAVE PPT ---------------------------- */
    await ppt.writeFile({ fileName: `Dashboard-${Date.now()}.pptx` });
    this.exportSuccess();

  } catch (err) {
    console.error(err);
    alert("PPT Export Failed");
  }

  this.isExporting = false;
}



  private loadImageBase64(path: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = path;
  });
}

private exportSuccess() {
  setTimeout(() => {
    alert("Export Successful");
    window.location.reload();
  }, 300);
}

}
