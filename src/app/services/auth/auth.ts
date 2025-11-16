import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Auth {

  private base = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // ------------------ LOGIN ------------------
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${this.base}/login`,
      { email, password }
    ).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  // ------------------ FORGOT PASSWORD ------------------
  // Accept plain text response because backend returns: "OTP sent to email."
  forgotPassword(email: string) {
    return this.http.post(
      `${this.base}/forgot-password`,
      { email },
      { responseType: 'text' }     // ★ FIX: REQUIRED FOR NAVIGATION
    );
  }

  // ------------------ VERIFY OTP ------------------
  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.base}/verify-otp`,
      { email, otp },
      { responseType: 'text' }     // ★ FIX
    );
  }

  // ------------------ RESET PASSWORD ------------------
  resetPassword(email: string, newPassword: string) {
    return this.http.post(
      `${this.base}/reset-password`,
      { email, newPassword },
      { responseType: 'text' }     // ★ FIX
    );
  }

  // ------------------ TOKEN HELPERS ------------------
  // getToken() {
  //   return localStorage.getItem(this.tokenKey);
  // }
  getToken() {
  const t = localStorage.getItem(this.tokenKey);
  console.log("Auth.getToken() =", t);
  return t;
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
}
