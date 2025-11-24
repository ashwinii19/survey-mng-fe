import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-table.html',
  styleUrls: ['./pending-table.css']
})
export default class PendingTable {
  @Input() pending: string[] = [];
}
