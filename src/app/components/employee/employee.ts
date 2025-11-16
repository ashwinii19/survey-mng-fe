
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { EmployeeService } from '../../services/employee/employee';
import { EmployeeRequest, Department } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.html',
  standalone: true,
  imports: [CommonModule, FormsModule] // Add FormsModule here
})
export class EmployeeForm implements OnInit {
  employee: EmployeeRequest = {
    employeeId: '',
    name: '',
    email: '',
    position: '',
    status: 'Active',
    joinDate: '',
    departmentId: 0
  };
  
  departments: Department[] = [];
  isEditMode: boolean = false;
  isLoading: boolean = false;
  employeeId: string = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.isEditMode = !!this.employeeId;
    
    if (this.isEditMode) {
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employee = {
          employeeId: data.employeeId,
          name: data.name,
          email: data.email,
          position: data.position,
          status: data.status,
          joinDate: data.joinDate,
          departmentId: data.department.id
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.isLoading = false;
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Error creating employee:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}