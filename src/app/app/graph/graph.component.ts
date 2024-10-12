import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TreeNode } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    TreeModule,
    TooltipModule,
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent {
  @Input() item: any;
  @Output() nodeSelect = new EventEmitter<any>();

  treeData!: TreeNode[];
  selectedNode: TreeNode<any> | TreeNode<any>[] | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.treeData = this.convertToTreeNodes([this.item]);
    }
  }

  convertToTreeNodes(data: any): TreeNode[] {
    return data.map((item: any) => ({
      label: item.title,
      data: { query: item.query, response: item.response },
      children: this.convertToTreeNodes(item.queries),
    }));
  }

  onNodeSelect(event: any): void {
    console.log(event);
    // convert event to graph node
    this.nodeSelect.emit({
      title: event.node.label,
      query: event.node.data.query,
    });
  }
}
