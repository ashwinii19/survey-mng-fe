import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css']
})
export class VerifyOtp {

  email = '';
  otp = '';
  error = '';
  message = '';

  constructor(private route: ActivatedRoute, private router: Router, private auth: Auth) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  verify() {
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.message = "OTP Verified! Redirecting...";
        this.router.navigate(['/reset-password'], {
          queryParams: { email: this.email }
        });
      },
      error: () => {
        this.error = "Invalid or expired OTP";
      }
    });
  }
}
