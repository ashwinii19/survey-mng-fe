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
  forgotPassword(email: string) {
    return this.http.post(
      `${this.base}/forgot-password`,
      { email },
      { responseType: 'text' }
    );
  }

  // ------------------ VERIFY OTP ------------------
  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.base}/verify-otp`,
      { email, otp },
      { responseType: 'text' }
    );
  }

  // ------------------ RESET PASSWORD ------------------
  resetPassword(email: string, newPassword: string) {
    return this.http.post(
      `${this.base}/reset-password`,
      { email, newPassword },
      { responseType: 'text' }
    );
  }

  // ------------------ TOKEN HELPERS ------------------
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

  // ------------------ GET LOGGED-IN ADMIN ------------------
  getLoggedInUser() {
    return this.http.get<any>(`${this.base}/me`);
  }

  // ------------------ UPDATE PROFILE ------------------
  updateProfile(payload: { name: string; email: string }) {
    return this.http.put<any>(`${this.base}/update-profile`, payload);
  }

  // ------------------ UPLOAD IMAGE ------------------
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.base}/upload-image`, formData);
  }

  // ------------------ CHANGE PASSWORD ------------------
  changePassword(payload: { oldPassword: string; newPassword: string }) {
    return this.http.post<any>(`${this.base}/change-password`, payload);
  }
}
