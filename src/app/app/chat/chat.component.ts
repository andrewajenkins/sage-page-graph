import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OpenAIService } from '../services/openai.service';
import { SharedDataService } from '../services/shared-data.service';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MarkdownModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @Input() chatHistory: any;
  @Input() initialPath: number[] = [];
  @Output() subQuerySelect = new EventEmitter<any>();

  machines = ['Machine 1', 'Machine 2', 'Machine 3'];
  selectedMachine = this.machines[0];
  query!: string | null;
  pendingResponse: any = null;

  constructor(
    private openAIService: OpenAIService,
    private dataService: SharedDataService, // Inject DataService
  ) {
    this.openNodesAlongPath(this.initialPath);
  }

  formatQueryResponse(item: any): string {
    return `**Query:** ${item.query}\n\n**Response:** ${item.response}\n\n`;
  }
  onSubQueryClick(parentIndex: number, index: number): void {
    if (
      this.chatHistory[parentIndex] &&
      this.chatHistory[parentIndex].queries
    ) {
      const subQuery = this.chatHistory[parentIndex].queries[index];
      if (subQuery) {
        const newChatHistory = this.chatHistory.slice(0, parentIndex + 1);
        newChatHistory.push(subQuery); // Add the selected sub-query to the path
        this.chatHistory = newChatHistory;
        this.subQuerySelect.emit(subQuery);
        this.dataService.selectNode([
          ...this.dataService.getCurrentPath(),
          index,
        ]); // Update current path
      }
    }
  }
  sendQuery(): void {
    if (!this.query) return;

    const newQuery = {
      query: this.query,
      response: '',
      queries: [],
      title: '', // Add title field
    };

    this.openAIService.sendQuery(this.query).subscribe((response) => {
      console.log('response', response);
      newQuery.response = response.choices[0].message.content;
      const summaryPrompt = `Summarize the following query and response in 3-5 words:\nQuery: ${newQuery.query}\nResponse: ${newQuery.response}`;
      this.openAIService
        .generateSummary(summaryPrompt)
        .subscribe((summaryResponse) => {
          newQuery.title = summaryResponse.choices[0].message.content.trim(); // Use summary response as title
          this.pendingResponse = newQuery;
        });
    });

    this.query = null;
  }
  approveResponse(): void {
    if (this.pendingResponse) {
      this.dataService.appendQuery(this.pendingResponse); // Append to data service
      this.chatHistory = this.dataService.getChatHistory(); // Update chat history
      this.onSubQueryClick(
        this.dataService.getCurrentPath().length - 1,
        this.dataService.getCurrentNode().length - 1,
      ); // Select the new node
      this.pendingResponse = null;
    }
  }

  deleteResponse(): void {
    this.pendingResponse = null;
  }
  openNodesAlongPath(path: number[]): void {
    let currentNode = this.dataService.getData();
    this.chatHistory = [currentNode[0]];

    for (const index of path) {
      if (currentNode[index] && currentNode[index].queries) {
        currentNode = currentNode[index].queries;
        this.chatHistory.push(currentNode[0]);
      }
    }
  }
}
