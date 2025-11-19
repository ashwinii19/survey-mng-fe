// import { SurveyStats } from './survey-stats';

// export interface DashboardResponse {
//   totalEmployees: number;
//   totalSurveys: number;
//   totalSubmitted: number;
//   totalPending: number;
//   departmentStats?: DepartmentStats[];
//   surveyStats?: SurveyStats;
// }

// // Re-export DepartmentStats with all required properties
// export interface DepartmentStats {
//   id?: number;
//   departmentId?: number;
//   departmentID?: number;
//   department_id?: number;
//   name?: string;
//   departmentName?: string;
//   department?: string;
//   totalEmployees?: number;
//   employeeCount?: number;
//   submittedCount?: number;
//   totalSubmitted?: number;
//   responseRate?: number;
//   rate?: number;
//   percentage?: number;
//   totalPending?: number;
//   pendingCount?: number;
//   completionRate?: number;
//   participationRate?: number;
// }

// export type { SurveyStats };


export interface DepartmentStat {
  departmentId?: number;
  id?: number;
  name?: string;
  departmentName?: string;
  totalEmployees?: number;
  submitted?: number;
  pending?: number;
  responseRate?: number;
}

export interface SurveyStat {
  surveyId?: number;
  id?: number;
  title?: string;
  submitted?: number;
  pending?: number;
}

export interface DashboardResponse {
  totalEmployees: number;
  totalSubmitted: number;
  totalPending: number;

  departmentStats: any[];

  // 🔥 Add these two missing properties
  submittedEmployees: string[];
  pendingEmployees: string[];
}
