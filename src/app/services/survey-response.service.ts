import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyResponseService {

  private baseUrl = `${environment.apiBaseUrl}/admin/survey-responses`;

  constructor(private http: HttpClient) {}

  // SUMMARY
  getSurveySummary(surveyId: number) {
    return this.http.get(`${this.baseUrl}/${surveyId}`);
  }

  // QUESTION STATS
  getQuestionStats(surveyId: number) {
    return this.http.get(`${this.baseUrl}/${surveyId}/questions/stats`);
  }

  // TEXT ANSWERS (optional)
  getAnswersForQuestion(surveyId: number, questionId: number) {
    return this.http.get(`${this.baseUrl}/${surveyId}/questions/${questionId}/answers`);
  }
}
