import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:9090/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem(this.tokenKey, res.token);
          sessionStorage.setItem(this.userKey, JSON.stringify({
            dni: res.dni,
            nombres: res.nombres,
            apellidos: res.apellidos,
            rol: res.rol
          }));
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.userKey);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { dni: string; nombres: string; apellidos: string; rol: UserRole } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.rol ?? null;
  }

  hasRole(roles: UserRole[]): boolean {
    const rol = this.getRole();
    return !!rol && roles.includes(rol);
  }
}