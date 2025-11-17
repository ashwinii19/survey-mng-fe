
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { Sidebar } from '../../layout/sidebar/sidebar';
import Header from '../../layout/header/header';


import { CardsPanel } from '../cards-panel/cards-panel';
import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SurveyCharts from '../survey-charts/survey-charts';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    Sidebar, Header,
    CardsPanel, FiltersPanel,
    DepartmentCharts, SurveyCharts
  ],
  templateUrl: './dashboard-root.html',
  styleUrls: ['./dashboard-root.css']
})
export default class DashboardRoot implements OnInit {

  dashboard?: DashboardResponse;

  surveys: any[] = [];
  departments: any[] = [];

  selectedSurveyId?: number;
  selectedDepartmentId?: number;

  
  showFilteredData: boolean = false;
  totalEmployees: number = 0;
  submittedCount: number = 0;
  remainingCount: number = 0;
  submissionRate: number = 0;
  
  
  exportSuccess: boolean = false;
  exportMessage: string = '';
  isExporting: boolean = false;

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.waitForAuth();
  }

  private waitForAuth() {
    const timer = setInterval(() => {
      if (localStorage.getItem("authToken")) {
        clearInterval(timer);
        this.loadFilters();
        this.loadDashboard();
      }
    }, 300);
  }

 
  loadFilters() {
    this.svc.getSurveys().subscribe(res => this.surveys = res);
    this.svc.getDepartments().subscribe(res => this.departments = res);
  }

 
  loadDashboard() {
    this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(res => {
        this.dashboard = res;
        console.log('Dashboard data:', res); // Debug log to check actual data structure
        console.log('Department stats:', res.departmentStats); // Debug log
        this.calculateSubmissionStats();
      });
  }

  onFilterChange() {
    this.showFilteredData = !!this.selectedSurveyId || !!this.selectedDepartmentId;
    this.loadDashboard();
  }

  private calculateSubmissionStats() {
    if (this.dashboard) {
      
      this.submittedCount = this.dashboard.totalSubmitted || 0;
      this.remainingCount = this.dashboard.totalPending || 0;
      this.totalEmployees = this.submittedCount + this.remainingCount;
      this.submissionRate = this.totalEmployees > 0 
        ? Math.round((this.submittedCount / this.totalEmployees) * 100) 
        : 0;
    }
  }


  async exportPDF() {
    if (!this.showFilteredData) {
      this.exportMessage = 'Please apply filters first to export data';
      this.exportSuccess = false;
      return;
    }

    this.isExporting = true;
    
    try {
    
      const element = document.querySelector('.content') as HTMLElement;
      
      if (!element) {
        throw new Error('Could not find dashboard content');
      }

      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
     
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

     
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Survey-Dashboard-${timestamp}.pdf`;
      
      
      pdf.save(filename);
      
      this.exportSuccess = true;
      this.exportMessage = 'PDF downloaded successfully!';
      
    } catch (error) {
      console.error('PDF export error:', error);
      this.exportSuccess = false;
      this.exportMessage = 'Failed to export PDF. Please try again.';
    } finally {
      this.isExporting = false;
      setTimeout(() => {
        this.exportSuccess = false;
        this.exportMessage = '';
      }, 5000);
    }
  }


  exportPPT() {
    if (!this.showFilteredData) {
      this.exportMessage = 'Please apply filters first to export data';
      this.exportSuccess = false;
      return;
    }

    this.isExporting = true;
    
    try {
     
      this.exportPDF();
      
    } catch (error) {
      console.error('PPT export error:', error);
      this.exportSuccess = false;
      this.exportMessage = 'PPT export is not available yet. PDF exported instead.';
      this.isExporting = false;
    }
  }

  
  exportCSV() {
    if (!this.dashboard) {
      this.exportMessage = 'No data available to export';
      this.exportSuccess = false;
      return;
    }

    try {
     
      let csvContent = 'Survey Dashboard Export\n\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Employees,${this.totalEmployees}\n`;
      csvContent += `Submitted,${this.submittedCount}\n`;
      csvContent += `Remaining,${this.remainingCount}\n`;
      csvContent += `Submission Rate,${this.submissionRate}%\n\n`;
      
      
      if (this.dashboard.departmentStats?.length) {
        csvContent += 'Department,Response Rate\n';
        this.dashboard.departmentStats.forEach(dept => {
        
          const deptName = (dept as any).name || (dept as any).departmentName || (dept as any).department || 'Unknown Department';
          const responseRate = (dept as any).responseRate || (dept as any).rate || (dept as any).percentage || 0;
          csvContent += `${deptName},${responseRate}%\n`;
        });
      }

      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      link.href = url;
      link.download = `Survey-Data-${timestamp}.csv`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      
      this.exportSuccess = true;
      this.exportMessage = 'CSV downloaded successfully!';
      
    } catch (error) {
      console.error('CSV export error:', error);
      this.exportSuccess = false;
      this.exportMessage = 'Failed to export CSV. Please try again.';
    } finally {
      setTimeout(() => {
        this.exportSuccess = false;
        this.exportMessage = '';
      }, 5000);
    }
  }
}