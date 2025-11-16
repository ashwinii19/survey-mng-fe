// // src/app/pages/recent-surveys/recent-surveys.ts
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

//   constructor(
//     private surveyService: SurveyService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadSurveys();
//   }

//   loadSurveys() {
//     this.surveyService.getAllSurveys().subscribe({
//       next: data => this.surveys = data || [],
//       error: err => console.error('Failed to load surveys:', err)
//     });
//   }

//   // navigate to edit route (edit/:id)
//   editSurvey(id: number) {
//     this.router.navigate(['/app/surveys/edit', id]);
//   }

//   publishSurvey(id: number) {
//     if (!confirm('Publish this survey?')) return;

//     this.surveyService.publishSurvey(id).subscribe({
//       next: () => {
//         alert('Survey published!');
//         this.loadSurveys();
//       },
//       error: () => alert('Publish failed')
//     });
//   }

//   // build form link, avoid double ?employeeId
//   openForm(link: string) {
//     const empId = 'E101';
//     if (!link) return '';
//     return link.includes('?') ? `${link}&employeeId=${empId}` : `${link}?employeeId=${empId}`;
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

  constructor(
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys() {
    this.surveyService.getAllSurveys().subscribe({
      next: data => this.surveys = data || [],
      error: err => console.error('Failed to load surveys:', err)
    });
  }

  editSurvey(id: number) {
    this.router.navigate(['/app/surveys/edit', id]);
  }

  publishSurvey(id: number) {
    if (!confirm('Publish this survey?')) return;

    this.surveyService.publishSurvey(id).subscribe({
      next: () => {
        alert('Survey published!');
        this.loadSurveys();
      },
      error: () => alert('Publish failed')
    });
  }

  deleteSurvey(id: number) {
    if (!confirm('Delete this survey permanently?')) return;

    this.surveyService.deleteSurvey(id).subscribe({
      next: () => {
        alert('Survey deleted!');
        this.loadSurveys();
      },
      error: () => alert('Delete failed')
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
