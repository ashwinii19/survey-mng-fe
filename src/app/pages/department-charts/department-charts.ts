import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-department-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './department-charts.html',
  styleUrls: ['./department-charts.css']
})
export default class DepartmentCharts implements OnChanges {
  @Input() departmentStats: any[] = [];

  barData: any = null;
  donutData: any = null;

  ngOnChanges(changes: SimpleChanges) {
    this.reload();
  }

  private reload() {
    if (!this.departmentStats || this.departmentStats.length === 0) {
      this.barData = { labels: [], datasets: [] };
      this.donutData = { labels: [], datasets: [] };
      return;
    }
    const labels = this.departmentStats.map(d => d.departmentName || d.name);
    const submitted = this.departmentStats.map(d => d.submitted || 0);
    const pending = this.departmentStats.map(d => d.pending ?? ((d.totalEmployees || 0) - (d.submitted || 0)));

    this.barData = {
      labels,
      datasets: [
        { label: 'Submitted', data: submitted },
        { label: 'Pending', data: pending }
      ]
    };

    this.donutData = {
      labels,
      datasets: [{ data: submitted }]
    };
  }
}
