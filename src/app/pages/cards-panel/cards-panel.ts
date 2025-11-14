import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardResponse } from '../../models/dashboard-response';

@Component({
  selector: 'app-cards-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards-panel.html',
  styleUrls: ['./cards-panel.css']
})
export class CardsPanel {
  @Input() dashboard?: DashboardResponse;
}
