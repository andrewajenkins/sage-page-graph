import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey =
    'sk-SzZObcdBLVLoJirPtMspaOHByNkkNeF6i1ntLl6rBGT3BlbkFJanHcN0tszxpSUX9WoaESWXo--RvwoRB9vO49oOP1EA';

  constructor(private http: HttpClient) {}

  sendQuery(prompt: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
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
      max_tokens: 150,
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
  generateSummary(prompt: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
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
}
