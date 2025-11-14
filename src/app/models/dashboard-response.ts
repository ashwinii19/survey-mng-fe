import { DepartmentStats } from './department-stats';
import { SurveyStats } from './survey-stats';

export interface DashboardResponse {
  totalEmployees: number;
  totalSurveys: number;
  totalSubmitted: number;
  totalPending: number;
  departmentStats?: DepartmentStats[];
  surveyStats?: SurveyStats;
}
