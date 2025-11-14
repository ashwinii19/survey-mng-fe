


// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; // ADD THIS IMPORT
// import { EmployeeService } from '../../services/employee/employee';
// import { Employee, Department } from '../../models/employee';

// @Component({
//   selector: 'app-employee-list',
//   templateUrl: './employee-list.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule] // ADD FormsModule HERE
//   // REMOVE: styleUrls: ['./employee-list.css'] - since the file doesn't exist
// })
// export class EmployeeList implements OnInit {
//   employees: Employee[] = [];
//   filteredEmployees: Employee[] = [];
//   departments: Department[] = [];
//   searchTerm: string = '';
//   selectedDepartment: string = '';
//   isLoading: boolean = false;

//   constructor(
//     private employeeService: EmployeeService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loadEmployees();
//     this.loadDepartments();
//   }

//   loadEmployees(): void {
//     this.isLoading = true;
//     this.employeeService.getEmployees().subscribe({
//       next: (data) => {
//         this.employees = data;
//         this.filteredEmployees = data;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading employees:', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   loadDepartments(): void {
//     this.employeeService.getDepartments().subscribe({
//       next: (data) => {
//         this.departments = data;
//       },
//       error: (error) => {
//         console.error('Error loading departments:', error);
//       }
//     });
//   }

//   applyFilters(): void {
//     this.filteredEmployees = this.employees.filter(employee => {
//       const matchesSearch = !this.searchTerm || 
//         employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         employee.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
//       const matchesDepartment = !this.selectedDepartment || 
//         employee.department.name === this.selectedDepartment;
      
//       return matchesSearch && matchesDepartment;
//     });
//   }

//   onSearchChange(): void {
//     this.applyFilters();
//   }

//   onDepartmentChange(): void {
//     this.applyFilters();
//   }

//   addEmployee(): void {
//     this.router.navigate(['/employees/add']);
//   }

//   editEmployee(employeeId: string): void {
//     this.router.navigate(['/employees/edit', employeeId]);
//   }

//   deleteEmployee(employeeId: string): void {
//     if (confirm('Are you sure you want to delete this employee?')) {
//       this.employeeService.deleteEmployee(employeeId).subscribe({
//         next: () => {
//           this.loadEmployees();
//         },
//         error: (error) => {
//           console.error('Error deleting employee:', error);
//         }
//       });
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee';
import { Employee, Department } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  searchTerm: string = '';
  selectedDepartment: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.error = '';
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        console.log('Employees loaded successfully:', data);
        this.employees = data;
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.error = 'Failed to load employees. Please try again.';
        this.isLoading = false;
        this.employees = [];
        this.filteredEmployees = [];
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (data) => {
        console.log('Departments loaded successfully:', data);
        this.departments = data;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
      }
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = !this.searchTerm || 
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || 
        employee.department.name === this.selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDepartmentChange(): void {
    this.applyFilters();
  }

  addEmployee(): void {
    this.router.navigate(['/app/employees/add']);
  }

  editEmployee(employeeId: string): void {
    this.router.navigate(['/app/employees/edit', employeeId]);
  }

  deleteEmployee(employeeId: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.loadEmployees(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
        }
      });
    }
  }
}