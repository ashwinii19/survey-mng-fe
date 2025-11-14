import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.base}/login`, { email, password })
      .pipe(tap(res => this.setToken(res.token)));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.base}/forgot-password`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.base}/verify-otp`, { email, otp });
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.base}/reset-password`, { email, newPassword });
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  clearToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  logout(): void {
    this.clearToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
