import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './chat/chat.component';
import { GraphComponent } from './graph/graph.component';
import { SharedDataService } from './services/shared-data.service';

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, ChatComponent, GraphComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-app';
  sidebarFlex = '0 0 10%';
  graphData: any;
  chatHistory: any;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    const data = this.sharedDataService.getData();
    console.log(JSON.stringify(data, null, 2));
    this.graphData = this.preprocessData(data);
    this.chatHistory = this.findPath(data, 'Explain unsupervised learning');
  }

  preprocessData(data: any): any {
    return data.map((item: any) => ({
      title: item.title,
      queries: this.preprocessData(item.queries),
    }));
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
}
