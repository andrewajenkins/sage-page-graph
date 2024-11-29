import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'app_token'; // Key for storing the OpenAI token in localStorage

  constructor() {}

  // Save the token to localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove the token from localStorage
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
