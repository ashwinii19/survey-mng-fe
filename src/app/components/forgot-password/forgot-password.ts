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
    console.log("SEND OTP:", this.email);

    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        console.log("OTP SEND SUCCESS:", res);
        this.message = "OTP Sent Successfully!";

        // IMPORTANT → Navigate to Verify OTP page
        this.router.navigate(['/verify-otp'], { 
          queryParams: { email: this.email }
        });
      },
      error: (err) => {
        console.error("OTP SEND ERROR:", err);
        this.error = "Email not found!";
      }
    });
  }
}
