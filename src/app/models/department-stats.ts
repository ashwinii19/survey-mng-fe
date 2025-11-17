export interface DepartmentStats {
  id: number | undefined;
  departmentId: number | undefined;
  departmentName: string;
  totalEmployees: number;
  submitted: number;
  pending: number;
}
