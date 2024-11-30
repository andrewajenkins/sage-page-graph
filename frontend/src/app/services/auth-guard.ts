import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');
    if (token && !this.isTokenExpired(token)) {
      return true;
    } else {
      localStorage.removeItem('auth_token'); // Clear invalid token
      this.router.navigate(['/login']);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return expiry * 1000 < Date.now();
    } catch (e) {
      return true; // If decoding fails, consider the token expired
    }
  }
}
