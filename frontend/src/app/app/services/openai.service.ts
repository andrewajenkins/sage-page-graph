import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  sendQuery(prompt: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };
    const body = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
  generateSummary(prompt: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 10, // Limit tokens for summary
    };
    return this.http.post(this.apiUrl, body, { headers });
  }

  getToken(): string | null {
    const token = this.tokenService.getToken();
    if (!token) {
      alert(
        'No token found. Please enter your OpenAI API token using the "Manage token" button.',
      );
      throw new Error('No token found');
    }
    return token;
  }
}
