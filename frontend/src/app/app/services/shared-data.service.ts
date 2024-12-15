import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Conversation, Message } from '../app.component';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private apiUrl = '/api';
  queryAppended = new EventEmitter<void>();
  currentPath: number[] = [];
  data: any[] = [];
  queries: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getConversationTitles(): Observable<Conversation[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/`, {
      headers,
    });
  }

  getConversationById(id: number): Observable<Conversation> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.get<Conversation>(
      `${this.apiUrl}/conversations/${id}/detail/`,
      { headers },
    );
  }

  addChatMessage(convoId: number, message: Message): Observable<void> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.post<void>(
      `${this.apiUrl}/conversations/${convoId}/messages/`,
      { ...message, conversation_id: convoId },
      { headers },
    );
  }

  deleteConversation(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.delete<void>(
      `${this.apiUrl}/conversations/${id}/delete/`,
      { headers },
    );
  }
  addFirstChatMessage(message: Message): Observable<void> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.post<void>(
      `${this.apiUrl}/conversations/messages/`,
      {
        ...message,
        parent_message: null,
      },
      { headers },
    );
  }

  selectNode(path: number[]): void {
    this.currentPath = path;
  }

  getCurrentPath(): number[] {
    console.log('Getting current path:', this.currentPath);
    return this.currentPath;
  }

  initializeDeepestConversation(convo: Conversation): Message[] {
    if (!convo) return [];
    let rootNode = convo.messages[0];
    for (const message of convo.messages) {
      if (new Date(message.updated_at) > new Date(rootNode.updated_at)) {
        rootNode = message;
      }
    }

    rootNode.queries = this.getSubQueries(convo, rootNode.id);
    const path = [rootNode.id];
    const chatHistory = [rootNode];

    while (rootNode.parent_message) {
      rootNode = this.getMessageById(convo, rootNode.parent_message);
      rootNode.queries = this.getSubQueries(convo, rootNode.id);
      path.push(rootNode.id);
      chatHistory.push(rootNode);
    }

    this.currentPath = path.reverse();
    return chatHistory.reverse();
  }

  getMessageById(convo: Conversation, id: number): Message {
    for (const message of convo.messages) {
      if (message.id === id) {
        return message;
      }
    }
    throw new Error('Message not found');
  }

  reset(): void {
    this.currentPath = [];
  }

  getCurrentConversation(): Conversation {
    return this.data[this.currentPath[0]];
  }

  // New method to set the path by query
  getMessageHistory(convo: Conversation, targetNode: number): Message[] {
    let rootNode;
    for (const message of convo.messages) {
      if (targetNode === message.id) {
        rootNode = message;
      }
    }

    rootNode = rootNode!;
    rootNode!.queries = this.getSubQueries(convo, rootNode.id);
    const path = [rootNode.id];
    const chatHistory = [rootNode];

    while (rootNode.parent_message) {
      rootNode = this.getMessageById(convo, rootNode.parent_message);
      rootNode.queries = this.getSubQueries(convo, rootNode.id);
      path.push(rootNode.id);
      chatHistory.push(rootNode);
    }

    this.currentPath = path.reverse();
    return chatHistory.reverse();
  }

  getSubQueries(convo: Conversation, parentId: number): Message[] {
    return convo.messages.filter(
      (msg: Message) => msg.parent_message === parentId,
    );
  }

  getOpenAIKey(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.get(`${this.apiUrl}/openaikey/`, { headers });
  }

  deleteOpenAIKey(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.delete(`${this.apiUrl}/openaikey/`, { headers });
  }

  saveOpenAIKey(key: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`,
    );
    return this.http.post(
      `${this.apiUrl}/openaikey/`,
      { openai_key: key },
      { headers },
    );
  }
}
