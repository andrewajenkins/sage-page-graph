import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { SharedDataService } from './services/shared-data.service';
import { AngularSplitModule } from 'angular-split';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

export interface Message {
  id: number;
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
  graphData: Conversation[] = [];

  // a linear chat history displayed in the chat window, derived from a conversation graph
  chatHistory: Conversation[] = [];
  conversations: Conversation[] = [];
  initialPath: number[] = [];

  constructor(
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // this.graphData = this.sharedDataService.getData();
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

  findPath(data: any[], targetQuery: string, path: any[] = []): any[] {
    for (const item of data) {
      const newPath = [...path, item];
      console.log('findPath -> newPath', newPath);
      if (item.query === targetQuery) {
        console.log('findPath -> Found path:', newPath);
        return newPath;
      }
      if (item.queries && item.queries.length > 0) {
        const result = this.findPath(item.queries, targetQuery, newPath);
        if (result.length > 0) {
          console.log('findPath -> Found path:', result);
          return result;
        }
      }
    }
    console.log('findPath -> No path found');
    return [];
  }
  deleteCurrentConversation(): void {
    if (this.selectedConversation) {
      const path = this.sharedDataService.currentPath;
      console.log('Current path:', path);
      const index = path[0];
      console.log('Index:', index);
      // this.conversations.indexOf(this.selectedConversation);
      if (index > -1) {
        this.removeConversation(index, new Event('delete'));
      }
    }
  }

  selectConversation(index: number): void {
    this.sharedDataService
      .getConversationById(this.conversations[index].id)
      .subscribe((c: Conversation) => {
        this.selectedConversation = c;
        console.log('Selected conversation:', this.selectedConversation);
        this.chatHistory =
          this.sharedDataService.initializeDeepestConversation(c);
        this.initialPath = this.sharedDataService.getCurrentPath(); // Get the initial path

        // Update the graph to open to the deepest conversation
        this.sharedDataService.setPathByQuery(
          this.selectedConversation.messages[0].query,
        );
        this.cdr.detectChanges(); // Manually trigger change detection
      });
  }

  onNodeSelect(node: any): void {
    console.log('Node selected:', node);
    this.sharedDataService.setPathByQuery(node.query);
    this.chatHistory = this.findPath(this.graphData, node.query);
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

  removeConversation(index: number, event: Event): void {
    // event.stopPropagation(); // Stop event propagation
    console.log('Removing conversation at index:', index);
    const wasCurrent =
      this.selectedConversation?.messages[0]?.query ===
      this.graphData[index].messages[0].query;
    this.graphData.splice(index, 1);
    this.conversations = this.preprocessData(this.graphData);

    if (wasCurrent) {
      this.selectedConversation = this.graphData[0] || null;
      if (this.selectedConversation) {
        this.chatHistory = this.sharedDataService.initializeDeepestConversation(
          this.selectedConversation,
        );
        this.initialPath = this.sharedDataService.getCurrentPath();
      } else {
        this.chatHistory = [];
        this.initialPath = [];
        this.sharedDataService.reset();
      }
    }

    this.cdr.detectChanges(); // Manually trigger change detection
  }
  onConversationAdded(): void {
    this.conversations = this.preprocessData(this.graphData);
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  onSubQuerySelect(subQuery: any): void {
    console.log('Sub-query selected:', subQuery);
    this.sharedDataService.setPathByQuery(subQuery.subQuery.query);
    this.selectedConversation = this.sharedDataService.getCurrentConversation();
    this.chatHistory = this.sharedDataService.getChatHistory();
    this.initialPath = this.sharedDataService.getCurrentPath();
    console.log('Updated chat history:', this.chatHistory);
    console.log('Updated initial path:', this.initialPath);
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  private preprocessData(graphData: Conversation[]) {
    return graphData; //.map((c) => c.messages[0].title)
  }
}
