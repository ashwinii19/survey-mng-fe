import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// IMPORTS BASED ON NAMED/DEFAULT EXPORTS
import { Sidebar } from '../../layout/sidebar/sidebar';
import Header from '../../layout/header/header';

import { CardsPanel } from '../cards-panel/cards-panel';
import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SurveyCharts from '../survey-charts/survey-charts';
import RecentSurveys from '../recent-surveys/recent-surveys';
import SubmittedTable from '../submitted-table/submitted-table';
import PendingTable from '../pending-table/pending-table';

import { DashboardService } from '../../services/dashboard';
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

  recentSurveys: any[] = [];
  submittedList: any[] = [];
  pendingList: any[] = [];

  constructor(private svc: DashboardService) {}

  ngOnInit(): void {
    this.loadFilters();
    this.loadDashboard();
    this.loadRightColumnData();
  }

  loadFilters() {
    this.svc.getSurveys().subscribe(s => this.surveys = s || []);
    this.svc.getDepartments().subscribe(d => this.departments = d || []);
  }

  loadDashboard() {
    this.svc.getDashboard(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(res => this.dashboard = res);
  }

  loadRightColumnData() {
    this.svc.getRecentSurveys().subscribe(r => this.recentSurveys = r || []);
    this.svc.getSubmitted(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(s => this.submittedList = s || []);
    this.svc.getPending(this.selectedSurveyId, this.selectedDepartmentId)
      .subscribe(p => this.pendingList = p || []);
  }

  onFilterChange() {
    this.loadDashboard();
    this.loadRightColumnData();
  }
}
