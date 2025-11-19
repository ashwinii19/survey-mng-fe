import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth/auth';
import { ToastService } from '../../app/shared/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {

  private timeout: any;
  private INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 min

  // constructor(private auth: Auth, private router: Router) {}
  constructor(private auth: Auth, private router: Router, private toast: ToastService) {}


  startWatching() {
    this.resetTimer();

    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());
  }

  // resetTimer() {
  //   clearTimeout(this.timeout);

  //   this.timeout = setTimeout(() => {
  //     this.auth.logout();
  //     this.router.navigate(['/login']);
  //   }, this.INACTIVITY_LIMIT);
  // }
  resetTimer() {
  clearTimeout(this.timeout);

  this.timeout = setTimeout(() => {
    this.toast.show("Logged out due to inactivity", "error");
    this.auth.logout();
    this.router.navigate(['/login']);
  }, this.INACTIVITY_LIMIT);
}
}
