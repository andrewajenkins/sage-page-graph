import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-app';
  conversations = ['Conversation 1', 'Conversation 2', 'Conversation 3'];
  sidebarFlex = '0 0 10%'; // Initial sidebar width

  // Add logic to handle resizing if needed
}
