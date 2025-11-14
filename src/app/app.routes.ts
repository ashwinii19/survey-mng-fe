


import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { VerifyOtp } from './components/verify-otp/verify-otp';
import { ResetPassword } from './components/reset-password/reset-password';
import DashboardRoot from './pages/dashboard-root/dashboard-root';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => (m as any).Login || (m as any).default)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password').then(m => (m as any).ForgotPassword || (m as any).default)
  },

  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./components/verify-otp/verify-otp').then(m => (m as any).VerifyOtp || (m as any).default)
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password').then(m => (m as any).ResetPassword || (m as any).default)
  },

  // Main app routes with consistent layout (header + sidebar)
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/main-layout').then(m => (m as any).MainLayout || (m as any).default),
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      { 
        path: 'dashboard', 
        loadComponent: () =>
          import('./pages/dashboard-root/dashboard-root').then(m => (m as any).Dashboard || (m as any).default)
      },
      
      // Employees
      { 
        path: 'employees', 
        loadComponent: () =>
          import('./components/employee/employee-list').then(m => (m as any).EmployeeList || (m as any).default)
      },
      { 
        path: 'employees/add', 
        loadComponent: () =>
          import('./components/employee/employee-form').then(m => (m as any).EmployeeForm || (m as any).default)
      },
      { 
        path: 'employees/edit/:id', 
        loadComponent: () =>
          import('./components/employee/employee-form').then(m => (m as any).EmployeeForm || (m as any).default)
      },

      // Surveys
      { 
        path: 'surveys', 
        loadComponent: () =>
          import('./pages/recent-surveys/recent-surveys').then(m => (m as any).Surveys || (m as any).default)
      },

      // // Reminders
      // { 
      //   path: 'reminders', 
      //   loadComponent: () =>
      //     import('./pages/reminders/reminders').then(m => (m as any).Reminders || (m as any).default)
      // },

      // Default redirect to dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Redirect old routes to new layout routes
  { path: 'dashboard', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'employees', redirectTo: 'app/employees', pathMatch: 'full' },
  { path: 'employees/add', redirectTo: 'app/employees/add', pathMatch: 'full' },

  // Fallback
  { path: '**', redirectTo: 'app/dashboard' }
];