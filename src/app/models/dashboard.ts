// models/dashboard.ts
export interface DepartmentStats {
  departmentId?: number;
  departmentName?: string;
  totalEmployees?: number;
  submitted?: number;
  pending?: number;
  responseRate?: number;
}

export interface SurveyStats {
  surveyId?: number;
  surveyTitle?: string;
  totalEmployees?: number;
  totalSubmitted?: number;
  totalPending?: number;
}

export interface DashboardResponse {
  departmentStats?: DepartmentStats[];
  surveyStats?: SurveyStats;
  totalEmployees?: number;
  totalSubmitted?: number;
  totalPending?: number;
  submittedEmployees?: string[]; // "Name - E101"
  pendingEmployees?: string[];
}
