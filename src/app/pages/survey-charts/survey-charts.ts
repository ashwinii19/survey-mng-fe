import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-survey-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './survey-charts.html',
  styleUrls: ['./survey-charts.css']
})
export default class SurveyCharts implements OnChanges {
  @Input() surveyStats: any | undefined;

  donutData: any = null;
  barData: any = null;

  ngOnChanges(changes: SimpleChanges) {
    if (!this.surveyStats) {
      this.donutData = { labels: [], datasets: [] };
      this.barData = { labels: [], datasets: [] };
      return;
    }
    const submitted = this.surveyStats.totalSubmitted ?? 0;
    const pending = this.surveyStats.totalPending ?? ( (this.surveyStats.totalEmployees ?? 0) - submitted );

    this.donutData = { labels: ['Submitted', 'Pending'], datasets: [{ data: [submitted, pending] }] };
    this.barData = { labels: [this.surveyStats.surveyTitle || this.surveyStats.title || 'Survey'], datasets: [
      { label: 'Submitted', data: [submitted] },
      { label: 'Pending', data: [pending] }
    ]};
  }
}
