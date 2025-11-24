import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray, FormBuilder, FormGroup,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SurveyService } from '../../services/survey.service';
import { EmployeeService } from '../../services/employee/employee';
import { Department, Employee } from '../../models/employee';
import { RecentSurveys } from '../../pages/recent-surveys/recent-surveys';

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecentSurveys],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css']
})
export class CreateSurveyComponent implements OnInit {

  surveyForm!: FormGroup;
  departments: Department[] = [];
  employees: Employee[] = [];
  positions: string[] = [];

  loadingPositions = true;
  validationError: string | null = null;

  questionTypes = ['text', 'textarea', 'radio', 'checkbox', 'dropdown'];

  isEditMode = false;
  currentSurveyId: number | null = null;
  currentSurveyEditable = true;

  constructor(
    private fb: FormBuilder,
    private surveyService: SurveyService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    this.loadEmployees();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentSurveyId = Number(id);
      this.loadSurveyForEdit(this.currentSurveyId);
    }
  }

  initForm() {
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetDepartments: [null],
      targetPosition: [''],
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  // =================================================================
  // LOAD DEPARTMENTS
  // =================================================================
  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: d => this.departments = d,
      error: err => console.error('Failed to load departments', err)
    });
  }

  // =================================================================
  // LOAD EMPLOYEES → COLLECT UNIQUE POSITIONS
  // =================================================================
  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: emps => {
        this.employees = emps;
        this.positions = [...new Set(
          emps.map(e => e.position?.trim()).filter(p => p && p.length > 0)
        )];
        this.loadingPositions = false;
      },
      error: err => {
        console.error('Failed loading employees', err);
        this.loadingPositions = false;
      }
    });
  }

  // =================================================================
  // LOAD SURVEY FOR EDIT
  // =================================================================
  loadSurveyForEdit(id: number) {
    this.surveyService.getSurvey(id).subscribe({
      next: (s: any) => {
        this.currentSurveyEditable = !!s.editable;

        // Department mapping (convert name → id)
        let selectedDeptId: number | null = null;
        if (s.targetDepartments?.includes("ALL")) {
          selectedDeptId = 0;
        } else {
          const match = this.departments.find(d => s.targetDepartments?.includes(d.name));
          selectedDeptId = match?.id ?? null;
        }

        this.surveyForm.patchValue({
          title: s.title,
          description: s.description,
          targetDepartments: selectedDeptId,
          targetPosition: s.targetPosition || ''
        });

        // Load questions
        this.questions.clear();

        (s.questions || []).forEach((q: any) => {
          const type = (q.type || q.questionType || '').toLowerCase();

          const formQ = this.fb.group({
            text: [q.text, Validators.required],
            type: [type, Validators.required],
            required: [!!q.required],
            options: this.fb.array([])
          });

          if (['radio', 'checkbox', 'dropdown'].includes(type)) {
            const optionsArray = Array.isArray(q.options)
              ? q.options
              : q.options.split(',').map((o: string) => o.trim());

            optionsArray.forEach((opt: string) =>
              (formQ.get('options') as FormArray).push(
                this.fb.control(opt, Validators.required)
              )
            );
          }

          this.questions.push(formQ);
        });

        if (!this.currentSurveyEditable) this.surveyForm.disable();
      },
      error: err => console.error('Failed loading survey:', err)
    });
  }

  // =================================================================
  // QUESTION OPERATIONS
  // =================================================================
  addQuestion() {
    const q = this.fb.group({
      text: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false],
      options: this.fb.array([])
    });
    this.questions.push(q);
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
  }

  showOptions(i: number): boolean {
    const t = this.questions.at(i).get('type')?.value;
    return ['radio', 'checkbox', 'dropdown'].includes(t);
  }

  getOptions(i: number): FormArray {
    return this.questions.at(i).get('options') as FormArray;
  }

  handleTypeChange(i: number) {
    const opts = this.getOptions(i);
    opts.clear();

    const t = this.questions.at(i).get('type')?.value;
    if (['radio', 'checkbox', 'dropdown'].includes(t)) {
      opts.push(this.fb.control('', Validators.required));
      opts.push(this.fb.control('', Validators.required));
    }
  }

  addOption(i: number) {
    this.getOptions(i).push(this.fb.control('', Validators.required));
  }

  removeOption(i: number, j: number) {
    this.getOptions(i).removeAt(j);
  }

  // =================================================================
  // VALIDATION → DEPARTMENT OR POSITION REQUIRED
  // =================================================================
  validateTargetFields(): boolean {
    const dept = this.surveyForm.value.targetDepartments;
    const pos = this.surveyForm.value.targetPosition?.trim();

    if ((dept === null || dept === '') && (!pos || pos.length === 0)) {
      this.validationError = "Please select at least one: Department or Position.";
      return false;
    }

    this.validationError = null;
    return true;
  }

  // =================================================================
  // PAYLOAD NORMALIZATION
  // =================================================================
  normalizePayload(payload: any) {

    payload.questions = (payload.questions || []).map((q: any) => ({
      text: q.text,
      type: q.type.toLowerCase(),
      required: !!q.required,
      options: q.options || []
    }));

    if (payload.targetDepartments === 0) {
      payload.targetDepartments = [];
    } else if (payload.targetDepartments) {
      payload.targetDepartments = [Number(payload.targetDepartments)];
    } else {
      payload.targetDepartments = [];
    }

    return payload;
  }

  // =================================================================
  // SAVE FINAL SURVEY
  // =================================================================
  // createSurveyFinal() {

  //   if (!this.validateTargetFields()) return;

  //   if (this.surveyForm.invalid) {
  //     this.validationError = "Please fill all required fields.";
  //     return;
  //   }

  //   let payload = this.normalizePayload({
  //     ...this.surveyForm.value,
  //     draft: false
  //   });

  //   if (this.isEditMode && this.currentSurveyId) {
  //     this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
  //       next: () => {
  //         alert("Survey updated successfully!");
  //         this.router.navigate(['/app/surveys']);
  //       }
  //     });
  //     return;
  //   }

  //   this.surveyService.createSurvey(payload).subscribe({
  //     next: () => {
  //       alert("Survey created successfully!");
  //       this.router.navigate(['/app/surveys']);
  //     }
  //   });
  // }

  createSurveyFinal() {

  // ---- VALIDATION: Department/Position ----
  const dept = this.surveyForm.value.targetDepartments;
  const pos  = this.surveyForm.value.targetPosition;

  if ((!dept || dept === '') && (!pos || pos.trim() === '')) {
    alert("Please select at least one department or position.");
    return;
  }

  // ---- VALIDATION: At least one question ----
  if (this.questions.length === 0) {
    alert("Please add at least one question before creating the survey.");
    return;
  }

  // ---- Form validation ----
  if (this.surveyForm.invalid) {
    alert("Please fill all required fields.");
    return;
  }

  let payload = this.normalizePayload({ 
    ...this.surveyForm.value, 
    draft: false 
  });

  if (this.isEditMode && this.currentSurveyId) {
    this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
      next: () => {
        alert("Survey updated successfully!");
        this.router.navigate(['/app/surveys']);
      }
    });
    return;
  }

  this.surveyService.createSurvey(payload).subscribe({
    next: () => {
      alert("Survey created successfully!");
      this.router.navigate(['/app/surveys']);
    }
  });
}


  // =================================================================
  // SAVE AS DRAFT
  // =================================================================
  // saveAsDraft() {
  //   let payload = this.normalizePayload({
  //     ...this.surveyForm.getRawValue(),
  //     draft: true
  //   });

  //   if (!payload.questions.length) {
  //     payload.questions = [
  //       { text: 'Draft Placeholder', type: 'text', required: false, options: [] }
  //     ];
  //   }

  //   if (this.isEditMode && this.currentSurveyId) {
  //     this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
  //       next: () => {
  //         alert("Draft updated successfully!");
  //         this.router.navigate(['/app/surveys']);
  //       }
  //     });
  //     return;
  //   }

  //   this.surveyService.createSurvey(payload).subscribe({
  //     next: () => {
  //       alert("Survey saved as draft!");
  //       this.router.navigate(['/app/surveys']);
  //     }
  //   });
  // }

  saveAsDraft() {

  // ---- VALIDATION: Department OR Position required ----
  const dept = this.surveyForm.value.targetDepartments;
  const pos  = this.surveyForm.value.targetPosition;

  if ((!dept || dept === '') && (!pos || pos.trim() === '')) {
    alert("Please select at least one department or position.");
    return;
  }

  const raw = this.surveyForm.getRawValue();
  let payload = this.normalizePayload({ ...raw, draft: true });

  // ---- Draft: allow empty but still require at least placeholder question ----
  if (!payload.questions.length) {
    payload.questions = [
      { text: 'Draft Placeholder', type: 'text', required: false, options: [] }
    ];
  }

  if (this.isEditMode && this.currentSurveyId) {
    this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
      next: () => {
        alert("Draft updated successfully!");
        this.router.navigate(['/app/surveys']);
      }
    });
    return;
  }

  this.surveyService.createSurvey(payload).subscribe({
    next: () => {
      alert("Survey saved as draft!");
      this.router.navigate(['/app/surveys']);
    }
  });
}

}


