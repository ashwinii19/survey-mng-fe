
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
  private readonly INACTIVITY_LIMIT = 6 * 60 * 60 * 1000;


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
