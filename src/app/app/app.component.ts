import { ChangeDetectorRef, Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { SharedDataService } from './services/shared-data.service';
import { AngularSplitModule } from 'angular-split';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedConversation: any;
  title = 'my-app';
  sidebarFlex = '0 0 10%';
  graphData: any;
  chatHistory: any;
  isSidenavOpen = true;
  isGraphView = false;
  conversations = [];
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

  findPath(data: any, targetQuery: string, path: any[] = []): any[] {
    for (const item of data) {
      const newPath = [
        ...path,
        {
          title: item.title,
          query: item.query,
          response: item.response,
          queries: item.queries,
        },
      ];
      if (item.query === targetQuery) {
        return newPath;
      }
      const result = this.findPath(item.queries, targetQuery, newPath);
      if (result.length) {
        return result;
      }
    }
    return [];
  }
  onSubQuerySelect(subQuery: any): void {
    // Handle the sub-query selection
    console.log('Sub-query selected:', subQuery);
    // Update the chat history path or perform any other necessary actions
  }
  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    this.chatHistory = this.findPath(this.graphData, conversation.query);
    this.initialPath = this.sharedDataService.getCurrentPath();
  }

  onNodeSelect(node: any): void {
    this.chatHistory = this.findPath(this.graphData, node.query);
    this.initialPath = this.sharedDataService.getCurrentPath();
  }

  // acceptNewAnswer(newAnswer: any): void {
  //   const newConversation = {
  //     title: newAnswer.title,
  //     query: newAnswer.query,
  //     response: newAnswer.response,
  //     queries: [],
  //   };
  //   this.graphData.push(newConversation);
  //   this.selectedConversation = newConversation;
  //   this.chatHistory = [newConversation];
  //   this.initialPath = [this.graphData.length - 1]; // Set the initial path to the new conversation
  // }

  addNewConversation(): void {
    this.selectedConversation = null; // Unselect everything
    this.initialPath = [];
    this.chatHistory = []; // Clear the chat history
    this.sharedDataService.reset(); // Reset pointers in the data service
  }
}
