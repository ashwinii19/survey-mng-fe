import { SurveyStats } from './survey-stats';

export interface DashboardResponse {
  totalEmployees: number;
  totalSurveys: number;
  totalSubmitted: number;
  totalPending: number;
  departmentStats?: DepartmentStats[];
  surveyStats?: SurveyStats;
}

// Re-export DepartmentStats with all required properties
export interface DepartmentStats {
  id?: number;
  departmentId?: number;
  departmentID?: number;
  department_id?: number;
  name?: string;
  departmentName?: string;
  department?: string;
  totalEmployees?: number;
  employeeCount?: number;
  submittedCount?: number;
  totalSubmitted?: number;
  responseRate?: number;
  rate?: number;
  percentage?: number;
  totalPending?: number;
  pendingCount?: number;
  completionRate?: number;
  participationRate?: number;
}

export type { SurveyStats };