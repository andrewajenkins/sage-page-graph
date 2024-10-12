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

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
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
    // Handle sending the query
    console.log('Query sent:', this.query);
  }
}
