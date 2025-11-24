import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReminderService } from '../../../services/reminder.service';
import { SurveyService } from '../../../services/survey.service';
import { EmployeeService } from '../../../services/employee/employee';
import { ReminderRequest, ReminderResponse } from '../../../models/reminders.model';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  form: ReminderRequest = {
    surveyName: '',
    departmentName: '',
    scheduledAt: '',
    intervalInDays: '',
    message: ''
  };

  surveys: any[] = [];
  departments: any[] = [];
  reminders: ReminderResponse[] = [];

  nextScheduledDate: string = '';
  loading = false;
  sendingNow = false;

  constructor(
    private reminderService: ReminderService,
    private surveyService: SurveyService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
    this.loadDepartments();
    this.loadReminders();
  }

  loadSurveys() {
    this.surveyService.getAllSurveys().subscribe({
      next: d => this.surveys = d,
      error: e => console.error(e)
    });
  }

  loadDepartments() {
    this.employeeService.getDepartments().subscribe({
      next: d => this.departments = d,
      error: e => console.error(e)
    });
  }

  loadReminders() {
    this.reminderService.listReminders().subscribe({
      next: d => this.reminders = d,
      error: e => console.error(e)
    });
  }

  updateNextDate() {
    if (!this.form.scheduledAt || !this.form.intervalInDays) {
      this.nextScheduledDate = '';
      return;
    }
    const s = new Date(this.form.scheduledAt);
    s.setDate(s.getDate() + Number(this.form.intervalInDays));
    this.nextScheduledDate = s.toISOString().slice(0, 16);
  }


  // --------------------------------------------------------------
  // ⭐ NEW VALIDATION - SAME LOGIC AS DASHBOARD FILTER
  // --------------------------------------------------------------
  validateSurveyDepartmentAssignment(): boolean {

    const selectedSurvey = this.surveys.find(s => s.title === this.form.surveyName);
    if (!selectedSurvey) return true;

    // Backend stores this as: "ALL" or "HR" or "HR,IT"
    const assignedStr: string = selectedSurvey.targetDepartmentName ?? "ALL";

    // Convert to lowercase list
    const assignedList: string[] =
      assignedStr.split(',').map((x: string) => x.trim().toLowerCase());

    const selectedDept = this.form.departmentName?.toLowerCase();

    // CASE 1: Survey assigned to ALL
    if (assignedList.includes("all")) return true;

    // CASE 2: No department selected
    if (!selectedDept) {
      alert("Please select a department");
      return false;
    }

    // CASE 3: Department not allowed
    if (!assignedList.includes(selectedDept)) {
      alert(
        `Survey is assigned ONLY to: ${assignedList.join(", ").toUpperCase()}
You cannot send a reminder to: ${this.form.departmentName}.`
      );
      return false;
    }

    return true;
  }


  // --------------------------------------------------------------
  // SCHEDULE REMINDER
  // --------------------------------------------------------------
  scheduleReminder() {

    // Apply validation
    if (!this.validateSurveyDepartmentAssignment()) return;

    this.loading = true;

    this.reminderService.createReminder(this.form).subscribe({
      next: () => {
        this.loading = false;
        alert("Reminder Scheduled Successfully!");
        this.resetForm();
        this.loadReminders();
      },
      error: () => {
        this.loading = false;
        alert("Failed to schedule reminder.");
      }
    });
  }


  resetForm() {
    this.form = {
      surveyName: '',
      departmentName: '',
      scheduledAt: '',
      intervalInDays: '',
      message: ''
    };
    this.nextScheduledDate = '';
  }


  // --------------------------------------------------------------
  // SEND NOW
  // --------------------------------------------------------------
  sendNow(id: number) {
    this.sendingNow = true;

    this.reminderService.sendReminderNow(id).subscribe({
      next: () => {
        this.sendingNow = false;
        alert("Reminder sent successfully!");
        this.loadReminders();
      },
      error: () => {
        this.sendingNow = false;
        alert("Failed to send reminder.");
      }
    });
  }

  // --------------------------------------------------------------
  // DELETE
  // --------------------------------------------------------------
  deleteReminder(id: number) {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        alert("Reminder deleted!");
        this.loadReminders();
      },
      error: () => alert("Delete failed.")
    });
  }

}
