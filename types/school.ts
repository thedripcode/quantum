// ─── School-wide TypeScript interfaces ────────────────────────────────────────
// Covers the full Sidelile HS structure: Grade 8–12, all classes, all subjects.
// Separate from types/teacher.ts (teacher-specific assessment data).

export type GradeLevel   = 8 | 9 | 10 | 11 | 12;
export type ClassSection = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J';
export type RiskLevel    = 'critical' | 'high' | 'moderate' | 'on-track' | 'excelling';

// ─── Grade ───────────────────────────────────────────────────────────────────

export interface GradeData {
  level:   GradeLevel;
  classes: ClassData[];
}

// ─── Class ───────────────────────────────────────────────────────────────────

export interface ClassData {
  id:               string;        // e.g. "10B"
  grade:            GradeLevel;
  section:          ClassSection;
  subjectIds:       string[];      // ordered list of subject IDs for this class
  studentIds:       string[];      // ordered list of student IDs
  assignedTeacherId: string;       // teacher responsible for this context
  room:             string;        // e.g. "B12"
  studentCount:     number;
}

// ─── Subject ─────────────────────────────────────────────────────────────────

export interface SubjectDef {
  id:          string;
  code:        string;
  name:        string;
  shortName:   string;
  isCompulsory: boolean;
  gradeRange:  GradeLevel[];
  passMark:    number;
}

// ─── Student (full — used in school browser and Add Student form) ─────────────

export interface StudentFull {
  id:               string;
  studentNumber:    string;         // STU-10B-001
  firstName:        string;
  lastName:         string;
  fullName:         string;         // "lastName, firstName"
  grade:            GradeLevel;
  classId:          string;         // "10B"
  classSection:     ClassSection;
  dateOfBirth:      string;         // YYYY-MM-DD
  gender:           'male' | 'female';
  homeLanguage:     string;
  parentName:       string;
  parentContact:    string;
  parentEmail:      string;
  address:          string;
  emergencyContact: string;
  emergencyNumber:  string;
  photoUrl?:        string;
  riskLevel:        RiskLevel;
  averageMark:      number;         // 0–100 aggregate
  attendanceRate:   number;         // 0–100 %
  enrolledDate:     string;
  isActive:         boolean;
}

// ─── Teacher (school-level — lighter than types/teacher.ts Teacher) ────────────

export interface TeacherSummary {
  id:               string;
  title:            string;
  firstName:        string;
  lastName:         string;
  subject:          string;
  assignedClassIds: string[];
  employeeNumber:   string;
  avatarInitials:   string;
}

// ─── Add Student form data ────────────────────────────────────────────────────

export interface AddStudentFormData {
  firstName:        string;
  lastName:         string;
  grade:            string;          // will be parsed to GradeLevel
  classSection:     string;          // "A"–"J"
  dateOfBirth:      string;
  gender:           string;
  homeLanguage:     string;
  parentName:       string;
  parentContact:    string;
  parentEmail:      string;
  address:          string;
  emergencyContact: string;
  emergencyNumber:  string;
}
