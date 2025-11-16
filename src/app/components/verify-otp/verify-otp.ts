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

  toast = {
    type: '',
    text: '',
    show: false
  };

  constructor(private route: ActivatedRoute, private router: Router, private auth: Auth) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  showToast(type: string, text: string) {
    this.toast = { type, text, show: true };
    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }

  verify() {
    if (!this.otp || this.otp.length < 4) {
      this.showToast("error", "Enter valid OTP!");
      return;
    }

    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.showToast("success", "OTP Verified!");
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.email }
          });
        }, 800);
      },
      error: () => {
        this.showToast("error", "Invalid or expired OTP");
      }
    });
  }

  goBack() {
    this.router.navigate(['/forgot-password']);
  }
}
