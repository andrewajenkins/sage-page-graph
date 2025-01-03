import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OpenAIService } from '../services/openai.service';
import { SharedDataService } from '../services/shared-data.service';
import { Conversation, Message } from '../app.component';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
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
    DividerModule,
    DropdownModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnChanges {
  @Input() chatHistory: any;
  @Input() initialPath: number[] = [];
  @Input() selectedConversation: Conversation | null = null;
  @Output() subQuerySelect = new EventEmitter<any>();
  @Output() messageAdded = new EventEmitter<Message>();

  machines!: string[];
  selectedMachine: any;
  query!: string | null;
  pendingResponse: any = null;

  constructor(
    private openAIService: OpenAIService,
    private dataService: SharedDataService, // Inject DataService
  ) {
    this.dataService.getMachines().subscribe((machines: any) => {
      console.log('machines', machines);
      this.machines = machines.data
        .filter(
          (machine: any) =>
            machine.id.startsWith('gpt') &&
            machine.id.indexOf('realtime') === -1,
        )
        .map((machine: any) => machine.id);
      this.selectedMachine = this.machines[0];
      console.log('this.machines:', this.machines);
    });
  }
  ngOnChanges(changes: any): void {
    console.log('chat component -> changes', changes);
    if (changes.chatHistory) {
      this.chatHistory = changes.chatHistory.currentValue;
    }
    if (changes.initialPath) {
      this.initialPath = changes.initialPath.currentValue;
    }
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
        this.subQuerySelect.emit({ subQuery, path: newChatHistory });
        const newPath = [
          ...this.dataService.getCurrentPath().slice(0, parentIndex + 1),
          index,
        ];
        this.dataService.selectNode(newPath); // Update current path
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

    const currentMessageId =
      this.chatHistory.length > 0
        ? this.chatHistory[this.chatHistory.length - 1].id
        : null;

    this.openAIService
      .sendQuery(
        this.selectedConversation?.id,
        currentMessageId,
        this.query,
        this.selectedMachine,
      )
      .subscribe((response: any) => {
        console.log('response', response);
        newQuery.response = response.choices[0].message.content;
        const summaryPrompt = `Summarize the following query in 3-5 words:\nQuery: ${newQuery.query}`;
        this.openAIService
          .generateSummary(summaryPrompt)
          .subscribe((summaryResponse: any) => {
            newQuery.title = summaryResponse.choices[0].message.content.trim(); // Use summary response as title
            this.pendingResponse = newQuery;
          });
      });

    this.query = null;
  }
  approveResponse(): void {
    if (this.pendingResponse) {
      this.chatHistory.push(this.pendingResponse);
      this.messageAdded.emit(this.pendingResponse);
      this.pendingResponse = null;
    }
  }

  deleteResponse(): void {
    this.pendingResponse = null;
  }
}
