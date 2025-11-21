
// import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth-guard';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   {
//     path: 'login',
//     loadComponent: () =>
//       import('./components/login/login').then(m => m.Login)
//   },
//   {
//     path: 'forgot-password',
//     loadComponent: () =>
//       import('./components/forgot-password/forgot-password').then(m => m.ForgotPassword)
//   },
//   {
//     path: 'verify-otp',
//     loadComponent: () =>
//       import('./components/verify-otp/verify-otp').then(m => m.VerifyOtp)
//   },
//   {
//     path: 'reset-password',
//     loadComponent: () =>
//       import('./components/reset-password/reset-password').then(m => m.ResetPassword)
//   },

//   {
//     path: 'app',
//     loadComponent: () =>
//       import('./layout/main-layout').then(m => m.default),
//     canActivate: [AuthGuard],
//     children: [
    
//       { 
//         path: 'dashboard', 
//         loadComponent: () =>
//           import('./pages/dashboard-root/dashboard-root').then(m => (m as any).DashboardRoot || (m as any).default || (m as any).Dashboard)
//       },
      
//       // KEEP EXISTING EMPLOYEE ROUTES FIRST (for direct access)
//       { 
//         path: 'employees', 
//         loadComponent: () =>
//           import('./components/employee/employee-list').then(m => m.EmployeeList)
//       },
//       { 
//         path: 'employees/add', 
//         loadComponent: () =>
//           import('./components/employee/employee-form').then(m => m.EmployeeForm)
//       },
//       { 
//         path: 'employees/edit/:id', 
//         loadComponent: () =>
//           import('./components/employee/employee-form').then(m => m.EmployeeForm)
//       },
//       { 
//         path: 'employees/batch/import', 
//         loadComponent: () =>
//           import('./components/employee/employee-batch-import/employee-batch-import').then(m => m.EmployeeBatchImportComponent)
//       },
//       { 
//         path: 'employees/batch/status/:id', 
//         loadComponent: () =>
//           import('./components/employee/employee-batch-status/employee-batch-status').then(m => m.EmployeeBatchStatusComponent)
//       },

//       // ONBOARDING SECTION - WITH DIFFERENT PATH NAMES
//       // {
//       //   path: 'onboarding',
//       //   children: [
//       //     {
//       //       path: '',
//       //       loadComponent: () =>
//       //         import('./components/onboarding/onboarding').then(m => m.Onboarding)
//       //     },
//       //     // USE DIFFERENT PATH NAMES FOR ONBOARDING EMPLOYEES
//       //     { 
//       //       path: 'onboarded-employees', 
//       //       loadComponent: () =>
//       //         import('./components/employee/employee-list').then(m => m.EmployeeList)
//       //     },
//       //     { 
//       //       path: 'onboarded-employees/add', 
//       //       loadComponent: () =>
//       //         import('./components/employee/employee-form').then(m => m.EmployeeForm)
//       //     },
//       //     { 
//       //       path: 'onboarded-employees/edit/:id', 
//       //       loadComponent: () =>
//       //         import('./components/employee/employee-form').then(m => m.EmployeeForm)
//       //     },
//       //     { 
//       //       path: 'onboarded-employees/batch/import', 
//       //       loadComponent: () =>
//       //         import('./components/employee/employee-batch-import/employee-batch-import').then(m => m.EmployeeBatchImportComponent)
//       //     },
//       //     { 
//       //       path: 'onboarded-employees/batch/status/:id', 
//       //       loadComponent: () =>
//       //         import('./components/employee/employee-batch-status/employee-batch-status').then(m => m.EmployeeBatchStatusComponent)
//       //     }
//       //   ]
//       // },

//       {
//   path: 'onboarding',
//   children: [
//     {
//       path: '',
//       loadComponent: () =>
//         import('./components/onboarding/onboarding').then(m => m.Onboarding)
//     },
//     // ... other onboarding routes
//   ]
// },

//       {
//         path: 'surveys',
//         children: [
//           {
//             path: '',
//             loadComponent: () =>
//               import('./components/create-survey.component/create-survey.component')
//                 .then(m => m.CreateSurveyComponent)
//           },
//           {
//             path: 'create',
//             loadComponent: () =>
//               import('./components/create-survey.component/create-survey.component')
//                 .then(m => m.CreateSurveyComponent)
//           },
//           {
//             path: 'edit/:id',
//             loadComponent: () =>
//               import('./components/create-survey.component/create-survey.component')
//                 .then(m => m.CreateSurveyComponent)
//           }
//         ]
//       },

//       // PROFILE PAGE
//       {
//         path: 'profile',
//         loadComponent: () =>
//           import('./pages/profile.component/profile.component')
//             .then(m => m.ProfileComponent)
//       },

//       {
//         path: 'reminders',
//         loadComponent: () => import('./pages/reminders/reminders.component/reminders.component')
//           .then(m => m.RemindersComponent)
//       },

//       /** DEFAULT INSIDE APP */
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//     ]
//   },

//   // REDIRECTS
//   { path: 'dashboard', redirectTo: 'app/dashboard', pathMatch: 'full' },
//   { path: 'employees', redirectTo: 'app/employees', pathMatch: 'full' },
//   { path: 'employees/add', redirectTo: 'app/employees/add', pathMatch: 'full' },
//   { path: 'surveys', redirectTo: 'app/surveys', pathMatch: 'full' },
//   { path: 'surveys/create', redirectTo: 'app/surveys/create', pathMatch: 'full' },
//   // ADD ONBOARDING REDIRECTS
//   { path: 'onboarding', redirectTo: 'app/onboarding', pathMatch: 'full' },
//   { path: 'onboarding/onboarded-employees', redirectTo: 'app/onboarding/onboarded-employees', pathMatch: 'full' },

//   { path: '**', redirectTo: 'app/dashboard' }
// ];


















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
      
      // EXISTING EMPLOYEE ROUTES
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

      // ONBOARDING ROUTES - USING YOUR EXISTING FILE STRUCTURE
      {
        path: 'onboarding',
        children: [
          // Main Onboarding Page
          {
            path: '',
            loadComponent: () =>
              import('./components/onboarding/onboarding').then(m => m.Onboarding)
          },
          // Batch Email Logs
          { 
            path: 'batch-email-logs', 
            loadComponent: () =>
              import('./components/onboarding/batch-email-logs/batch-email-logs').then(m => m.BatchEmailLogs)
          },
          // Email Log Details
          { 
            path: 'email-log-details', 
            loadComponent: () =>
              import('./components/onboarding/email-log-details/email-log-details').then(m => m.EmailLogDetails)
          },
          { 
            path: 'email-log-details/:id', 
            loadComponent: () =>
              import('./components/onboarding/email-log-details/email-log-details').then(m => m.EmailLogDetails)
          },
          // Email Logs
          { 
            path: 'email-logs', 
            loadComponent: () =>
              import('./components/onboarding/email-logs/email-logs').then(m => m.EmailLogs)
          },
          // Employee Eligibility
          { 
            path: 'employee-eligibility', 
            loadComponent: () =>
              import('./components/onboarding/employee-eligibility/employee-eligibility').then(m => m.EmployeeEligibility)
          },
          // Send Emails
          { 
            path: 'send-emails', 
            loadComponent: () =>
              import('./components/onboarding/send-emails/send-emails').then(m => m.SendEmails)
          },
          // Settings
          { 
            path: 'settings', 
            loadComponent: () =>
              import('./components/onboarding/settings/settings').then(m => m.Settings)
          },
          // Statistics
          { 
            path: 'statistics', 
            loadComponent: () =>
              import('./components/onboarding/statistics/statistics').then(m => m.Statistics)
          }
        ]
      },

      // SURVEYS
      {
        path: 'surveys',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/create-survey.component/create-survey.component')
                .then(m => m.CreateSurveyComponent)
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./components/create-survey.component/create-survey.component')
                .then(m => m.CreateSurveyComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./components/create-survey.component/create-survey.component')
                .then(m => m.CreateSurveyComponent)
          }
        ]
      },

      // PROFILE
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile.component/profile.component')
            .then(m => m.ProfileComponent)
      },

      // REMINDERS
      {
        path: 'reminders',
        loadComponent: () => import('./pages/reminders/reminders.component/reminders.component')
          .then(m => m.RemindersComponent)
      },

      /** DEFAULT INSIDE APP */
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // REDIRECTS
  { path: 'dashboard', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: 'employees', redirectTo: 'app/employees', pathMatch: 'full' },
  { path: 'employees/add', redirectTo: 'app/employees/add', pathMatch: 'full' },
  { path: 'surveys', redirectTo: 'app/surveys', pathMatch: 'full' },
  { path: 'surveys/create', redirectTo: 'app/surveys/create', pathMatch: 'full' },
  
  // ONBOARDING REDIRECTS
  { path: 'onboarding', redirectTo: 'app/onboarding', pathMatch: 'full' },
  { path: 'onboarding/batch-email-logs', redirectTo: 'app/onboarding/batch-email-logs', pathMatch: 'full' },
  { path: 'onboarding/email-log-details', redirectTo: 'app/onboarding/email-log-details', pathMatch: 'full' },
  { path: 'onboarding/email-logs', redirectTo: 'app/onboarding/email-logs', pathMatch: 'full' },
  { path: 'onboarding/employee-eligibility', redirectTo: 'app/onboarding/employee-eligibility', pathMatch: 'full' },
  { path: 'onboarding/send-emails', redirectTo: 'app/onboarding/send-emails', pathMatch: 'full' },
  { path: 'onboarding/settings', redirectTo: 'app/onboarding/settings', pathMatch: 'full' },
  { path: 'onboarding/statistics', redirectTo: 'app/onboarding/statistics', pathMatch: 'full' },

  { path: '**', redirectTo: 'app/dashboard' }
];