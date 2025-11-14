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

  constructor(private auth: Auth, private router: Router) {}

  sendOtp() {
    this.message = '';
    this.error = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.message = 'OTP sent to your email';
        setTimeout(() => {
          this.router.navigate(['/verify-otp'], {
            queryParams: { email: this.email }
          });
        }, 1000);
      },
      error: () => this.error = 'Email not found'
    });
  }
}
