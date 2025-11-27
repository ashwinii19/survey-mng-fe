import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee';
import { Employee, Department } from '../../models/employee';
 
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./employee-list.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  departments: Department[] = [];
  searchTerm: string = '';
  selectedDepartment: string = '';
  isLoading: boolean = false;
  error: string = '';
 
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
 
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }
 
  // Add these computed properties
  get totalEmployees(): number {
    return this.employees.length;
  }
 
  get activeEmployeesCount(): number {
    return this.employees.filter(e => e.status === 'Active').length;
  }
 
  get departmentsCount(): number {
    return this.departments.length;
  }
 
  get showingEmployeesCount(): number {
    return this.filteredEmployees.length;
  }
 
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
       
        // DEBUG: Check status values
        if (data && data.length > 0) {
          const allStatuses = data.map(emp => emp.status);
          const uniqueStatuses = [...new Set(allStatuses)];
          console.log('📊 ALL STATUS VALUES FOUND:', uniqueStatuses);
         
          // Check first few employees in detail
          data.slice(0, 5).forEach((emp, index) => {
            console.log(`Employee ${index + 1}:`, {
              name: emp.name,
              status: emp.status,
              statusType: typeof emp.status,
              hasStatus: !!emp.status,
              statusLength: emp.status ? emp.status.length : 0
            });
          });
        }
       
        this.employees = data || [];
        this.filteredEmployees = data || [];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.error = 'Failed to load employees. Please try again.';
        this.isLoading = false;
        this.employees = [];
        this.filteredEmployees = [];
        this.updatePagination();
      }
    });
  }
 
  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (data) => {
        console.log('Departments loaded successfully:', data);
        this.departments = data || [];
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.departments = [];
      }
    });
  }
 
  // ADD THIS MISSING METHOD
  getStatusClass(status: string): string {
    console.log('🔍 getStatusClass called with:', status);
   
    if (!status) {
      console.log('❌ Status is null/undefined, using default');
      return 'bg-secondary text-white';
    }
   
    const statusLower = status.toLowerCase().trim();
    console.log('📝 Status after processing:', statusLower);
   
    if (statusLower.includes('active')) {
      console.log('✅ Matched Active status');
      return 'bg-success text-white';
    }
    if (statusLower.includes('inactive')) {
      console.log('✅ Matched Inactive status');
      return 'bg-danger text-white';
    }
    if (statusLower.includes('pending')) {
      console.log('✅ Matched Pending status');
      return 'bg-warning text-dark';
    }
    if (statusLower.includes('leave')) {
      console.log('✅ Matched On Leave status');
      return 'bg-info text-white';
    }
   
    console.log('❓ Unknown status, using default');
    return 'bg-secondary text-white';
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
   
    // Reset to first page after filtering
    this.currentPage = 1;
    this.updatePagination();
  }
 
  onSearchChange(): void {
    this.applyFilters();
  }
 
  onDepartmentChange(): void {
    this.applyFilters();
  }
 
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = '';
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
    this.updatePagination();
    console.log('Filters cleared, showing all employees');
  }
 
  addEmployee(): void {
    this.router.navigate(['/app/employees/add']);
  }
 
  editEmployee(employeeId: string): void {
    this.router.navigate(['/app/employees/edit', employeeId]);
  }
 
  importBatch(): void {
    this.router.navigate(['/app/employees/batch/import']);
  }
 
  viewBatchStatus(): void {
    this.router.navigate(['/app/employees/batch/status']);
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
 
  // Pagination methods
  getPaginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }
 
  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
 
  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }
 
  get totalPagesCount(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }
 
  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPagesCount, startPage + maxVisiblePages - 1);
 
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
 
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPagesCount) {
      this.currentPage = page;
    }
  }
 
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPagesCount) {
      this.currentPage++;
    }
  }
 
  // onPageSizeChange(): void {
  //   this.currentPage = 1; // Reset to first page when page size changes
  //   this.updatePagination();
  // }
 
  updatePagination(): void {
    this.totalPages = this.totalPagesCount;
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
  }
}
