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

  constructor(
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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

  deleteCurrentConversation(): void {
    if (this.selectedConversation) {
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

  selectConversation(id: number): void {
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
        .addChatMessage(this.selectedConversation?.id!, {
          ...msg,
          parent_message: this.initialPath[this.initialPath.length - 1],
        })
        .subscribe((response: any) => {
          this.selectConversation(this.selectedConversation?.id!);
        });
    } else {
      // this.aiService
      //   .generateSummary(response.message.query)
      //   .subscribe((response) => {
      this.sharedDataService
        .addFirstChatMessage(msg)
        .subscribe((response: any) => {
          this.selectConversation(response.conversation.id!);
        });
      //   });
    }
    // this.conversations = this.preprocessData(this.graphData);
    // this.cdr.detectChanges(); // Manually trigger change detection
  }

  onSubQuerySelect(subQuery: any): void {
    // console.log('Sub-query selected:', subQuery);
    // this.sharedDataService.setPathByQuery(subQuery.subQuery.query);
    // this.selectedConversation = this.sharedDataService.getCurrentConversation();
    // this.chatHistory = this.sharedDataService.getChatHistory();
    // this.initialPath = this.sharedDataService.getCurrentPath();
    // console.log('Updated chat history:', this.chatHistory);
    // console.log('Updated initial path:', this.initialPath);
    // this.cdr.detectChanges(); // Manually trigger change detection
  }
}
