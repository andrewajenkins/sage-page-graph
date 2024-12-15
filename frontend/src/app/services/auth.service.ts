import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, interval, Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api'; // Backend URL
  private tokenExpirationTimer!: Subscription; // Timer for refreshing tokens
  private refreshInProgress = false;

  private loggedInSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated(),
  );
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login to get initial tokens
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, { username, password }).pipe(
      map((tokens: any) => {
        this.setTokens(tokens.access, tokens.refresh);
        this.scheduleTokenRefresh();
        this.loggedInSubject.next(true);
      }),
    );
  }

  register(username: string, password: string, key: string): Observable<any> {
    const data = { username, password, key };
    return this.http.post(`${this.apiUrl}/register/`, data).pipe(
      map((tokens: any) => {
        this.setTokens(tokens.access, tokens.refresh);
        this.scheduleTokenRefresh();
        this.loggedInSubject.next(true);
      }),
    );
  }

  // Refresh the token
  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    if (!refresh || this.refreshInProgress) {
      return of(null); // No refresh token available or already refreshing
    }

    this.refreshInProgress = true;
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      map((tokens: any) => {
        this.setTokens(tokens.access, tokens.refresh);
        this.scheduleTokenRefresh(); // Reset refresh timer
        this.refreshInProgress = false;
        return tokens.access;
      }),
      catchError(() => {
        this.logout(); // Handle failure
        return of(null);
      }),
    );
  }

  // Schedule token refresh based on token expiration
  private scheduleTokenRefresh(): void {
    const accessToken = this.getAccessToken();
    if (!accessToken) return;

    const expiry = this.getTokenExpiry(accessToken);
    if (!expiry) return;

    const now = Date.now();
    const delay = expiry - now - 30000; // Refresh 30 seconds before expiration

    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
    }

    if (delay > 0) {
      this.tokenExpirationTimer = interval(delay)
        .pipe(switchMap(() => this.refreshToken()))
        .subscribe();
    }
  }

  // Decode token and calculate expiry
  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }

  // Set tokens in local storage
  private setTokens(access: string, refresh: string): void {
    localStorage.setItem('auth_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  // Retrieve tokens
  getAccessToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    const expiry = this.getTokenExpiry(token);
    return !!expiry && expiry > Date.now(); // Valid if expiry is in the future
  }

  // Clear tokens and logout
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    this.loggedInSubject.next(false);
    if (this.tokenExpirationTimer) {
      this.tokenExpirationTimer.unsubscribe();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Utility method to decode a JWT token
   * @param token The JWT token
   * @returns The decoded token payload
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  getKey(username: string) {
    return this.http.post(`${this.apiUrl}/key/`, { username }).pipe(
      map((tokens: any) => {
        this.setTokens(tokens.access, tokens.refresh);
        this.scheduleTokenRefresh();
        this.loggedInSubject.next(true);
      }),
    );
  }
}
