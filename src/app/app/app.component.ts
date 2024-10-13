import { ChangeDetectorRef, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { SharedDataService } from './services/shared-data.service';
import { AngularSplitModule } from 'angular-split';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule

export interface Conversation {
  title: string;
  query: string;
  response: string;
  queries: Conversation[];
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedConversation: Conversation | null = null;
  title = 'my-app';
  sidebarFlex = '0 0 10%';
  graphData: Conversation[] = [];
  chatHistory: Conversation[] = [];
  isSidenavOpen = true;
  isGraphView = false;
  conversations: Conversation[] = [];
  initialPath: number[] = [];

  constructor(
    private sharedDataService: SharedDataService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.graphData = this.sharedDataService.getData();
    this.conversations = this.preprocessData(this.graphData);
    this.chatHistory = this.sharedDataService.initializeDeepestConversation();
    this.selectedConversation = this.graphData[0]; // Initialize selectedConversation
    this.initialPath = this.sharedDataService.getCurrentPath(); // Get the initial path

    this.sharedDataService.queryAppended.subscribe(() => {
      this.selectedConversation = {
        ...this.sharedDataService.getCurrentConversation(),
      };
      this.initialPath = [...this.sharedDataService.getCurrentPath()];
      this.cdr.detectChanges();
    });
  }

  preprocessData(data: any): any {
    return data.map((item: any) => item.title);
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

  selectConversation(index: number): void {
    this.selectedConversation =
      this.sharedDataService.getConversationByIndex(index);
    console.log('Selected conversation:', this.selectedConversation);
    this.chatHistory = this.findPath(
      this.graphData,
      this.selectedConversation.query,
    );
    // const test = this.sharedDataService.initializeDeepestConversation();
    this.initialPath = this.sharedDataService.getCurrentPath();
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
    this.graphData.splice(index, 1);
    this.conversations = this.preprocessData(this.graphData);

    if (this.selectedConversation === this.graphData[index]) {
      this.selectedConversation = this.graphData[0] || null;
      this.chatHistory = this.sharedDataService.initializeDeepestConversation();
      this.initialPath = this.sharedDataService.getCurrentPath();
    }

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
}
