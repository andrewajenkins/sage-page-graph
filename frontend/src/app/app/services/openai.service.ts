import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private backendApiUrl = '/api/openai/query/';

  constructor(private http: HttpClient) {}

  sendQuery(
    convoID: number | undefined,
    currentMessageID: string,
    prompt: string,
  ): Observable<any> {
    const body = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      current_message_id: currentMessageID,
    };
    return this.http.post(this.backendApiUrl, body);
  }

  generateSummary(prompt: string): Observable<any> {
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 10, // Limit tokens for summary
    };
    return this.http.post(this.backendApiUrl, body);
  }
}
