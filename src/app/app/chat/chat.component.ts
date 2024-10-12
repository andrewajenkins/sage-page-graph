import { Component, Input } from '@angular/core';
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
  machines = ['Machine 1', 'Machine 2', 'Machine 3'];
  selectedMachine = this.machines[0];
  query!: string | null;

  formatChatItem(item: any): string {
    let formatted = `**Query:** ${item.query}\n\n**Response:** ${item.response}\n\n`;
    if (item.queries && item.queries.length > 0) {
      formatted += '**Sub-queries:**\n';
      item.queries.forEach((subQuery: any) => {
        formatted += `- [${subQuery.title}](#)\n`;
      });
    }
    return formatted;
  }

  sendQuery(): void {
    // Handle sending the query
    console.log('Query sent:', this.query);
  }
}
