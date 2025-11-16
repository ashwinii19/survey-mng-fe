// export interface Survey {
//   id: number;
//   title: string;
//   description?: string;
//   formLink?: string;
//   publishedAt?: string;
//   targetDepartment?: { id: number; name: string } | null;
// }
export interface SurveyRequest {
  title: string;
  description: string;
  targetDepartmentName: string | null;
  questions: QuestionRequest[];
}

export interface QuestionRequest {
  text: string;
  type: string;
  required: boolean;
  options: string[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  formLink: string;
}
