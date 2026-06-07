// ─── Backend-ready Teacher Portal TypeScript Interfaces ───────────────────────
// Designed for MongoDB/Firebase compatibility: _id optional, ISO date strings,
// no circular references between top-level entities.

export type SubjectCode =
  | 'MATH' | 'PHY_SCI' | 'LIFE_SCI' | 'ENG_HL' | 'AFR_FAL'
  | 'ZUL_HL' | 'LIFE_ORI' | 'HIST' | 'GEO' | 'ACC' | 'BUS_STU' | 'ECON';

export type GradeLevel = 8 | 9 | 10 | 11 | 12;

export type ClassCode = string; // e.g. "10B", "11A", "12D"

export type AssessmentType = 'test' | 'assignment' | 'project' | 'exam' | 'practical' | 'quiz';

export type TermNumber = 1 | 2 | 3 | 4;

export type RiskLevel = 'low' | 'medium' | 'moderate' | 'high' | 'critical' | 'on-track' | 'excelling';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

// ─── Teacher ──────────────────────────────────────────────────────────────────

export interface Teacher {
  _id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  title: string;                  // Mr. / Ms. / Mrs. / Dr.
  email: string;
  phone: string;
  subjects: SubjectCode[];        // subjects the teacher is qualified for
  classIds: string[];             // references to SchoolClass._id
  role: 'teacher' | 'hod' | 'deputy' | 'principal';
  department: string;
  avatarInitials: string;
  joinedDate: string;             // ISO date string
  isActive: boolean;
}

// ─── Student ─────────────────────────────────────────────────────────────────

export interface Student {
  _id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;               // computed: lastName + ', ' + firstName
  grade: GradeLevel;
  classCode: ClassCode;           // e.g. "10B"
  classId: string;                // reference to SchoolClass._id
  gender: 'male' | 'female';
  dateOfBirth: string;            // ISO date string
  parentEmail: string;
  parentPhone: string;
  avatarInitials: string;
  enrolledDate: string;           // ISO date string
  isActive: boolean;
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface Subject {
  _id: string;
  code: SubjectCode;
  name: string;
  shortName: string;
  passMark: number;               // typically 30 or 40 depending on subject
  creditWeight: number;           // for APS calculation
  isElective: boolean;
}

// ─── School Class ─────────────────────────────────────────────────────────────

export interface SchoolClass {
  _id: string;
  grade: GradeLevel;
  section: string;                // "A", "B", "C", "D"
  code: ClassCode;                // e.g. "10B"
  teacherId: string;              // homeroom teacher reference
  studentIds: string[];           // references to Student._id
  subjectCode: SubjectCode;       // the subject taught in this class context
  year: number;
  term: TermNumber;
  room: string;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4;  // Mon=0 … Fri=4
  startTime: string;              // "08:00"
  endTime: string;                // "08:45"
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export interface Assessment {
  _id: string;
  classId: string;
  teacherId: string;
  subjectCode: SubjectCode;
  title: string;                  // e.g. "Test 1", "Assignment 2"
  type: AssessmentType;
  term: TermNumber;
  totalMarks: number;             // marks out of this value
  weight: number;                 // percentage weight towards term mark (e.g. 20 for 20%)
  dueDate: string;                // ISO date string
  conductedDate: string | null;   // ISO date string when administered
  isPublished: boolean;           // visible to students
  createdAt: string;
}

// ─── Mark ─────────────────────────────────────────────────────────────────────

export interface Mark {
  _id: string;
  assessmentId: string;
  studentId: string;
  classId: string;
  teacherId: string;
  rawMark: number | null;         // null = not yet entered
  percentage: number | null;      // rawMark / totalMarks * 100, null if no mark
  isAbsent: boolean;
  comment: string;
  capturedAt: string | null;      // ISO timestamp when mark was first entered
  updatedAt: string | null;       // ISO timestamp of last update
}

// ─── Attendance Record ────────────────────────────────────────────────────────

export interface AttendanceRecord {
  _id: string;
  classId: string;
  teacherId: string;
  studentId: string;
  date: string;                   // ISO date string "YYYY-MM-DD"
  status: AttendanceStatus;
  note: string;
  capturedAt: string;
}

// ─── Teacher Notification ─────────────────────────────────────────────────────

export interface TeacherNotification {
  _id: string;
  teacherId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  isRead: boolean;
  createdAt: string;
  link?: string;                  // optional deep-link into the portal
}

// ─── Teacher Note (on a student) ─────────────────────────────────────────────

export interface TeacherNote {
  _id: string;
  teacherId: string;
  studentId: string;
  note: string;
  isPrivate: boolean;             // false = visible to other teachers
  createdAt: string;
  updatedAt: string;
}

// ─── Derived / View Models (not stored in DB) ─────────────────────────────────

export interface StudentMarkSummary {
  student: Student;
  marks: Mark[];
  termAverage: number | null;
  riskLevel: RiskLevel;
  attendanceRate: number;         // 0-100
}

export interface ClassSummary {
  schoolClass: SchoolClass;
  studentCount: number;
  classAverage: number | null;
  passRate: number | null;        // percentage of students >= passMark
  pendingMarks: number;           // count of null marks
  highRiskCount: number;
}

export interface GradebookRow {
  student: Student;
  marks: { [assessmentId: string]: Mark };
  weightedAverage: number | null;
  rank?: number;
}
