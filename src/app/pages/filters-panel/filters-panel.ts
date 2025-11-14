import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-panel.html',
  styleUrls: ['./filters-panel.css']
})
export class FiltersPanel {
  @Input() surveys: any[] = [];
  @Input() departments: any[] = [];

  @Input() selectedSurveyId?: number;
  @Input() selectedDepartmentId?: number;

  @Output() selectedSurveyIdChange = new EventEmitter<number|undefined>();
  @Output() selectedDepartmentIdChange = new EventEmitter<number|undefined>();
  @Output() filterChanged = new EventEmitter<void>();

  apply() { this.filterChanged.emit(); }
  surveyChanged(v?: number) { this.selectedSurveyIdChange.emit(v); }
  deptChanged(v?: number) { this.selectedDepartmentIdChange.emit(v); }
}
