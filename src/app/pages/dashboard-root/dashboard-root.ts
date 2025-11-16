// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// // IMPORTS BASED ON NAMED/DEFAULT EXPORTS
// import { Sidebar } from '../../layout/sidebar/sidebar';
// import Header from '../../layout/header/header';

// import { CardsPanel } from '../cards-panel/cards-panel';
// import { FiltersPanel } from '../filters-panel/filters-panel';
// import DepartmentCharts from '../department-charts/department-charts';
// import SurveyCharts from '../survey-charts/survey-charts';
// import RecentSurveys from '../recent-surveys/recent-surveys';
// import SubmittedTable from '../submitted-table/submitted-table';
// import PendingTable from '../pending-table/pending-table';

// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardResponse } from '../../models/dashboard-response';

// @Component({
//   selector: 'app-dashboard-root',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule,
//     Sidebar, Header,
//     CardsPanel, FiltersPanel,
//     DepartmentCharts, SurveyCharts,
//     RecentSurveys, SubmittedTable, PendingTable
//   ],
//   templateUrl: './dashboard-root.html',
//   styleUrls: ['./dashboard-root.css']
// })
// export default class DashboardRoot implements OnInit {

//   dashboard?: DashboardResponse;
//   surveys: any[] = [];
//   departments: any[] = [];

//   selectedSurveyId?: number;
//   selectedDepartmentId?: number;

//   recentSurveys: any[] = [];
//   submittedList: any[] = [];
//   pendingList: any[] = [];

//   constructor(private svc: DashboardService) {}

//   ngOnInit(): void {
//     this.loadFilters();
//     this.loadDashboard();
//     this.loadRightColumnData();
//   }

//   loadFilters() {
//     this.svc.getSurveys().subscribe(s => this.surveys = s || []);
//     this.svc.getDepartments().subscribe(d => this.departments = d || []);
//   }

//   loadDashboard() {
//     this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe(res => this.dashboard = res);
//   }

//   loadRightColumnData() {
//     this.svc.getRecentSurveys().subscribe(r => this.recentSurveys = r || []);
//     this.svc.getSubmitted(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe(s => this.submittedList = s || []);
//     this.svc.getPending(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe(p => this.pendingList = p || []);
//   }

//   onFilterChange() {
//     this.loadDashboard();
//     this.loadRightColumnData();
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// // LAYOUT
// import { Sidebar } from '../../layout/sidebar/sidebar';
// import Header from '../../layout/header/header';

// // CHILD COMPONENTS
// import { CardsPanel } from '../cards-panel/cards-panel';
// import { FiltersPanel } from '../filters-panel/filters-panel';
// import DepartmentCharts from '../department-charts/department-charts';
// import SurveyCharts from '../survey-charts/survey-charts';
// import RecentSurveys from '../recent-surveys/recent-surveys';
// import SubmittedTable from '../submitted-table/submitted-table';
// import PendingTable from '../pending-table/pending-table';

// // SERVICES + MODELS
// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardResponse } from '../../models/dashboard-response';

// @Component({
//   selector: 'app-dashboard-root',
//   standalone: true,
//   imports: [
//     CommonModule, FormsModule,
//     Sidebar, Header,
//     CardsPanel, FiltersPanel,
//     DepartmentCharts, SurveyCharts,
//     RecentSurveys, SubmittedTable, PendingTable
//   ],
//   templateUrl: './dashboard-root.html',
//   styleUrls: ['./dashboard-root.css']
// })
// export default class DashboardRoot implements OnInit {

//   dashboard?: DashboardResponse;
//   surveys: any[] = [];
//   departments: any[] = [];

//   selectedSurveyId?: number;
//   selectedDepartmentId?: number;

//   recentSurveys: any[] = [];
//   submittedList: any[] = [];
//   pendingList: any[] = [];

//   constructor(private svc: DashboardService) {}

//   // -------------------------------------------------------------------------------------
//   // INIT — WAIT FOR TOKEN BEFORE LOADING DASHBOARD (FIX FOR 500 ERRORS)
//   // -------------------------------------------------------------------------------------
//   ngOnInit(): void {
//     this.initAfterAuth();
//   }

//   private initAfterAuth() {
//     const timer = setInterval(() => {
//       const token = localStorage.getItem('authToken');

//       if (token && token.trim().length > 0) {
//         clearInterval(timer);
//         console.log("DashboardRoot: Auth token detected → loading dashboard.");

//         this.loadFilters();
//         this.loadDashboard();
//         this.loadRightColumnData();
//       }
//     }, 300);
//   }

//   // -------------------------------------------------------------------------------------
//   // LOAD FILTERS (SURVEYS + DEPARTMENTS)
//   // -------------------------------------------------------------------------------------
//   loadFilters() {
//     this.svc.getSurveys().subscribe({
//       next: s => this.surveys = s || [],
//       error: err => console.error("Error loading surveys:", err)
//     });

//     this.svc.getDepartments().subscribe({
//       next: d => this.departments = d || [],
//       error: err => console.error("Error loading departments:", err)
//     });
//   }

//   // -------------------------------------------------------------------------------------
//   // MAIN DASHBOARD METRICS
//   // -------------------------------------------------------------------------------------
//   loadDashboard() {
//     this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe({
//         next: res => this.dashboard = res,
//         error: err => console.error("Dashboard load error:", err)
//       });
//   }

//   // -------------------------------------------------------------------------------------
//   // RIGHT SIDE COLUMN — RECENT, SUBMITTED, PENDING
//   // -------------------------------------------------------------------------------------
//   loadRightColumnData() {
//     this.svc.getRecentSurveys().subscribe({
//       next: r => this.recentSurveys = r || [],
//       error: err => console.error("Error loading recent surveys:", err)
//     });

//     this.svc.getSubmitted(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe({
//         next: s => this.submittedList = s || [],
//         error: err => console.error("Error loading submitted list:", err)
//       });

//     this.svc.getPending(this.selectedSurveyId, this.selectedDepartmentId)
//       .subscribe({
//         next: p => this.pendingList = p || [],
//         error: err => console.error("Error loading pending list:", err)
//       });
//   }

//   // -------------------------------------------------------------------------------------
//   // FILTER CHANGE HANDLER
//   // -------------------------------------------------------------------------------------
//   onFilterChange() {
//     this.loadDashboard();
//     this.loadRightColumnData();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// LAYOUT
import { Sidebar } from '../../layout/sidebar/sidebar';
import Header from '../../layout/header/header';

// CHILD COMPONENTS
import { CardsPanel } from '../cards-panel/cards-panel';
import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SurveyCharts from '../survey-charts/survey-charts';
import { RecentSurveys  } from '../recent-surveys/recent-surveys';
import SubmittedTable from '../submitted-table/submitted-table';
import PendingTable from '../pending-table/pending-table';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response';

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    Sidebar, Header,
    CardsPanel, FiltersPanel,
    DepartmentCharts, SurveyCharts,
    RecentSurveys, SubmittedTable, PendingTable
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

  // recentSurveys: any[] = [];
  submittedList: any[] = [];
  pendingList: any[] = [];

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
        this.loadRightColumn();
      }
    }, 300);
  }

  // FILTERS
  loadFilters() {
    this.svc.getSurveys().subscribe(res => this.surveys = res);
    this.svc.getDepartments().subscribe(res => this.departments = res);
  }

  // MAIN DASHBOARD
  loadDashboard() {
    this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(res => this.dashboard = res);
  }

  // RIGHT SIDE COMPONENTS
  loadRightColumn() {
    // this.svc.getRecentSurveys().subscribe(r => this.recentSurveys = r);
    this.svc.getSubmitted(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(s => this.submittedList = s);
    this.svc.getPending(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(p => this.pendingList = p);
  }

  onFilterChange() {
    this.loadDashboard();
    this.loadRightColumn();
  }
}
