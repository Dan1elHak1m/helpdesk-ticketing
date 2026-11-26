import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API } from './api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  loggedIn = signal(!!localStorage.getItem('token'));
  role = signal<string | null>(localStorage.getItem('role'));

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => {
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', payload.role);
        this.role.set(payload.role);
        this.loggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.role.set(null);
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isStaff() {
    return this.role() === 'agent' || this.role() === 'admin';
  }
}