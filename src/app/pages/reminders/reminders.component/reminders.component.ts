// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { ReminderService } from '../../../services/reminder.service';
// // import { SurveyService } from '../../../services/survey.service';
// // import { EmployeeService } from '../../../services/employee/employee';

// // @Component({
// //   selector: 'app-reminders',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule],
// //   templateUrl: './reminders.component.html',
// //   styleUrls: ['./reminders.component.css']
// // })
// // export class RemindersComponent implements OnInit {

// //   departments: any[] = [];
// //   surveys: any[] = [];
// //   reminders: any[] = [];

// //   form = {
// //     departmentName: '',
// //     surveyName: '',
// //     scheduledAt: '',
// //     intervalInDays: '',
// //     message: ''
// //   };

// //   nextScheduledDate: string = '';
// //   loading: boolean = false;
// //   sendingNow: boolean = false;

// //   constructor(
// //     private reminderService: ReminderService,
// //     private surveyService: SurveyService,
// //     private employeeService: EmployeeService
// //   ) {}

// //   ngOnInit(): void {
// //     this.loadDepartments();
// //     this.loadSurveys();
// //     this.loadReminders();
// //   }

// //   // Load departments
// //   loadDepartments() {
// //     this.employeeService.getDepartments().subscribe({
// //       next: res => this.departments = res,
// //       error: err => console.log(err)
// //     });
// //   }

// //   // Load surveys
// //   loadSurveys() {
// //     this.surveyService.getAllSurveys().subscribe({
// //       next: res => this.surveys = res,
// //       error: err => console.log(err)
// //     });
// //   }

// //   // Load reminders
// //   loadReminders() {
// //     this.reminderService.listReminders().subscribe({
// //       next: res => this.reminders = res,
// //       error: err => console.log(err)
// //     });
// //   }

// //   // Calculate next scheduled date
// //   updateNextDate() {
// //     if (!this.form.scheduledAt || !this.form.intervalInDays) {
// //       this.nextScheduledDate = '';
// //       return;
// //     }

// //     const date = new Date(this.form.scheduledAt);
// //     date.setDate(date.getDate() + Number(this.form.intervalInDays));

// //     this.nextScheduledDate = date.toISOString().slice(0, 16);
// //   }

// //   // Schedule reminder
// //   scheduleReminder() {
// //     this.loading = true;

// //     const payload = {
// //       surveyName: this.form.surveyName,
// //       departmentName: this.form.departmentName === 'ALL' ? null : this.form.departmentName,
// //       scheduledAt: this.form.scheduledAt,
// //       intervalInDays: this.form.intervalInDays ? Number(this.form.intervalInDays) : null,
// //       message: this.form.message
// //     };

// //     this.reminderService.createReminder(payload).subscribe({
// //       next: () => {
// //         this.loading = false;
// //         this.loadReminders();
// //       },
// //       error: () => this.loading = false
// //     });
// //   }

// //   // Send reminder instantly
// //   sendNow(id: number) {
// //     this.sendingNow = true;

// //     this.reminderService.sendNow(id).subscribe({
// //       next: () => {
// //         this.sendingNow = false;
// //         this.loadReminders();
// //       },
// //       error: () => this.sendingNow = false
// //     });
// //   }

// //   deleteReminder(id: number) {
// //     this.reminderService.deleteReminder(id).subscribe({
// //       next: () => this.loadReminders(),
// //       error: err => console.log(err)
// //     });
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ReminderService } from '../../../services/reminder.service';
// import { SurveyService } from '../../../services/survey.service';
// import { EmployeeService } from '../../../services/employee/employee';
// import { ReminderRequest, ReminderResponse } from '../../../models/reminders.model';

// @Component({
//   selector: 'app-reminders',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './reminders.component.html',
//   styleUrls: ['./reminders.component.css']
// })
// export class RemindersComponent implements OnInit {

//   form: ReminderRequest = {
//     surveyName: '',
//     departmentName: '',
//     scheduledAt: '',
//     intervalInDays: '',
//     message: ''
//   };

//   surveys: any[] = [];
//   departments: any[] = [];
//   reminders: ReminderResponse[] = [];

//   nextScheduledDate: string = '';
//   loading: boolean = false;
//   sendingNow: boolean = false;

//   constructor(
//     private reminderService: ReminderService,
//     private surveyService: SurveyService,
//     private employeeService: EmployeeService
//   ) {}

//   ngOnInit(): void {
//     this.loadSurveys();
//     this.loadDepartments();
//     this.loadReminders();
//   }

//   loadSurveys() {
//     this.surveyService.getAllSurveys().subscribe({
//       next: d => this.surveys = d,
//       error: e => console.error(e)
//     });
//   }

//   loadDepartments() {
//     this.employeeService.getDepartments().subscribe({
//       next: d => this.departments = d,
//       error: e => console.error(e)
//     });
//   }

//   loadReminders() {
//     this.reminderService.listReminders().subscribe({
//       next: d => this.reminders = d,
//       error: e => console.error(e)
//     });
//   }

//   updateNextDate() {
//     if (!this.form.scheduledAt || !this.form.intervalInDays) {
//       this.nextScheduledDate = '';
//       return;
//     }
//     const s = new Date(this.form.scheduledAt);
//     s.setDate(s.getDate() + Number(this.form.intervalInDays));
//     this.nextScheduledDate = s.toISOString().slice(0, 16);
//   }

//   // Restrict department
//   validateDepartmentRestriction(): boolean {
//     const selectedSurvey = this.surveys.find(s => s.title === this.form.surveyName);
//     if (!selectedSurvey) return true;

//     if (selectedSurvey.targetDepartment && selectedSurvey.targetDepartment.name) {
//       const deptName = selectedSurvey.targetDepartment.name;

//       if (this.form.departmentName !== deptName) {
//         alert("This survey belongs to department: " + deptName +
//               "\nYou cannot send reminder to another department.");
//         return false;
//       }
//     }
//     return true;
//   }

//   // SCHEDULE REMINDER
//   scheduleReminder() {
//     if (!this.validateDepartmentRestriction()) return;

//     this.loading = true;

//     this.reminderService.createReminder(this.form).subscribe({
//       next: () => {
//         this.loading = false;
//         this.resetForm();
//         this.loadReminders();
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }

//   resetForm() {
//     this.form = {
//       surveyName: '',
//       departmentName: '',
//       scheduledAt: '',
//       intervalInDays: '',
//       message: ''
//     };
//     this.nextScheduledDate = '';
//   }

//   // SEND IMMEDIATELY
//   sendNow(id: number) {
//     this.sendingNow = true;

//     this.reminderService.sendReminderNow(id).subscribe({
//       next: () => {
//         this.sendingNow = false;
//         this.loadReminders();
//       },
//       error: () => {
//         this.sendingNow = false;
//       }
//     });
//   }

//   // MANUAL GLOBAL SCHEDULER
//   runScheduler() {
//     this.loading = true;

//     this.reminderService.runSchedulerNow().subscribe({
//       next: () => {
//         this.loading = false;
//         this.loadReminders();
//       },
//       error: () => this.loading = false
//     });
//   }

//   deleteReminder(id: number) {
//     this.reminderService.deleteReminder(id).subscribe({
//       next: () => this.loadReminders(),
//       error: e => console.error(e)
//     });
//   }

// }
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
  loading: boolean = false;
  sendingNow: boolean = false;

  popupMessage: string = '';
  showPopup: boolean = false;

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

  showPopupMsg(msg: string) {
    this.popupMessage = msg;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 2500);
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

  // Restriction: cannot send to other dept
  validateDepartmentRestriction(): boolean {
    const selectedSurvey = this.surveys.find(s => s.title === this.form.surveyName);
    if (!selectedSurvey) return true;

    if (selectedSurvey.targetDepartment && selectedSurvey.targetDepartment.name) {
      const assignedDept = selectedSurvey.targetDepartment.name;

      if (this.form.departmentName !== assignedDept) {
        this.showPopupMsg(
          `This survey belongs to department: ${assignedDept}. 
           You cannot send a reminder to another department.`
        );
        return false;
      }
    }

    return true;
  }

  // SCHEDULE REMINDER
  scheduleReminder() {
    if (!this.validateDepartmentRestriction()) return;

    this.loading = true;

    this.reminderService.createReminder(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.showPopupMsg("Reminder Scheduled Successfully");
        this.resetForm();
        this.loadReminders();
      },
      error: () => {
        this.loading = false;
        this.showPopupMsg("Failed to schedule reminder");
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

  // SEND IMMEDIATELY
  sendNow(id: number) {
    this.sendingNow = true;

    this.reminderService.sendReminderNow(id).subscribe({
      next: () => {
        this.sendingNow = false;
        this.showPopupMsg("Reminder sent successfully");
        this.loadReminders();
      },
      error: () => {
        this.sendingNow = false;
        this.showPopupMsg("Sending failed");
      }
    });
  }

  // RUN SCHEDULER NOW
  // runScheduler() {
  //   this.loading = true;

  //   this.reminderService.runSchedulerNow().subscribe({
  //     next: () => {
  //       this.loading = false;
  //       this.showPopupMsg("Scheduler executed");
  //       this.loadReminders();
  //     },
  //     error: () => {
  //       this.loading = false;
  //       this.showPopupMsg("Scheduler failed");
  //     }
  //   });
  // }

  

  deleteReminder(id: number) {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        this.showPopupMsg("Reminder deleted");
        this.loadReminders();
      },
      error: () => {
        this.showPopupMsg("Delete failed");
      }
    });
  }

}
