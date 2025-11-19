import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray, FormBuilder, FormGroup,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SurveyService } from '../../services/survey.service';
import { EmployeeService } from '../../services/employee/employee';
import { Department } from '../../models/employee';

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
      targetDepartmentName: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

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

  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: d => this.departments = d,
      error: err => console.error('Failed to load departments', err)
    });
  }

  loadSurveyForEdit(id: number) {
    this.surveyService.getSurvey(id).subscribe({
      next: (s: any) => {
        this.currentSurveyEditable = !!s.editable;

        this.surveyForm.patchValue({
          title: s.title,
          description: s.description,
          targetDepartmentName: s.targetDepartment?.name || ''
        });

        this.questions.clear();

        (s.questions || []).forEach((q: any) => {
          const type = (q.questionType || q.type || '').toLowerCase();

          const formQ = this.fb.group({
            text: [q.text, Validators.required],
            type: [type, Validators.required],
            required: [!!q.required],
            options: this.fb.array([])
          });

          if (['radio', 'checkbox', 'dropdown'].includes(type)) {
            const optionsArray: string[] =
              typeof q.options === 'string'
                ? q.options.split(',').map((o: string) => o.trim())
                : Array.isArray(q.options)
                ? q.options : [];

            optionsArray.forEach((opt: string) => {
              (formQ.get('options') as FormArray)
                .push(this.fb.control(opt, Validators.required));
            });
          }

          this.questions.push(formQ);
        });

        this.setFormEditable(this.currentSurveyEditable);
      },
      error: err => console.error('Failed loading survey:', err)
    });
  }

  setFormEditable(editable: boolean) {
    if (editable) this.surveyForm.enable();
    else this.surveyForm.disable();
  }

  normalizePayload(payload: any) {
    payload.questions = (payload.questions || []).map((q: any) => ({
      text: q.text,
      type: q.type.toLowerCase(),
      required: !!q.required,
      options: q.options || []
    }));

    // If ALL selected → send null
    if (payload.targetDepartmentName === "ALL") {
      payload.targetDepartmentName = null;
    }

    return payload;
  }

  saveAsDraft() {
    const raw = this.surveyForm.getRawValue();

    let payload = this.normalizePayload({
      ...raw,
      draft: true
    });

    if (!payload.questions.length) {
      payload.questions = [
        { text: 'Draft Placeholder', type: 'text', required: false, options: [] }
      ];
    }

    if (this.isEditMode && this.currentSurveyId) {
      this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
        next: () => {
          this.router.navigate(['/app/surveys']);
        }
      });
      return;
    }

    this.surveyService.createSurvey(payload).subscribe({
      next: () => {
        this.router.navigate(['/app/surveys']);
      }
    });
  }

  createSurveyFinal() {
    if (this.surveyForm.invalid) {
      return;
    }

    let payload = this.normalizePayload({
      ...this.surveyForm.value,
      draft: false
    });

    if (this.isEditMode && this.currentSurveyId) {
      this.surveyService.updateSurvey(this.currentSurveyId, payload).subscribe({
        next: () => {
          this.router.navigate(['/app/surveys']);
        }
      });
      return;
    }

    this.surveyService.createSurvey(payload).subscribe({
      next: () => {
        this.router.navigate(['/app/surveys']);
      }
    });
  }
}





