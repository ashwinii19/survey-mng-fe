// import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NgChartsModule } from 'ng2-charts';

// @Component({
//   selector: 'app-department-charts',
//   standalone: true,
//   imports: [CommonModule, NgChartsModule],
//   templateUrl: './department-charts.html',
//   styleUrls: ['./department-charts.css']
// })
// export default class DepartmentCharts implements OnChanges {
//   @Input() departmentStats: any[] = [];

//   barData: any = null;
//   donutData: any = null;

//   ngOnChanges(changes: SimpleChanges) {
//     this.reload();
//   }

//   private reload() {
//     if (!this.departmentStats || this.departmentStats.length === 0) {
//       this.barData = { labels: [], datasets: [] };
//       this.donutData = { labels: [], datasets: [] };
//       return;
//     }
//     const labels = this.departmentStats.map(d => d.departmentName || d.name);
//     const submitted = this.departmentStats.map(d => d.submitted || 0);
//     const pending = this.departmentStats.map(d => d.pending ?? ((d.totalEmployees || 0) - (d.submitted || 0)));

//     this.barData = {
//       labels,
//       datasets: [
//         { label: 'Submitted', data: submitted },
//         { label: 'Pending', data: pending }
//       ]
//     };

//     this.donutData = {
//       labels,
//       datasets: [{ data: submitted }]
//     };
//   }
// }


import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-department-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './department-charts.html',
  styleUrls: ['./department-charts.css']
})
export default class DepartmentCharts implements OnChanges {

  @Input() departmentStats: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  // MULTI-COLOR PALETTE
  private barColors = [
    '#0ea5e9', '#f97316', '#84cc16', '#ec4899',
    '#a855f7', '#eab308', '#10b981', '#3b82f6'
  ];

  // BAR CHART OPTIONS WITH ANIMATION + LEGEND
  public barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#111', font: { size: 12 } }
      }
    },
    scales: {
      x: { ticks: { color: '#111' } },
      y: { beginAtZero: true, ticks: { color: '#111' } }
    }
  };

  public barData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  // DONUT OPTIONS — WITH % LABELS
  public donutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart._metasets[0].total;
          const percent = ((value / total) * 100).toFixed(1);
          return percent + '%';
        }
      }
    }
  };

  public donutData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };

  ngOnChanges(changes: SimpleChanges) {
    this.updateCharts();
  }

  private updateCharts() {
    if (!this.departmentStats || this.departmentStats.length === 0) {
      this.barData = { labels: [], datasets: [] };
      this.donutData = { labels: [], datasets: [] };
      this.cdr.detectChanges();
      return;
    }

    const labels = this.departmentStats.map(d => d.name ?? d.departmentName ?? 'Unknown');
    const submitted = this.departmentStats.map(d => Number(d.submitted ?? 0));

    // MULTI-COLOR BAR CHART
    this.barData = {
      labels: [...labels],
      datasets: [
        {
          label: 'Submitted Employees',
          data: [...submitted],
          backgroundColor: labels.map((_, i) => this.barColors[i % this.barColors.length])
        }
      ]
    };

    // DONUT WITH MULTI-COLOR & % LABELS
    this.donutData = {
      labels: [...labels],
      datasets: [
        {
          data: [...submitted],
          backgroundColor: this.barColors
        }
      ]
    };

    this.cdr.detectChanges();
  }
}
