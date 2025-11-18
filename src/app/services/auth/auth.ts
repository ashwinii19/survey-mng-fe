// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { environment } from '../../../environments/environment';
// // import { BehaviorSubject } from 'rxjs';
// // import { tap } from 'rxjs/operators';

// // @Injectable({ providedIn: 'root' })
// // export class Auth {

// //   private base = `${environment.apiBaseUrl}/auth`;
// //   private tokenKey = 'authToken';

// //   private userSubject = new BehaviorSubject<any>(null);
// //   user$ = this.userSubject.asObservable();

// //   constructor(private http: HttpClient) {}

// //   // ------------------ LOGIN ------------------
// //   login(email: string, password: string) {
// //     return this.http.post<{ token: string }>(
// //       `${this.base}/login`,
// //       { email, password }
// //     ).pipe(
// //       tap(res => this.setToken(res.token)),
// //       tap(() => this.refreshUser())
// //     );
// //   }

// //   refreshUser() {
// //     this.getLoggedInUser().subscribe(user => {
// //       this.userSubject.next(user);
// //     });
// //   }

// //   // ------------------ FORGOT PASSWORD ------------------
// //   forgotPassword(email: string) {
// //     return this.http.post(
// //       `${this.base}/forgot-password`,
// //       { email },
// //       { responseType: 'text' }
// //     );
// //   }

// //   // ------------------ VERIFY OTP ------------------
// //   verifyOtp(email: string, otp: string) {
// //     return this.http.post(
// //       `${this.base}/verify-otp`,
// //       { email, otp },
// //       { responseType: 'text' }
// //     );
// //   }

// //   // ------------------ RESET PASSWORD ------------------
// //   resetPassword(email: string, newPassword: string) {
// //     return this.http.post(
// //       `${this.base}/reset-password`,
// //       { email, newPassword },
// //       { responseType: 'text' }
// //     );
// //   }

// //   // ------------------ TOKEN HELPERS ------------------
// //   getToken() {
// //     return localStorage.getItem(this.tokenKey);
// //   }

// //   setToken(token: string) {
// //     localStorage.setItem(this.tokenKey, token);
// //   }

// //   clearToken() {
// //     localStorage.removeItem(this.tokenKey);
// //   }

// //   logout() {
// //     this.clearToken();
// //   }

// //   isLoggedIn() {
// //     return !!this.getToken();
// //   }

// //   // ------------------ GET LOGGED-IN ADMIN ------------------
// //   getLoggedInUser() {
// //     return this.http.get<any>(`${this.base}/me`);
// //   }

// //   // ------------------ UPDATE PROFILE ------------------
// //   updateProfile(payload: { name: string; email: string }) {
// //     return this.http.put<any>(`${this.base}/update-profile`, payload).pipe(
// //       tap(() => this.refreshUser())  // 🔥 Notify header immediately
// //     );
// //   }

// //   // ------------------ UPLOAD IMAGE ------------------
// //   uploadImage(file: File) {
// //     const formData = new FormData();
// //     formData.append('file', file);

// //     return this.http.post<any>(`${this.base}/upload-image`, formData).pipe(
// //       tap(() => this.refreshUser()) // 🔥 Header will update instantly
// //     );
// //   }

// //   // ------------------ CHANGE PASSWORD ------------------
// //   changePassword(payload: { oldPassword: string; newPassword: string }) {
// //     return this.http.post<any>(`${this.base}/change-password`, payload);
// //   }
// // }
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { ToastService } from '../../shared/toast/toast.service';


// @Injectable({ providedIn: 'root' })
// export class Auth {

//   private base = `${environment.apiBaseUrl}/auth`;
//   private tokenKey = 'authToken';

//   private userSubject = new BehaviorSubject<any>(null);
//   user$ = this.userSubject.asObservable();

//   constructor(private http: HttpClient, private toast: ToastService) {}

//   // ---------------- LOGIN ----------------
//   login(email: string, password: string) {
//     return this.http.post<{ token: string }>(
//       `${this.base}/login`,
//       { email, password }
//     ).pipe(
//       tap(res => {
//         this.setToken(res.token);
//         this.updateLastActivity(); // store login activity time
//       }),
//       tap(() => this.refreshUser())
//     );
//   }

//   refreshUser() {
//     this.getLoggedInUser().subscribe(user => {
//       this.userSubject.next(user);
//     });
//   }

//   forgotPassword(email: string) {
//   return this.http.post(
//     `${this.base}/forgot-password`,
//     { email },
//     { responseType: 'text' }
//   );
// }

// verifyOtp(email: string, otp: string) {
//   return this.http.post(
//     `${this.base}/verify-otp`,
//     { email, otp },
//     { responseType: 'text' }
//   );
// }

// resetPassword(email: string, newPassword: string) {
//   return this.http.post(
//     `${this.base}/reset-password`,
//     { email, newPassword },
//     { responseType: 'text' }
//   );
// }


//   // ---------------- ACTIVITY TRACKING ----------------
//   updateLastActivity() {
//     localStorage.setItem('lastActivity', Date.now().toString());
//   }

//   isSessionExpired(): boolean {
//     const last = Number(localStorage.getItem('lastActivity'));
//     if (!last) return true;

//     const now = Date.now();
//     const LIMIT = 30 * 60 * 1000; // 30 min

//     return (now - last) > LIMIT;
//   }

//   // ---------------- TOKEN HELPERS ----------------
//   getToken() {
//     return localStorage.getItem(this.tokenKey);
//   }

//   setToken(token: string) {
//     localStorage.setItem(this.tokenKey, token);
//   }

//   clearToken() {
//     localStorage.removeItem(this.tokenKey);
//     localStorage.removeItem('lastActivity');
//   }

//   logout() {
//   this.clearToken();
//   this.toast.show("Session expired. Please login again.", "error");
// }

//   isLoggedIn() {
//     return !!this.getToken() && !this.isSessionExpired();
//   }

//   // ---------------- ADMIN DATA ----------------
//   getLoggedInUser() {
//     return this.http.get<any>(`${this.base}/me`);
//   }

//   updateProfile(payload: { name: string; email: string }) {
//     return this.http.put<any>(`${this.base}/update-profile`, payload)
//       .pipe(tap(() => this.refreshUser()));
//   }

//   uploadImage(file: File) {
//     const formData = new FormData();
//     formData.append('file', file);

//     return this.http.post<any>(`${this.base}/upload-image`, formData)
//       .pipe(tap(() => this.refreshUser()));
//   }

//   changePassword(payload: { oldPassword: string; newPassword: string }) {
//     return this.http.post<any>(`${this.base}/change-password`, payload);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {

  private base = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'authToken';

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/login`, { email, password })
      .pipe(
        tap(res => {
          this.setToken(res.token);
          localStorage.setItem("lastActivity", Date.now().toString());
        }),
        tap(() => this.refreshUser())
      );
  }

  refreshUser() {
    this.getLoggedInUser().subscribe(user => this.userSubject.next(user));
  }

  forgotPassword(email: string) {
    return this.http.post(
      `${this.base}/forgot-password`,
      { email },
      { responseType: 'text' }
    );
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.base}/verify-otp`,
      { email, otp },
      { responseType: 'text' }
    );
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post(
      `${this.base}/reset-password`,
      { email, newPassword },
      { responseType: 'text' }
    );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  logout() {
    this.clearToken();
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  getLoggedInUser() {
    return this.http.get<any>(`${this.base}/me`);
  }

  updateProfile(payload: { name: string; email: string }) {
    return this.http.put<any>(`${this.base}/update-profile`, payload)
      .pipe(tap(() => this.refreshUser()));
  }

  uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return this.http.post<any>(`${this.base}/upload-image`, fd)
      .pipe(tap(() => this.refreshUser()));
  }

  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return this.http.post<any>(`${this.base}/change-password`, payload);
  }

  updateLastActivity() {
  localStorage.setItem('lastActivity', Date.now().toString());
}

}
