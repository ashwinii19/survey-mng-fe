import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-recent-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-surveys.html',
  styleUrls: ['./recent-surveys.css']
})
export class RecentSurveys implements OnInit {

  surveys: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  loading: boolean = false;   // loader flag

  constructor(
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys() {
    this.surveyService.getAllSurveys().subscribe({
      next: data => {
        this.surveys = data || [];
        this.totalPages = Math.ceil(this.surveys.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      },
      error: err => console.error('Failed to load surveys:', err)
    });
  }

  get pagedSurveys() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.surveys.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  editSurvey(id: number) {
    this.router.navigate(['/app/surveys/edit', id]);
  }

  publishSurvey(id: number) {

    this.loading = true;

    this.surveyService.publishSurvey(id).subscribe({
      next: () => {
        this.loading = false;
        this.loadSurveys();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteSurvey(id: number) {

    this.surveyService.deleteSurvey(id).subscribe({
      next: () => {
        this.loadSurveys();
      },
      error: () => {}
    });
  }

  openForm(link: string) {
    const empId = 'E101';
    if (!link) return '';
    return link.includes('?')
      ? `${link}&employeeId=${empId}`
      : `${link}?employeeId=${empId}`;
  }
}
