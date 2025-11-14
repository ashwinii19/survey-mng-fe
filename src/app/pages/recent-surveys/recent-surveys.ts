import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recent-surveys',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-surveys.html',
  styleUrls: ['./recent-surveys.css']
})
export default class RecentSurveys {
  @Input() surveys: any[] = [];
}
