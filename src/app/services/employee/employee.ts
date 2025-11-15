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











// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment'; // Add this import
// import { Employee, EmployeeRequest, Department } from '../../models/employee';

// @Injectable({
//   providedIn: 'root'
// })
// export class EmployeeService {
//   private apiUrl = `${environment.apiBaseUrl}/employees`; // Use environment variable
//   private departmentApiUrl = `${environment.apiBaseUrl}/departments`; // Use environment variable

//   constructor(private http: HttpClient) { }

//   getEmployees(): Observable<Employee[]> {
//     console.log('Fetching employees from:', this.apiUrl);
//     return this.http.get<Employee[]>(this.apiUrl);
//   }

//   getEmployeeById(employeeId: string): Observable<Employee> {
//     console.log('Fetching employee by ID:', employeeId);
//     return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
//   }

//   createEmployee(employee: EmployeeRequest): Observable<Employee> {
//     console.log('Creating employee:', employee);
//     return this.http.post<Employee>(this.apiUrl, employee);
//   }

//   updateEmployee(employeeId: string, employee: EmployeeRequest): Observable<Employee> {
//     console.log('Updating employee:', employeeId, employee);
//     return this.http.put<Employee>(`${this.apiUrl}/${employeeId}`, employee);
//   }

//   deleteEmployee(employeeId: string): Observable<void> {
//     console.log('Deleting employee:', employeeId);
//     return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
//   }

//   getDepartments(): Observable<Department[]> {
//     console.log('Fetching departments from:', this.departmentApiUrl);
//     return this.http.get<Department[]>(this.departmentApiUrl);
//   }

//   getEmployeesByDepartment(departmentName: string): Observable<Employee[]> {
//     console.log('Fetching employees by department:', departmentName);
//     return this.http.get<Employee[]>(`${this.apiUrl}/department/${departmentName}`);
//   }
// }














import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, EmployeeRequest, Department } from '../../models/employee';
import { Auth } from '../auth/auth'; // Import your Auth service

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/employees`;
  private departmentApiUrl = `${environment.apiBaseUrl}/departments`;

  constructor(
    private http: HttpClient,
    private auth: Auth // Inject Auth service
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken(); // Use Auth service to get token
    console.log('Current token:', token);
    
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      // Return headers without Authorization if no token
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  private handleAuthError(error: any) {
    if (error.status === 401) {
      console.error('Authentication required. Please login.');
      // Redirect to login page or show login modal
    }
    return throwError(() => error);
  }

  getEmployees(): Observable<Employee[]> {
    console.log('Fetching employees from:', this.apiUrl);
    const headers = this.getAuthHeaders();
    console.log('Request headers:', headers);
    
    return this.http.get<Employee[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  getEmployeeById(employeeId: string): Observable<Employee> {
    console.log('Fetching employee by ID:', employeeId);
    const headers = this.getAuthHeaders();
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  createEmployee(employee: EmployeeRequest): Observable<Employee> {
    console.log('Creating employee:', employee);
    const headers = this.getAuthHeaders();
    return this.http.post<Employee>(this.apiUrl, employee, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  updateEmployee(employeeId: string, employee: EmployeeRequest): Observable<Employee> {
    console.log('Updating employee:', employeeId, employee);
    const headers = this.getAuthHeaders();
    return this.http.put<Employee>(`${this.apiUrl}/${employeeId}`, employee, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  deleteEmployee(employeeId: string): Observable<void> {
    console.log('Deleting employee:', employeeId);
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  getDepartments(): Observable<Department[]> {
    console.log('Fetching departments from:', this.departmentApiUrl);
    const headers = this.getAuthHeaders();
    return this.http.get<Department[]>(this.departmentApiUrl, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }

  getEmployeesByDepartment(departmentName: string): Observable<Employee[]> {
    console.log('Fetching employees by department:', departmentName);
    const headers = this.getAuthHeaders();
    return this.http.get<Employee[]>(`${this.apiUrl}/department/${departmentName}`, { headers }).pipe(
      catchError(this.handleAuthError)
    );
  }
}