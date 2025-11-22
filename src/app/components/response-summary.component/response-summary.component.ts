import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { SurveyResponseService } from '../../services/survey-response.service';

@Component({
  selector: 'app-response-summary',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './response-summary.component.html',
  styleUrls: ['./response-summary.component.css']
})
export class ResponseSummaryComponent implements OnInit {

  surveyId!: number;
  summary: any = null;
  questionStats: any[] = [];
  loading = false;

  palette: string[] = [
    '#14b8a6', '#0ea5e9', '#6366f1',
    '#f59e0b', '#ef4444', '#10b981',
    '#ec4899', '#84cc16'
  ];

  constructor(
    private route: ActivatedRoute,
    private responseService: SurveyResponseService
  ) {}

  ngOnInit(): void {
    this.surveyId = Number(this.route.snapshot.paramMap.get('surveyId'));
    this.loadSummary();
    this.loadStats();
  }

  loadSummary() {
    this.responseService.getSurveySummary(this.surveyId).subscribe({
      next: (res: any) => (this.summary = res),
    });
  }

  loadStats() {
    this.loading = true;
    this.responseService.getQuestionStats(this.surveyId).subscribe({
      next: (res: any) => {
        this.questionStats = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  buildPieData(q: any): ChartData<'pie'> {
    const labels = Object.keys(q.optionCounts || {});
    const values = Object.values(q.optionCounts || {}).map(v => Number(v || 0));

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, i) => this.palette[i % this.palette.length])
        }
      ]
    };
  }

  buildBarData(q: any): ChartData<'bar'> {
    const labels = Object.keys(q.optionCounts || {});
    const values = Object.values(q.optionCounts || {}).map(v => Number(v || 0));

    return {
      labels,
      datasets: [
        {
          label: q.questionText,
          data: values,
          backgroundColor: labels.map((_, i) => this.palette[i % this.palette.length])
        }
      ]
    };
  }

  castToNumber(v: unknown): number {
    return Number(v) || 0;
  }

  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };
}
