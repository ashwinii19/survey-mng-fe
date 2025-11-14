// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Employee, EmployeeRequest, Department } from '../../models/employee';

// @Injectable({
//   providedIn: 'root'
// })
// export class EmployeeService {
//   private apiUrl = 'http://localhost:8080/api/employees';
//   private departmentApiUrl = 'http://localhost:8080/api/departments';

//   constructor(private http: HttpClient) { }

//   getEmployees(): Observable<Employee[]> {
//     return this.http.get<Employee[]>(this.apiUrl);
//   }

//   getEmployeeById(employeeId: string): Observable<Employee> {
//     return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
//   }

//   createEmployee(employee: EmployeeRequest): Observable<Employee> {
//     return this.http.post<Employee>(this.apiUrl, employee);
//   }

//   updateEmployee(employeeId: string, employee: EmployeeRequest): Observable<Employee> {
//     return this.http.put<Employee>(`${this.apiUrl}/${employeeId}`, employee);
//   }

//   deleteEmployee(employeeId: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
//   }

//   getDepartments(): Observable<Department[]> {
//     return this.http.get<Department[]>(this.departmentApiUrl);
//   }

//   getEmployeesByDepartment(departmentName: string): Observable<Employee[]> {
//     return this.http.get<Employee[]>(`${this.apiUrl}/department/${departmentName}`);
//   }
// }











import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Add this import
import { Employee, EmployeeRequest, Department } from '../../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/employees`; // Use environment variable
  private departmentApiUrl = `${environment.apiBaseUrl}/departments`; // Use environment variable

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    console.log('Fetching employees from:', this.apiUrl);
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    console.log('Fetching employee by ID:', employeeId);
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  createEmployee(employee: EmployeeRequest): Observable<Employee> {
    console.log('Creating employee:', employee);
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(employeeId: string, employee: EmployeeRequest): Observable<Employee> {
    console.log('Updating employee:', employeeId, employee);
    return this.http.put<Employee>(`${this.apiUrl}/${employeeId}`, employee);
  }

  deleteEmployee(employeeId: string): Observable<void> {
    console.log('Deleting employee:', employeeId);
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
  }

  getDepartments(): Observable<Department[]> {
    console.log('Fetching departments from:', this.departmentApiUrl);
    return this.http.get<Department[]>(this.departmentApiUrl);
  }

  getEmployeesByDepartment(departmentName: string): Observable<Employee[]> {
    console.log('Fetching employees by department:', departmentName);
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${departmentName}`);
  }
}