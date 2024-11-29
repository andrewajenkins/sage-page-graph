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
import { Conversation } from '../app.component';
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
      this.initData(this.item);
    }
    if (changes['item'] && !this.item) {
      console.log('Item cleared');
      this.treeData = [];
      this.dataSource.data = this.treeData;
    }
    if (changes['initialPath'] && this.initialPath.length > 0) {
      this.expandNodesAlongPath(this.treeData, this.initialPath);
    }
  }

  initData(c: Conversation): void {
    this.treeData = this.convertToTreeNodes(c);
    this.dataSource.data = this.treeData;
    this.expandNodesAlongPath(this.treeData, this.initialPath);
  }

  convertToTreeNodes(conversation: Conversation): TreeNode[] {
    const messages = conversation.messages;

    // Step 1: Create a map for quick lookup of messages by id
    const messageMap: { [id: number]: TreeNode } = {};
    messages.forEach((message) => {
      messageMap[message.id] = {
        label: message.query,
        data: {
          id: message.id,
          query: message.query,
          response: message.response,
        },
        children: [], // Initialize empty children array
      };
    });

    // Step 2: Build the tree by assigning children to their parents
    const roots: TreeNode[] = [];
    messages.forEach((message) => {
      const treeNode = messageMap[message.id];
      if (message.parent_message) {
        // If the message has a parent, add it to the parent's children
        messageMap[message.parent_message].children?.push(treeNode);
      } else {
        // If no parent, it's a root node
        roots.push(treeNode);
      }
    });

    // Step 3: Return the root nodes (the full tree)
    return roots;
  }

  onNodeSelect(event: any): void {
    console.log(event);
    // convert event to graph node
    this.nodeSelect.emit({
      id: event.node.data.id,
      title: event.node.label,
      query: event.node.data.query,
    });
  }

  expandNodesAlongPath(nodes: TreeNode[], path: number[]): void {
    if (nodes.length === 0) return;

    // Collapse all nodes first
    this.collapseAllNodes(nodes);

    let currentNode = nodes[0];
    currentNode.expanded = true;

    for (const id of path) {
      if (!currentNode.children) {
        break;
      }
      const index = currentNode.children.findIndex(
        (child) => child.data.id === id,
      );
      if (index !== -1) {
        currentNode = currentNode.children[index];
        currentNode.expanded = true;
      }
    }

    // Set the selected node to the last node in the path
    this.selectedNode = currentNode;
  }
  collapseAllNodes(nodes: TreeNode[]): void {
    nodes.forEach((node) => {
      node.expanded = false;
      this.dataSource.data = [];
      this.dataSource.data = this.treeData;
      if (node.children) {
        this.collapseAllNodes(node.children);
      }
    });
  }
}
