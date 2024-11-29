import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '/api/token/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(this.baseUrl, { username, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  saveRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Check if a valid token exists
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    // You can add token validation logic here, e.g., decoding the token and checking expiry
    return !!token; // Returns true if token exists, false otherwise
  }
}
