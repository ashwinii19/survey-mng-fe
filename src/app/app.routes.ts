import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { VerifyOtp } from './components/verify-otp/verify-otp';
import { ResetPassword } from './components/reset-password/reset-password';
import DashboardRoot from './pages/dashboard-root/dashboard-root';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
{ path: 'verify-otp', component: VerifyOtp },
{ path: 'reset-password', component: ResetPassword },
  { path: 'dashboard', component: DashboardRoot },

  { path: '**', redirectTo: 'login' }
];
