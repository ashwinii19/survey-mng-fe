import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

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

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard-root/dashboard-root').then(m => (m as any).DashboardRoot || (m as any).default),
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'login' }
];
