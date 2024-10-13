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
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { SharedDataService } from '../services/shared-data.service';
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
    TreeModule,
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent {
  @Input() item: any;
  @Input() initialPath: number[] = [];
  @Output() nodeSelect = new EventEmitter<any>();

  treeData!: TreeNode[];
  selectedNode: TreeNode<any> | TreeNode<any>[] | null = null;

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (node: any, level: number) => ({
      expandable: !!node.queries && node.queries.length > 0,
      title: node.title,
      level: level,
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.queries,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ch ch ch changes:', changes);
    if (changes['item'] && this.item) {
      console.log('Item changed');
      this.initData();
    }
  }

  initData(): void {
    this.treeData = this.convertToTreeNodes([this.item]);
    this.dataSource.data = this.treeData;
    this.expandNodesAlongPath(this.treeData, this.initialPath);
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

  expandNodesAlongPath(nodes: TreeNode[], path: number[]): void {
    let currentNode = nodes[0];
    currentNode.expanded = true;

    for (const index of path) {
      if (currentNode.children && currentNode.children[index]) {
        currentNode = currentNode.children[index];
        currentNode.expanded = true;
      }
    }
  }

  addNewConversation(): void {
    this.selectedNode = null; // Unselect everything
    this.treeData = []; // Clear the graph
    this.nodeSelect.emit(null); // Emit null to indicate no selection
  }
}
