
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

 
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./components/verify-otp/verify-otp').then(m => m.VerifyOtp)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password').then(m => m.ResetPassword)
  },


  {
    path: 'app',
    loadComponent: () =>
      import('./layout/main-layout').then(m => m.default),
    canActivate: [AuthGuard],
    children: [
    
      { 
        path: 'dashboard', 
        loadComponent: () =>
          import('./pages/dashboard-root/dashboard-root').then(m => (m as any).DashboardRoot || (m as any).default || (m as any).Dashboard)
      },
      
    
      { 
        path: 'employees', 
        loadComponent: () =>
          import('./components/employee/employee-list').then(m => m.EmployeeList)
      },
      { 
        path: 'employees/add', 
        loadComponent: () =>
          import('./components/employee/employee-form').then(m => m.EmployeeForm)
      },
      { 
        path: 'employees/edit/:id', 
        loadComponent: () =>
          import('./components/employee/employee-form').then(m => m.EmployeeForm)
      },
      
      { 
        path: 'employees/batch/import', 
        loadComponent: () =>
          import('./components/employee/employee-batch-import/employee-batch-import').then(m => m.EmployeeBatchImportComponent)
      },
      { 
        path: 'employees/batch/status/:id', 
        loadComponent: () =>
          import('./components/employee/employee-batch-status/employee-batch-status').then(m => m.EmployeeBatchStatusComponent)
      },

      
      {
        path: 'surveys',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/recent-surveys/recent-surveys').then(m => m.RecentSurveys)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./components/create-survey.component/create-survey.component').then(m => m.CreateSurveyComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/create-survey.component/create-survey.component').then(m => m.CreateSurveyComponent)
          }
        ]
      },

      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

 
  { path: 'dashboard', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'employees', redirectTo: 'app/employees', pathMatch: 'full' },
  { path: 'employees/add', redirectTo: 'app/employees/add', pathMatch: 'full' },
  { path: 'surveys', redirectTo: 'app/surveys', pathMatch: 'full' },
  { path: 'surveys/create', redirectTo: 'app/surveys/create', pathMatch: 'full' },

  
  { path: '**', redirectTo: 'app/dashboard' }
];