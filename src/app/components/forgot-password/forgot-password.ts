import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  email = '';
  message = '';
  error = '';
  toast: { type: 'success' | 'error' | 'info'; text: string } | null = null;
  loading = false;

  constructor(private auth: Auth, private router: Router) {}

  showToast(type: 'success' | 'error' | 'info', text: string) {
    this.toast = { type, text };
    setTimeout(() => (this.toast = null), 3000);
  }

  sendOtp() {
  if (!this.email) {
    this.showToast('error', 'Please enter your email');
    return;
  }

  this.error = '';   // Clear previous error
  this.message = ''; // Clear success message
  this.loading = true;
  this.showToast('info', 'OTP is sending…');

  this.auth.forgotPassword(this.email).subscribe({
    next: () => {
      this.loading = false;
      this.message = 'OTP Sent Successfully!';
      this.error = '';       // Clear error on success
      this.showToast('success', this.message);
      setTimeout(() => {
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
      }, 1200);
    },
    error: () => {
      this.loading = false;
      this.error = 'Email not found!';
      this.message = '';     // Clear success message on error
      this.showToast('error', this.error);
    }
  });
}


  backToLogin() {
    this.router.navigate(['/login']);
  }
}
