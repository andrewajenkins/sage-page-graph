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
        // Check if token is set in sessionStorage
        if (this.authService.getAccessToken()) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100 milliseconds
    });
  }
  deleteCurrentConversation(): void {
    if (this.selectedConversation) {
      // Display confirmation popup
      const confirmDeletion = confirm(
        'Are you sure you want to delete this conversation? This action cannot be undone.',
      );

      if (!confirmDeletion) {
        return; // Exit if the user cancels
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
        console.log('Selected conversation:', this.selectedConversation);
        this.chatHistory =
          this.sharedDataService.initializeDeepestConversation(c);
        this.initialPath = this.sharedDataService.getCurrentPath(); // Get the initial path

        this.cdr.detectChanges(); // Manually trigger change detection
      });
  }

  onNodeSelect(node: any): void {
    console.log('Node selected:', node);

    this.chatHistory = this.sharedDataService.getMessageHistory(
      this.selectedConversation!,
      node.id,
    );
    this.initialPath = this.sharedDataService.getCurrentPath();
    console.log('Path to node:', this.chatHistory);
    console.log('Initial path:', this.initialPath);
  }

  addNewConversation(): void {
    this.selectedConversation = null; // Unselect everything
    this.initialPath = [];
    this.chatHistory = []; // Clear the chat history
    this.sharedDataService.reset(); // Reset pointers in the data service
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
            // Refresh the conversation
            this.selectConversation(this.selectedConversation?.id!);
          },
          error: (err) => {
            // Handle error
            console.error('Failed to add message:', err);
            this.handleAddMessageError(err);
          },
        });
    } else {
      this.sharedDataService.addFirstChatMessage(msg).subscribe({
        next: (response: any) => {
          // Select the new conversation
          this.selectConversation(response.conversation.id);
        },
        error: (err) => {
          // Handle error
          console.error('Failed to add message:', err);
          this.handleAddMessageError(err);
        },
      });
    }
  }

  onSubQuerySelect(subQuery: any): void {
    console.log('Sub-query selected:', subQuery);
    this.chatHistory = this.sharedDataService.getMessageHistory(
      this.selectedConversation!,
      subQuery.subQuery.id,
    );
    this.initialPath = this.sharedDataService.getCurrentPath();
    console.log('Updated chat history:', this.chatHistory);
    console.log('Updated initial path:', this.initialPath);
    this.cdr.detectChanges(); // Manually trigger change detection
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
    console.log('Token saved:');
    // this.tokenService.saveToken(this.token);
    this.sharedDataService.saveOpenAIKey(this.token).subscribe(() => {});
  }

  clearToken() {
    this.settingsModalVisible = false;
    console.log('Token saved:', this.token);
    // this.tokenService.clearToken();
    this.sharedDataService.deleteOpenAIKey().subscribe(() => {
      this.token = '';
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private handleAddMessageError(err: any): void {
    if (err.status === 401) {
      // Unauthorized error
      alert(
        'Your session has expired. Your changes are not being saved. Please log out and log back in to continue.',
      );
      // Optionally log the user out
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      // General error
      alert('An error occurred while adding the message. Please try again.');
    }
  }

  contact() {
    const email = 'andy@jenkinssd.com'; // Replace with your email address
    const subject = 'Sage Page Query';
    const body = 'Hello, I would like to contact you regarding...';

    // Construct the mailto URL
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the email client
    window.location.href = mailtoLink;
  }

  protected readonly alert = alert;
}
