export interface ReminderRequest {
  surveyName: string;
  departmentName: string;
  scheduledAt: string;
  intervalInDays: string;
  message: string;
}

export interface ReminderResponse {
  id: number;
  surveyTitle: string;
  departmentName: string;
  intervalInDays: number;
  nextScheduledAt: string;
  status: string;
}
