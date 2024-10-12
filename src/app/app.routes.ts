import { Routes } from '@angular/router';
import { ChatGraphComponent } from './chat-graph/chat-graph.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';

export const routes: Routes = [
    { path: 'chat-graph', component: ChatGraphComponent },
    { path: 'chat-window', component: ChatWindowComponent},
    { path: '', redirectTo: '/chat-window', pathMatch: 'full' }
];
