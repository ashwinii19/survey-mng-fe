// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-filters-panel',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './filters-panel.html',
//   styleUrls: ['./filters-panel.css']
// })
// export class FiltersPanel {
//   @Input() surveys: any[] = [];
//   @Input() departments: any[] = [];

//   @Input() selectedSurveyId?: number;
//   @Input() selectedDepartmentId?: number;

//   @Output() selectedSurveyIdChange = new EventEmitter<number|undefined>();
//   @Output() selectedDepartmentIdChange = new EventEmitter<number|undefined>();
//   @Output() filterChanged = new EventEmitter<void>();

//   apply() { this.filterChanged.emit(); }
//   surveyChanged(v?: number) { this.selectedSurveyIdChange.emit(v); }
//   deptChanged(v?: number) { this.selectedDepartmentIdChange.emit(v); }
// }


// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-filters-panel',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './filters-panel.html',
//   styleUrls: ['./filters-panel.css']
// })
// export class FiltersPanel {

//   @Input() surveys: any[] = [];
//   @Input() departments: any[] = [];

//   @Input() selectedSurveyId: number | null | undefined = undefined;
//   @Input() selectedDepartmentId: number | null | undefined = undefined;

//   @Output() selectedSurveyIdChange = new EventEmitter<number | null | undefined>();
//   @Output() selectedDepartmentIdChange = new EventEmitter<number | null | undefined>();
//   @Output() filterChanged = new EventEmitter<void>();

//   apply() { 
//     this.filterChanged.emit(); 
//   }

//   surveyChanged(v: number | null | undefined) {
//     this.selectedSurveyIdChange.emit(v);
//   }

//   deptChanged(v: number | null | undefined) {
//     this.selectedDepartmentIdChange.emit(v);
//   }
// }

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

  @Input() selectedSurveyId: number | null = null;
  @Input() selectedDepartmentId: number | null = null;

  @Output() selectedSurveyIdChange = new EventEmitter<number | null>();
  @Output() selectedDepartmentIdChange = new EventEmitter<number | null>();
  @Output() filterChanged = new EventEmitter<boolean>();

  // UI Alerts + Loader
  invalidMessage: string = '';
  showInvalidAlert = false;

  showLoader = false;  // popup loader

  surveyChanged(v: number | null) {
    this.selectedSurveyIdChange.emit(v);
  }

  deptChanged(v: number | null) {
    this.selectedDepartmentIdChange.emit(v);
  }



apply() {
  this.showInvalidAlert = false;

  const survey = this.surveys.find(
    s => (s.id ?? s.surveyId) === this.selectedSurveyId
  );

  if (!survey) {
    return this.invalid("Please select a valid survey.");
  }

  const assignedStr = survey.targetDepartmentName ?? "ALL";
  const assignedList = assignedStr
    .split(",")
    .map((s: string) => s.trim().toLowerCase());

  const deptObj = this.departments.find(
    d => (d.id ?? d.departmentId) === this.selectedDepartmentId
  );

  const selectedDept = deptObj?.name?.trim().toLowerCase() ?? null;

  if (assignedList.includes("all")) {
    return this.valid();
  }

  if (!selectedDept) {
    return this.invalid("Please select a department.");
  }

  if (!assignedList.includes(selectedDept)) {
    return this.invalid(
      `Survey assigned to: ${assignedList.join(", ").toUpperCase()}`
    );
  }

  return this.valid();
}

private invalid(msg: string) {
  this.invalidMessage = msg;
  this.showInvalidAlert = true;
  this.filterChanged.emit(false);

  setTimeout(() => (this.showInvalidAlert = false), 4000);
}

private valid() {
  this.showLoader = true;

  setTimeout(() => (this.showLoader = false), 800);

  this.filterChanged.emit(true);
}
}
