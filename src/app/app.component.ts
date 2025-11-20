// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { HostListener } from '@angular/core';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html'
// })
// // export default class AppComponent {}

// export class AppComponent {

//   INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 min

//   constructor() {
//     setInterval(() => this.checkInactivity(), 30000);
//   }

//   @HostListener("document:click")
//   @HostListener("document:keydown")
//   @HostListener("document:mousemove")
//   recordActivity() {
//     localStorage.setItem("lastActivity", Date.now().toString());
//   }

//   checkInactivity() {
//     const last = Number(localStorage.getItem("lastActivity") || 0);
//     if (!last) return;

//     const now = Date.now();
//     if (now - last >= this.INACTIVITY_LIMIT) {
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("lastActivity");
//       window.location.href = "/login";
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './services/auth/auth';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Toast     // <<< ADD THIS
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  // private readonly INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 mins
  // private readonly INACTIVITY_LIMIT = 2 * 60 * 1000; // 2 minutes
  private readonly INACTIVITY_LIMIT = 6 * 60 * 60 * 1000; // 6 hours in ms



  constructor(private auth: Auth) {}

  ngOnInit() {
    this.startIdleWatcher();
  }

  startIdleWatcher() {
    setInterval(() => {
      const token = this.auth.getToken();
      if (!token) return;

      const lastActivity = Number(localStorage.getItem('lastActivity')) || 0;
      const now = Date.now();

      if (now - lastActivity >= this.INACTIVITY_LIMIT) {
        this.auth.logout();
        window.location.href = '/login';
      }

    }, 15000);
  }
}
