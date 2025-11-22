// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { SurveyService } from '../../services/survey.service';

// @Component({
//   selector: 'app-recent-surveys',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './recent-surveys.html',
//   styleUrls: ['./recent-surveys.css']
// })
// export class RecentSurveys implements OnInit {

//   surveys: any[] = [];

//   currentPage: number = 1;
//   pageSize: number = 10;
//   totalPages: number = 1;

//   loading: boolean = false;
//   loadingMessage: string = ""; // popup loader message

//   constructor(
//     private surveyService: SurveyService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadSurveys();
//   }

//   loadSurveys() {
//     this.surveyService.getAllSurveys().subscribe({
//       next: (data: any[]) => {
//         this.surveys = data || [];
//         this.totalPages = Math.ceil(this.surveys.length / this.pageSize);
//       },
//       error: err => console.error('Failed to load surveys:', err)
//     });
//   }

//   get pagedSurveys() {
//     const start = (this.currentPage - 1) * this.pageSize;
//     return this.surveys.slice(start, start + this.pageSize);
//   }

//   get pages() {
//     return Array(this.totalPages).fill(0).map((_, i) => i + 1);
//   }

//   goToPage(page: number) {
//     this.currentPage = page;
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) this.currentPage++;
//   }

//   prevPage() {
//     if (this.currentPage > 1) this.currentPage--;
//   }

//   editSurvey(id: number) {
//     this.router.navigate(['/app/surveys/edit', id]);
//   }

//   publishSurvey(id: number) {
//     this.loading = true;
//     this.loadingMessage = "Publishing survey…";

//     this.surveyService.publishSurvey(id).subscribe({
//       next: () => {
//         this.loading = false;
//         this.loadSurveys();
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }

//   deleteSurvey(id: number) {
//     this.surveyService.deleteSurvey(id).subscribe({
//       next: () => this.loadSurveys(),
//       error: () => {}
//     });
//   }

//   openForm(link: string) {
//     const emp = 'E101';
//     if (!link) return '';
//     return link.includes('?')
//       ? `${link}&employeeId=${emp}`
//       : `${link}?employeeId=${emp}`;
//   }
// }


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

  loading: boolean = false;
  loadingMessage: string = ""; 

  constructor(
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys() {
    this.surveyService.getAllSurveys().subscribe({
      next: (data: any[]) => {
        this.surveys = data || [];
        this.totalPages = Math.ceil(this.surveys.length / this.pageSize);
      },
      error: err => console.error('Failed to load surveys:', err)
    });
  }

  get pagedSurveys() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.surveys.slice(start, start + this.pageSize);
  }

  get pages() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  editSurvey(id: number) {
    this.router.navigate(['/app/surveys/edit', id]);
  }

  publishSurvey(id: number) {
    this.loading = true;
    this.loadingMessage = "Publishing survey…";

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
      next: () => this.loadSurveys(),
      error: () => {}
    });
  }

  openForm(link: string) {
    const emp = 'E101';
    if (!link) return '';
    return link.includes('?')
      ? `${link}&employeeId=${emp}`
      : `${link}?employeeId=${emp}`;
  }

  // 🔥 NEW — Navigate to response summary page
  viewResponses(id: number) {
  this.router.navigate([`/app/surveys/${id}/responses`]);
}



}

