









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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response';

// standalone child components (adjust paths if your files live elsewhere)
import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SubmittedTable from '../submitted-table/submitted-table';
import PendingTable from '../pending-table/pending-table';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltersPanel, DepartmentCharts, SubmittedTable, PendingTable],
  templateUrl: './dashboard-root.html',
  styleUrls: ['./dashboard-root.css']
})
export default class DashboardRoot implements OnInit {

  dashboard?: DashboardResponse;
  surveys: any[] = [];
  departments: any[] = [];

  // selected filter values
  selectedSurveyId?: number | null = null;
  selectedDepartmentId?: number | null = null;

  // UI state
  showResults = false;           // charts/tables visible only after Apply
  showAssignmentAlert = false;   // when survey not assigned to selected dept

  // KPI values
  totalEmployees = 0;
  submittedCount = 0;
  remainingCount = 0;
  submissionRate = 0;

  // export UI
  isExporting = false;
  exportMessage = '';

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.loadFilters();
  }

  /**
   * Load surveys and departments.
   * Auto-select the *first created* survey as default, but DO NOT automatically
   * load dashboard results — user must click Apply (filterChanged).
   */
  loadFilters() {
    this.svc.getSurveys().subscribe({
      next: (res) => {
        this.surveys = res ?? [];

        if (this.surveys.length > 0) {
          // pick the *first created* survey as default (earliest createdAt)
          const sorted = [...this.surveys].sort((a, b) => {
            const aDate = new Date(a.createdAt ?? a.publishedAt ?? 0).getTime();
            const bDate = new Date(b.createdAt ?? b.publishedAt ?? 0).getTime();
            return aDate - bDate;
          });
          const first = sorted[0];
          this.selectedSurveyId = first?.id ?? first?.surveyId ?? null;
        }
        // DO NOT call loadDashboard() here — only show after Apply
      },
      error: (err) => {
        console.error('Failed to load surveys', err);
      }
    });

    this.svc.getDepartments().subscribe({
      next: (res) => {
        this.departments = res ?? [];
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  /**
   * Called by FiltersPanel when user clicks Apply.
   * Show charts/tables and fetch dashboard data.
   */
 onFilterChange() {
  this.showResults = true;     // show charts only after Apply
  this.loadDashboard();
}

  loadDashboard() {
    // pass undefined/null only if not set
    const sId = this.selectedSurveyId ?? undefined;
    const dId = this.selectedDepartmentId ?? undefined;

    this.svc.getDashboard(sId as any, dId as any).subscribe({
      next: (res) => {
        this.dashboard = res;
        this.computeKPIs();
        this.checkSurveyDepartmentMatch();
      },
      error: (err) => {
        console.error('Dashboard API error', err);
        // keep UI consistent: clear dashboard and recalc
        this.dashboard = undefined;
        this.computeKPIs();
        this.checkSurveyDepartmentMatch();
      }
    });
  }

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

    this.submissionRate = this.totalEmployees > 0
      ? Math.round((this.submittedCount / this.totalEmployees) * 100)
      : 0;
  }

  /**
   * If the selected survey has a targetDepartment and the user selected
   * a different department, show an alert.
   */
  private checkSurveyDepartmentMatch() {
    this.showAssignmentAlert = false;

    if (!this.selectedSurveyId || !this.selectedDepartmentId) {
      // Only check when both survey and department are selected
      return;
    }

    // Find survey object from the cached surveys list (may differ in shape)
    const survey = this.surveys.find(s => (s.id ?? s.surveyId) === this.selectedSurveyId);
    if (!survey) return;

    // targetDepartment may be object or id depending on backend.
    const targetDept = survey.targetDepartment ?? survey.targetDepartmentId ?? survey.target_department_id;
    if (!targetDept) return; // survey not assigned -> no alert

    let targetDeptId: number | null = null;
    if (typeof targetDept === 'number') {
      targetDeptId = targetDept;
    } else if (typeof targetDept === 'string') {
      const parsed = parseInt(targetDept, 10);
      targetDeptId = Number.isNaN(parsed) ? null : parsed;
    } else if (typeof targetDept === 'object' && targetDept !== null) {
      targetDeptId = Number(targetDept.id ?? targetDept.departmentId ?? targetDept.id);
    }

    if (targetDeptId != null && targetDeptId !== (this.selectedDepartmentId as number)) {
      this.showAssignmentAlert = true;
    } else {
      this.showAssignmentAlert = false;
    }
  }

  // ----------------- EXPORTS -----------------
  async exportPDF() {
    if (!this.dashboard) {
      this.exportMessage = 'No data to export';
      setTimeout(() => (this.exportMessage = ''), 2500);
      return;
    }
    this.isExporting = true;
    try {
      const el = document.querySelector('.content') as HTMLElement;
      if (!el) throw new Error('content area not found');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`dashboard-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.pdf`);
      this.exportMessage = 'PDF downloaded';
    } catch (err) {
      console.error(err);
      this.exportMessage = 'PDF export failed';
    } finally {
      this.isExporting = false;
      setTimeout(() => (this.exportMessage = ''), 3000);
    }
  }

  exportCSV() {
    if (!this.dashboard) {
      this.exportMessage = 'No data';
      setTimeout(() => (this.exportMessage = ''), 2500);
      return;
    }
    let csv = 'Metric,Value\n';
    csv += `Total Employees,${this.totalEmployees}\n`;
    csv += `Submitted,${this.submittedCount}\n`;
    csv += `Pending,${this.remainingCount}\n\n`;
    if (this.dashboard.departmentStats?.length) {
      csv += 'Department,Submitted,Pending,Total\n';
      this.dashboard.departmentStats.forEach((ds: any) => {
        const name = ds.name ?? ds.departmentName ?? 'Unknown';
        csv += `${name},${ds.submitted ?? 0},${ds.pending ?? 0},${ds.totalEmployees ?? 0}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.exportMessage = 'CSV downloaded';
    setTimeout(() => (this.exportMessage = ''), 3000);
  }

  exportPPT() {
    this.exportMessage = 'PPT export currently unavailable';
    setTimeout(() => (this.exportMessage = ''), 2000);
  }
}
