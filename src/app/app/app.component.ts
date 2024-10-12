import { Component } from '@angular/core';
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

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.graphData = this.sharedDataService.getData();
    console.log(JSON.stringify(this.graphData, null, 2));
    this.conversations = this.preprocessData(this.graphData);
    this.chatHistory = this.findPath(
      this.graphData,
      'Explain unsupervised learning',
    );
  }

  preprocessData(data: any): any {
    return data.map((item: any) => item.title);
  }

  findPath(data: any, targetQuery: string, path: any[] = []): any[] {
    for (const item of data) {
      const newPath = [
        ...path,
        { title: item.title, query: item.query, response: item.response },
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
  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    this.chatHistory = this.findPath(this.graphData, conversation.query);
  }
}
