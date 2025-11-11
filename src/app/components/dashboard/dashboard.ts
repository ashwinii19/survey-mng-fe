import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { DashboardService } from '../../services/dashboard/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, FormsModule, NgChartsModule, DatePipe, DecimalPipe]
})
export class Dashboard implements OnInit {
  isCollapsed = false;
  dropdownOpen = false;
  profileImage = 'assets/profile.png';
  adminName = 'Admin';
  adminRole = 'Administrator';

  animatedTotalSurveys = 0;
  animatedTotalResponses = 0;
  animatedPendingResponses = 0;

  departments: any[] = [];
  surveys: any[] = [];
  submittedEmployees: any[] = [];
  pendingEmployees: any[] = [];

  selectedDept = 'All Departments';
  selectedSurvey = 'All Surveys';
  fromDate: string = '';
  toDate: string = '';

  filterApplied = false;
  activeFilter: 'department' | 'survey' = 'department';

  // Charts
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ label: 'Response Rate', data: [] }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 100 } }
  };

  pieChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#14b8a6', '#f59e0b', '#3b82f6', '#ef4444'] }]
  };

  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  loadDashboardData() {
    this.dashboardService.getSummary().subscribe((summary: any) => {
      this.animatedTotalSurveys = summary.totalSurveys;
      this.animatedTotalResponses = summary.totalResponses;
      this.animatedPendingResponses = summary.pendingResponses;
    });

    this.dashboardService.getDepartments().subscribe((data: any) => {
      this.departments = data;
      this.barChartData.labels = data.map((d: any) => d.department);
      this.barChartData.datasets[0].data = data.map((d: any) => d.responseRate);
    });

    this.dashboardService.getSurveys().subscribe((data: any) => (this.surveys = data));
  }

  applyFilters() {
    this.filterApplied = true;

    if (this.activeFilter === 'department') {
      this.dashboardService
        .getResponseBreakdownByDepartment(this.selectedDept)
        .subscribe((data: any) => {
          this.pieChartData.labels = data.map((d: any) => d.category);
          this.pieChartData.datasets[0].data = data.map((d: any) => d.responseCount);
        });

      this.dashboardService.getEmployeesByStatus(true).subscribe((data: any) => (this.submittedEmployees = data));
      this.dashboardService.getEmployeesByStatus(false).subscribe((data: any) => (this.pendingEmployees = data));
    } else {
      this.dashboardService
        .getResponseBreakdownBySurvey(this.selectedSurvey)
        .subscribe((data: any) => {
          this.pieChartData.labels = data.map((d: any) => d.category);
          this.pieChartData.datasets[0].data = data.map((d: any) => d.responseCount);
        });
    }
  }

  clearFilters() {
    this.filterApplied = false;
    this.selectedDept = 'All Departments';
    this.selectedSurvey = 'All Surveys';
    this.fromDate = '';
    this.toDate = '';
  }

  exportPDF() {
    const dashboardElement = document.querySelector('.dashboard-body') as HTMLElement;
    if (!dashboardElement) return;
    html2canvas(dashboardElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Survey-Dashboard.pdf');
    });
  }

  exportPPT() {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText('Survey Dashboard Report', { x: 0.5, y: 0.5, fontSize: 20, bold: true });
    slide.addText(`Total Surveys: ${this.animatedTotalSurveys}`, { x: 0.5, y: 1.2 });
    slide.addText(`Total Responses: ${this.animatedTotalResponses}`, { x: 0.5, y: 1.6 });
    slide.addText(`Pending Responses: ${this.animatedPendingResponses}`, { x: 0.5, y: 2.0 });
    slide.addText('Response Breakdown:', { x: 0.5, y: 2.6, bold: true });
    this.pieChartData.labels?.forEach((label, i) => {
      const value = this.pieChartData.datasets[0].data[i];
      slide.addText(`${label}: ${value}`, { x: 0.8, y: 3 + i * 0.3 });
    });
    pptx.writeFile({ fileName: 'Survey-Dashboard.pptx' });
  }
}
