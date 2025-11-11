import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = 'http://localhost:8080/api/auth';
  private tokenKey = 'authToken';
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.base}/login`, { email, password })
      .pipe(tap(res => {
        if (this.isBrowser()) localStorage.setItem(this.tokenKey, res.token);
      }));
  }

  logout(): void {
    if (this.isBrowser()) localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (this.isBrowser()) return localStorage.getItem(this.tokenKey);
    return null;
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) return !!localStorage.getItem(this.tokenKey);
    return false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
