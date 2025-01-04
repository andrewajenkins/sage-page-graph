import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { SharedDataService } from './services/shared-data.service';
import { AngularSplitModule } from 'angular-split';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DialogModule } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TokenService } from './services/token.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

export interface Message {
  id: number;
  conversation_id: number; // The conversation this message belongs to - for backend
  title: string;
  query: string;
  response: string;
  queries: Message[];
  parent_message: number;
  updated_at: string;
}

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    ChatComponent,
    GraphComponent,
    AngularSplitModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DialogModule,
    Button,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  selectedConversation: Conversation | null = null;
  title = 'my-app';

  // a linear chat history displayed in the chat window, derived from a conversation graph
  chatHistory: Message[] = [];
  conversations: Conversation[] = [];
  initialPath: number[] = [];
  settingsModalVisible = false;
  token: string = '';

  constructor(
    private sharedDataService: SharedDataService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.waitForTokenToBeSaved();

    this.sharedDataService
      .getConversationTitles()
      .subscribe((convos: Conversation[]) => {
        this.conversations = convos.map((c) => {
          return { ...c, messages: [] as Message[] };
        });
        if (this.conversations.length > 0) {
          this.sharedDataService
            .getConversationById(this.conversations[0].id)
            .subscribe((c: Conversation) => {
              this.selectedConversation = c;
              this.chatHistory =
                this.sharedDataService.initializeDeepestConversation(c);
              this.initialPath = this.sharedDataService.getCurrentPath(); // Get the initial path
            });
        }
      });

    this.sharedDataService.queryAppended.subscribe(() => {
      this.selectedConversation = {
        ...this.sharedDataService.getCurrentConversation(),
      };
      this.initialPath = [...this.sharedDataService.getCurrentPath()];
      this.cdr.detectChanges();
    });
  }
  waitForTokenToBeSaved(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.authService.getAccessToken()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
  deleteCurrentConversation(): void {
    if (this.selectedConversation) {
      const confirmDeletion = confirm(
        'Are you sure you want to delete this conversation? This action cannot be undone.',
      );

      if (!confirmDeletion) {
        return;
      }

      this.sharedDataService
        .deleteConversation(this.selectedConversation.id)
        .subscribe(() => {
          const index = this.conversations.findIndex(
            (c) => c.id === this.selectedConversation?.id,
          );
          this.conversations.splice(index, 1);
          this.conversations.length > 0
            ? this.selectConversation(this.conversations[0].id)
            : this.clearActiveConversation();
          this.chatHistory =
            this.sharedDataService.initializeDeepestConversation(
              this.selectedConversation!,
            );
          this.initialPath = this.sharedDataService.getCurrentPath(); // Get the initial path

          this.cdr.detectChanges(); // Manually trigger change detection
        });
    } else {
      alert(
        'No conversation selected. Please select a conversation to delete.',
      );
    }
  }

  selectConversationByIndex(index: number): void {
    this.selectConversation(this.conversations[index].id);
  }

  clearActiveConversation(): void {
    this.selectedConversation = null;
    this.chatHistory = [];
    this.initialPath = [];
    this.sharedDataService.reset();
  }

  async selectConversation(id: number): Promise<void> {
    await this.waitForTokenToBeSaved();

    this.sharedDataService
      .getConversationById(id)
      .subscribe((c: Conversation) => {
        if (this.conversations.findIndex((conv) => conv.id === c.id) === -1) {
          this.conversations.unshift(c);
          this.conversations = [...this.conversations];
        }
        this.selectedConversation = c;
        this.chatHistory =
          this.sharedDataService.initializeDeepestConversation(c);
        this.initialPath = this.sharedDataService.getCurrentPath();

        this.cdr.detectChanges();
      });
  }

  onNodeSelect(node: any): void {
    this.chatHistory = this.sharedDataService.getMessageHistory(
      this.selectedConversation!,
      node.id,
    );
    this.initialPath = this.sharedDataService.getCurrentPath();
  }

  addNewConversation(): void {
    this.selectedConversation = null;
    this.initialPath = [];
    this.chatHistory = [];
    this.sharedDataService.reset();
  }

  onMessageAdded(msg: Message): void {
    if (this.selectedConversation) {
      this.sharedDataService
        .addChatMessage(this.selectedConversation.id, {
          ...msg,
          parent_message: this.initialPath[this.initialPath.length - 1],
        })
        .subscribe({
          next: (response: any) => {
            this.selectConversation(this.selectedConversation?.id!);
          },
          error: (err) => {
            this.handleAddMessageError(err);
          },
        });
    } else {
      this.sharedDataService.addFirstChatMessage(msg).subscribe({
        next: (response: any) => {
          this.selectConversation(response.conversation.id);
        },
        error: (err) => {
          this.handleAddMessageError(err);
        },
      });
    }
  }

  onSubQuerySelect(subQuery: any): void {
    this.chatHistory = this.sharedDataService.getMessageHistory(
      this.selectedConversation!,
      subQuery.subQuery.id,
    );
    this.initialPath = this.sharedDataService.getCurrentPath();
    this.cdr.detectChanges();
  }

  manageToken() {
    this.sharedDataService
      .getOpenAIKey()
      .subscribe((key: { openai_key: string }) => {
        this.token = key.openai_key;
      });
    this.settingsModalVisible = true;
  }

  saveToken($event: MouseEvent) {
    this.settingsModalVisible = false;
    this.sharedDataService.saveOpenAIKey(this.token).subscribe(() => {});
  }

  clearToken() {
    this.settingsModalVisible = false;
    this.sharedDataService.deleteOpenAIKey().subscribe(() => {
      this.token = '';
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleAddMessageError(err: any): void {
    if (err.status === 401 || err.status === 500) {
      this.tryRefreshToken().then((success) => {
        if (success) {
          // Retry the failed request or inform the user to try again
        } else {
          alert('Your session has expired. Please log in again.');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    } else {
      alert('An error occurred while adding the message. Please try again.');
    }
  }
  private tryRefreshToken(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.refreshToken().subscribe({
        next: (newAccessToken) => {
          resolve(true);
        },
        error: (refreshError) => {
          resolve(false);
        },
      });
    });
  }
  contact() {
    const email = 'andy@jenkinssd.com';
    const subject = 'Sage Page Query';
    const body = 'Hello, I would like to contact you regarding...';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  }

  protected readonly alert = alert;
}
