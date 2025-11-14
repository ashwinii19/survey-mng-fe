export interface Survey {
  id: number;
  title: string;
  description?: string;
  formLink?: string;
  publishedAt?: string;
  targetDepartment?: { id: number; name: string } | null;
}
