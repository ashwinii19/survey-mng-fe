export interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  position: string;
  status: string;
  joinDate: string;
  department: Department;
}

export interface Department {
  id: number;
  name: string;
}

export interface EmployeeRequest {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  status: string;
  joinDate: string;
  departmentId: number;
}