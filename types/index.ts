export interface NavLink {
  label: string;
  href: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Academic' | 'Sports' | 'Events' | 'Admin' | 'Urgent';
  excerpt: string;
  urgent: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  color: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  initials: string;
  rating: number;
}

export interface StatCard {
  label: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  gradient: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  color: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  grade: string;
  color: string;
  progress: number;
}

export interface AttendanceRecord {
  month: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  content: string;
}

export interface StudentResult {
  subject: string;
  mark: number;
  grade: string;
  color: string;
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  subject: string;
  students: number;
  schedule: string;
  color: string;
}

export interface TeacherStudent {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  average: number;
  status: 'excellent' | 'good' | 'needs-attention';
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  idNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation: string;
  previousSchool: string;
  previousGrade: string;
  previousYear: string;
  applyingGrade: string;
  academicYear: string;
  documents: string[];
}
