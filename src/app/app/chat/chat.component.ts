import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OpenAIService } from '../services/openai.service';
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
  @Output() subQuerySelect = new EventEmitter<any>();

  machines = ['Machine 1', 'Machine 2', 'Machine 3'];
  selectedMachine = this.machines[0];
  query!: string | null;
  pendingResponse: any = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private openAIService: OpenAIService,
  ) {}

  formatQueryResponse(item: any): string {
    return `**Query:** ${item.query}\n\n**Response:** ${item.response}\n\n`;
  }
  onSubQueryClick(parentIndex: number, index: number): void {
    const subQuery = this.chatHistory[parentIndex].queries[index];
    const newChatHistory = this.chatHistory.slice(0, parentIndex + 1);
    newChatHistory.push(subQuery); // Add the selected sub-query to the path
    this.chatHistory = newChatHistory;
    this.subQuerySelect.emit(subQuery);
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
  generateSummary(query: string, response: string): string {
    // Simple heuristic to generate a summary
    const queryWords = query.split(' ').slice(0, 3).join(' ');
    const responseWords = response.split(' ').slice(0, 3).join(' ');
    return `${queryWords} / ${responseWords}`;
  }
  approveResponse(): void {
    if (this.pendingResponse) {
      if (this.chatHistory.length === 0) {
        this.chatHistory.push(this.pendingResponse);
      } else {
        this.chatHistory[this.chatHistory.length - 1].queries.push(
          this.pendingResponse,
        );
      }
      this.pendingResponse = null;
    }
  }

  deleteResponse(): void {
    this.pendingResponse = null;
  }
}
