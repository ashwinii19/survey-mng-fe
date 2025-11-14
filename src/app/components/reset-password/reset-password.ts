import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {

  email = '';
  newPassword = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  reset() {
    this.auth.resetPassword(this.email, this.newPassword).subscribe(() => {
      this.message = 'Password reset successful!';
      setTimeout(() => this.router.navigate(['/login']), 1000);
    });
  }
}
