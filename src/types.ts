export interface Note {
  id: string;
  studentName: string;
  uploaderEmail: string;
  title: string;
  subject: string;
  subjectCode: string;
  semester: number;
  department: string;
  category: 'notes' | 'pyq' | 'syllabus' | 'lab_manual';
  examYear?: string;
  university: string;
  description: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  downloadsCount: number;
  viewsCount: number;
  rating: number;
  ratingCount: number;
  uploadedAt: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  collegeName: string;
  rollNumber?: string;
  joinedAt?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  rating: number;
  message: string;
  submittedAt: string;
}

export interface PlatformStats {
  totalNotes: number;
  totalDownloads: number;
  totalViews: number;
  totalPYQs: number;
  totalStudents: number;
  departmentsCount: number;
}

export interface PhpSourceFile {
  filename: string;
  label: string;
  content: string;
}

export type ViewTab = 'home' | 'notes' | 'pyq' | 'dashboard' | 'contact' | 'php-source';

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Applied Sciences & Humanities'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'notes', label: 'Lecture & Handwritten Notes' },
  { id: 'pyq', label: 'Previous Year Questions (PYQs)' },
  { id: 'syllabus', label: 'Syllabus & Blueprint' },
  { id: 'lab_manual', label: 'Lab Manuals & Practical' }
];
