// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Auth } from '../../services/auth/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css']
// })
// export class Login {
//   email = '';
//   password = '';
//   error = '';

//   constructor(private auth: Auth, private router: Router) {}

//   onSubmit() {
//     this.error = '';
//     this.auth.login(this.email, this.password).subscribe({
//       next: () => this.router.navigate(['/dashboard']),
//       error: () => this.error = 'Invalid credentials'
//     });
//   }

//   goToForgot() {
//     this.router.navigate(['/forgot-password']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  email = '';
  password = '';
  error = '';

  showPassword: boolean = false;   // ✅ FIX ADDED

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    // If token exists but expired → logout immediately
    if (!this.auth.isLoggedIn()) {
      this.auth.logout();
      return;
    }

    // If still valid → redirect to dashboard
    this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }

  goToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}
