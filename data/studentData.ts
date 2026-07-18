// ─── Sidelile High School — Student Portal Mock Data ─────────────────────────
// Student: Thabo Nkosi · Grade 11 · Class 11A · ID: STU-11A-007

export interface StudentProfile {
  id: string; firstName: string; lastName: string; grade: number;
  className: string; avatarInitials: string; dob: string; gender: string;
  phone: string; email: string; address: string; homeLanguage: string;
  religion: string; photo: null;
  parent: { name: string; relation: string; phone: string; email: string; workPhone: string; };
  emergency: { name: string; relation: string; phone: string; };
  medicalInfo: { conditions: string; allergies: string; doctor: string; doctorPhone: string; };
  enrolledDate: string; house: string;
}

export interface SubjectMark {
  task: string; type: 'Test' | 'Assignment' | 'Practical' | 'Project' | 'Essay' | 'Oral' | 'Exam';
  mark: number; total: number; date: string; term: number; weight: number;
}

export interface Subject {
  id: string; name: string; short: string; teacher: string;
  teacherEmail: string; teacherInitials: string; room: string; color: string;
  currentMark: number; targetMark: number; isAtRisk: boolean;
  termAverages: { term: number; average: number }[];
  marks: SubjectMark[];
  classAverage: number; highestInClass: number; lowestInClass: number;
  attendance: number;
  nextAssessment: { task: string; date: string; weight: number } | null;
}

export interface Assignment {
  id: string; subjectId: string; subject: string; subjectColor: string;
  title: string; description: string; type: string;
  dueDate: string; submittedDate: string | null;
  status: 'submitted' | 'pending' | 'overdue' | 'graded';
  mark: number | null; total: number; feedback: string | null;
  priority: 'high' | 'medium' | 'low';
}

export interface TimetablePeriod {
  day: string; period: number; time: string; endTime: string;
  subject: string; subjectId: string; teacher: string;
  room: string; color: string; type: 'Lesson' | 'Break' | 'Free';
}

export interface AttendanceRecord {
  date: string; status: 'present' | 'absent' | 'late' | 'excused';
  note: string;
}

export interface SubjectAttendance {
  subjectId: string; subject: string; color: string;
  attended: number; total: number; percentage: number;
}

export interface Notice {
  id: string; category: 'Academic' | 'Sport' | 'Event' | 'Admin' | 'Urgent';
  title: string; body: string; date: string; author: string; pinned: boolean;
}

export interface Message {
  id: string; from: string; fromRole: 'teacher' | 'admin' | 'parent';
  fromInitials: string; fromColor: string; subject: string;
  preview: string; body: string; date: string; read: boolean;
  thread: { from: string; body: string; date: string; isStudent: boolean }[];
}

export interface Achievement {
  id: string; title: string; description: string; icon: string;
  category: 'Academic' | 'Attendance' | 'Sport' | 'Leadership' | 'Community';
  earned: boolean; earnedDate: string | null; points: number; rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Goal {
  id: string; subjectId: string; subject: string; color: string;
  targetMark: number; currentMark: number; examWeight: number;
  termWeight: number; createdDate: string;
}

// ─── STUDENT PROFILE ─────────────────────────────────────────────────────────

export const STUDENT: StudentProfile = {
  id: 'STU-11A-007',
  firstName: 'Thabo',
  lastName: 'Nkosi',
  grade: 11,
  className: '11A',
  avatarInitials: 'TN',
  dob: '2007-03-14',
  gender: 'Male',
  phone: '083 456 7890',
  email: 'thabo.nkosi@students.sidelile.edu.za',
  address: '24 Umgeni Road, Durban, KwaZulu-Natal, 4001',
  homeLanguage: 'IsiZulu',
  religion: 'Christian',
  photo: null,
  parent: {
    name: 'Mrs. Zanele Nkosi',
    relation: 'Mother',
    phone: '071 234 5678',
    email: 'zanele.nkosi@gmail.com',
    workPhone: '031 789 0123',
  },
  emergency: {
    name: 'Mr. Sibusiso Nkosi',
    relation: 'Father',
    phone: '082 345 6789',
  },
  medicalInfo: {
    conditions: 'None',
    allergies: 'Peanuts',
    doctor: 'Dr. Patel',
    doctorPhone: '031 555 0199',
  },
  enrolledDate: '2021-01-18',
  house: 'Shaka',
};

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    short: 'MATH',
    teacher: 'Mr. Dlamini',
    teacherEmail: 'dlamini@sidelile.edu.za',
    teacherInitials: 'JD',
    room: 'A-101',
    color: '#3B82F6',
    currentMark: 78,
    targetMark: 85,
    isAtRisk: false,
    classAverage: 72,
    highestInClass: 94,
    lowestInClass: 31,
    attendance: 96,
    termAverages: [{ term: 1, average: 72 }, { term: 2, average: 75 }, { term: 3, average: 78 }],
    marks: [
      { task: 'Test 1', type: 'Test', mark: 62, total: 100, date: '2024-07-15', term: 3, weight: 20 },
      { task: 'Assignment 1', type: 'Assignment', mark: 18, total: 20, date: '2024-07-22', term: 3, weight: 10 },
      { task: 'Test 2', type: 'Test', mark: 71, total: 100, date: '2024-08-12', term: 3, weight: 20 },
      { task: 'Assignment 2', type: 'Assignment', mark: 17, total: 20, date: '2024-08-19', term: 3, weight: 10 },
      { task: 'Test 3', type: 'Test', mark: 80, total: 100, date: '2024-09-09', term: 3, weight: 20 },
      { task: 'Term Exam', type: 'Exam', mark: 82, total: 100, date: '2024-09-23', term: 3, weight: 40 },
    ],
    nextAssessment: { task: 'Test 4', date: '2024-10-14', weight: 20 },
  },
  {
    id: 'physics',
    name: 'Physical Sciences',
    short: 'SCI',
    teacher: 'Ms. van der Merwe',
    teacherEmail: 'vandermerwe@sidelile.edu.za',
    teacherInitials: 'VM',
    room: 'C-205',
    color: '#EF4444',
    currentMark: 51,
    targetMark: 60,
    isAtRisk: true,
    classAverage: 61,
    highestInClass: 89,
    lowestInClass: 28,
    attendance: 91,
    termAverages: [{ term: 1, average: 48 }, { term: 2, average: 50 }, { term: 3, average: 51 }],
    marks: [
      { task: 'Test 1', type: 'Test', mark: 44, total: 100, date: '2024-07-18', term: 3, weight: 20 },
      { task: 'Practical 1', type: 'Practical', mark: 14, total: 20, date: '2024-07-25', term: 3, weight: 10 },
      { task: 'Test 2', type: 'Test', mark: 48, total: 100, date: '2024-08-15', term: 3, weight: 20 },
      { task: 'Practical 2', type: 'Practical', mark: 12, total: 20, date: '2024-08-22', term: 3, weight: 10 },
      { task: 'Test 3', type: 'Test', mark: 55, total: 100, date: '2024-09-12', term: 3, weight: 20 },
    ],
    nextAssessment: { task: 'Term Exam', date: '2024-09-25', weight: 40 },
  },
  {
    id: 'english',
    name: 'English Home Language',
    short: 'ENG',
    teacher: 'Mrs. Khumalo',
    teacherEmail: 'khumalo@sidelile.edu.za',
    teacherInitials: 'SK',
    room: 'B-302',
    color: '#8B5CF6',
    currentMark: 82,
    targetMark: 85,
    isAtRisk: false,
    classAverage: 74,
    highestInClass: 91,
    lowestInClass: 48,
    attendance: 100,
    termAverages: [{ term: 1, average: 78 }, { term: 2, average: 80 }, { term: 3, average: 82 }],
    marks: [
      { task: 'Essay 1', type: 'Essay', mark: 36, total: 50, date: '2024-07-20', term: 3, weight: 20 },
      { task: 'Comprehension', type: 'Test', mark: 28, total: 30, date: '2024-08-05', term: 3, weight: 15 },
      { task: 'Oral Presentation', type: 'Oral', mark: 18, total: 20, date: '2024-08-19', term: 3, weight: 15 },
      { task: 'Essay 2', type: 'Essay', mark: 40, total: 50, date: '2024-09-08', term: 3, weight: 20 },
    ],
    nextAssessment: { task: 'Term Exam', date: '2024-09-26', weight: 30 },
  },
  {
    id: 'isizulu',
    name: 'IsiZulu First Additional',
    short: 'ZUL',
    teacher: 'Mr. Mthembu',
    teacherEmail: 'mthembu@sidelile.edu.za',
    teacherInitials: 'NM',
    room: 'B-104',
    color: '#F59E0B',
    currentMark: 85,
    targetMark: 85,
    isAtRisk: false,
    classAverage: 78,
    highestInClass: 95,
    lowestInClass: 52,
    attendance: 96,
    termAverages: [{ term: 1, average: 80 }, { term: 2, average: 83 }, { term: 3, average: 85 }],
    marks: [
      { task: 'Inkomba 1', type: 'Test', mark: 42, total: 50, date: '2024-07-22', term: 3, weight: 20 },
      { task: 'Ukubhala 1', type: 'Essay', mark: 30, total: 30, date: '2024-08-08', term: 3, weight: 15 },
      { task: 'Ukuphikelela', type: 'Oral', mark: 18, total: 20, date: '2024-08-20', term: 3, weight: 15 },
      { task: 'Inkomba 2', type: 'Test', mark: 45, total: 50, date: '2024-09-10', term: 3, weight: 20 },
    ],
    nextAssessment: { task: 'Isivivinyo', date: '2024-09-27', weight: 30 },
  },
  {
    id: 'accounting',
    name: 'Accounting',
    short: 'ACC',
    teacher: 'Ms. Ngubane',
    teacherEmail: 'ngubane@sidelile.edu.za',
    teacherInitials: 'BN',
    room: 'A-204',
    color: '#10B981',
    currentMark: 74,
    targetMark: 80,
    isAtRisk: false,
    classAverage: 68,
    highestInClass: 88,
    lowestInClass: 35,
    attendance: 100,
    termAverages: [{ term: 1, average: 68 }, { term: 2, average: 71 }, { term: 3, average: 74 }],
    marks: [
      { task: 'Test 1', type: 'Test', mark: 68, total: 100, date: '2024-07-19', term: 3, weight: 20 },
      { task: 'Project', type: 'Project', mark: 38, total: 50, date: '2024-08-02', term: 3, weight: 20 },
      { task: 'Test 2', type: 'Test', mark: 72, total: 100, date: '2024-08-16', term: 3, weight: 20 },
      { task: 'Test 3', type: 'Test', mark: 75, total: 100, date: '2024-09-11', term: 3, weight: 20 },
    ],
    nextAssessment: { task: 'Term Exam', date: '2024-09-24', weight: 40 },
  },
  {
    id: 'it',
    name: 'Information Technology',
    short: 'IT',
    teacher: 'Mr. Sithole',
    teacherEmail: 'sithole@sidelile.edu.za',
    teacherInitials: 'PS',
    room: 'D-101',
    color: '#06B6D4',
    currentMark: 60,
    targetMark: 75,
    isAtRisk: true,
    classAverage: 65,
    highestInClass: 87,
    lowestInClass: 33,
    attendance: 87,
    termAverages: [{ term: 1, average: 55 }, { term: 2, average: 58 }, { term: 3, average: 60 }],
    marks: [
      { task: 'Practical 1', type: 'Practical', mark: 54, total: 100, date: '2024-07-16', term: 3, weight: 20 },
      { task: 'Theory Test 1', type: 'Test', mark: 48, total: 100, date: '2024-08-01', term: 3, weight: 20 },
      { task: 'Practical 2', type: 'Practical', mark: 62, total: 100, date: '2024-08-20', term: 3, weight: 20 },
      { task: 'Theory Test 2', type: 'Test', mark: 65, total: 100, date: '2024-09-05', term: 3, weight: 20 },
    ],
    nextAssessment: { task: 'Term Exam', date: '2024-09-28', weight: 40 },
  },
  {
    id: 'lifeo',
    name: 'Life Orientation',
    short: 'LO',
    teacher: 'Ms. Hadebe',
    teacherEmail: 'hadebe@sidelile.edu.za',
    teacherInitials: 'NH',
    room: 'E-201',
    color: '#EC4899',
    currentMark: 88,
    targetMark: 90,
    isAtRisk: false,
    classAverage: 81,
    highestInClass: 96,
    lowestInClass: 60,
    attendance: 100,
    termAverages: [{ term: 1, average: 84 }, { term: 2, average: 86 }, { term: 3, average: 88 }],
    marks: [
      { task: 'Project 1', type: 'Project', mark: 45, total: 50, date: '2024-07-28', term: 3, weight: 30 },
      { task: 'Assignment', type: 'Assignment', mark: 18, total: 20, date: '2024-08-14', term: 3, weight: 20 },
      { task: 'Project 2', type: 'Project', mark: 46, total: 50, date: '2024-09-06', term: 3, weight: 30 },
    ],
    nextAssessment: null,
  },
];

// ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-001',
    subjectId: 'math',
    subject: 'Mathematics',
    subjectColor: '#3B82F6',
    title: 'Quadratic Functions Investigation',
    description: 'Investigate the properties of quadratic functions and their graphs. Complete all questions in Exercise 3.4 and prepare a written summary of your findings.',
    type: 'Assignment',
    dueDate: '2024-10-07',
    submittedDate: null,
    status: 'pending',
    mark: null,
    total: 50,
    feedback: null,
    priority: 'high',
  },
  {
    id: 'asgn-002',
    subjectId: 'physics',
    subject: 'Physical Sciences',
    subjectColor: '#EF4444',
    title: 'Newton\'s Laws Lab Report',
    description: 'Write a formal lab report for the Newton\'s Laws practical conducted on 12 September. Include hypothesis, method, results, analysis, and conclusion.',
    type: 'Practical Report',
    dueDate: '2024-09-30',
    submittedDate: null,
    status: 'overdue',
    mark: null,
    total: 30,
    feedback: null,
    priority: 'high',
  },
  {
    id: 'asgn-003',
    subjectId: 'english',
    subject: 'English Home Language',
    subjectColor: '#8B5CF6',
    title: 'Macbeth Essay — Ambition & Power',
    description: 'Write a 600–800 word essay analyzing the theme of ambition and power in Shakespeare\'s Macbeth. Reference at least three scenes.',
    type: 'Essay',
    dueDate: '2024-10-10',
    submittedDate: null,
    status: 'pending',
    mark: null,
    total: 50,
    feedback: null,
    priority: 'medium',
  },
  {
    id: 'asgn-004',
    subjectId: 'accounting',
    subject: 'Accounting',
    subjectColor: '#10B981',
    title: 'Year-End Financial Statements',
    description: 'Complete the year-end adjustments and prepare the Income Statement and Balance Sheet for Nkosi Traders for the year ended 28 February 2024.',
    type: 'Assignment',
    dueDate: '2024-10-14',
    submittedDate: null,
    status: 'pending',
    mark: null,
    total: 80,
    feedback: null,
    priority: 'medium',
  },
  {
    id: 'asgn-005',
    subjectId: 'it',
    subject: 'Information Technology',
    subjectColor: '#06B6D4',
    title: 'Database Design Project',
    description: 'Design and implement a database for a school library system. Include entity-relationship diagram, normalized tables, and SQL queries for all CRUD operations.',
    type: 'Project',
    dueDate: '2024-10-18',
    submittedDate: null,
    status: 'pending',
    mark: null,
    total: 100,
    feedback: null,
    priority: 'high',
  },
  {
    id: 'asgn-006',
    subjectId: 'math',
    subject: 'Mathematics',
    subjectColor: '#3B82F6',
    title: 'Trigonometry Assignment 2',
    description: 'Complete all problems in the Trigonometry section of your textbook, pages 124–127.',
    type: 'Assignment',
    dueDate: '2024-09-15',
    submittedDate: '2024-09-14',
    status: 'graded',
    mark: 17,
    total: 20,
    feedback: 'Excellent work on the sine rule. Check your identities in Question 4.',
    priority: 'low',
  },
  {
    id: 'asgn-007',
    subjectId: 'isizulu',
    subject: 'IsiZulu First Additional',
    subjectColor: '#F59E0B',
    title: 'Ukubhala — Incwadi',
    description: 'Bhala incwadi emfutshane ekhuluma ngohlelo lwemfundo entsha. Amabinza angama-3 ubunani.',
    type: 'Essay',
    dueDate: '2024-09-20',
    submittedDate: '2024-09-19',
    status: 'graded',
    mark: 28,
    total: 30,
    feedback: 'Umsebenzi omuhle kakhulu. Qhubeka ukuthuthuka.',
    priority: 'low',
  },
  {
    id: 'asgn-008',
    subjectId: 'lifeo',
    subject: 'Life Orientation',
    subjectColor: '#EC4899',
    title: 'Career Research Project',
    description: 'Research your intended career path. Include educational requirements, career prospects, average salary, and a personal motivation statement.',
    type: 'Project',
    dueDate: '2024-09-25',
    submittedDate: '2024-09-24',
    status: 'submitted',
    mark: null,
    total: 50,
    feedback: null,
    priority: 'low',
  },
];

// ─── TIMETABLE ────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PERIODS: { period: number; time: string; endTime: string }[] = [
  { period: 1, time: '07:30', endTime: '08:30' },
  { period: 2, time: '08:30', endTime: '09:30' },
  { period: 3, time: '09:30', endTime: '10:00' }, // break
  { period: 4, time: '10:00', endTime: '11:00' },
  { period: 5, time: '11:00', endTime: '12:00' },
  { period: 6, time: '12:00', endTime: '12:40' }, // lunch
  { period: 7, time: '12:40', endTime: '13:40' },
  { period: 8, time: '13:40', endTime: '14:40' },
];

type SubjectEntry = { subjectId: string; subject: string; teacher: string; room: string; color: string; };

const S: Record<string, SubjectEntry> = {
  math:      { subjectId: 'math',      subject: 'Mathematics',            teacher: 'Mr. Dlamini',       room: 'A-101', color: '#3B82F6' },
  physics:   { subjectId: 'physics',   subject: 'Physical Sciences',      teacher: 'Ms. van der Merwe', room: 'C-205', color: '#EF4444' },
  english:   { subjectId: 'english',   subject: 'English Home Language',  teacher: 'Mrs. Khumalo',      room: 'B-302', color: '#8B5CF6' },
  isizulu:   { subjectId: 'isizulu',   subject: 'IsiZulu FAL',            teacher: 'Mr. Mthembu',       room: 'B-104', color: '#F59E0B' },
  accounting:{ subjectId: 'accounting',subject: 'Accounting',             teacher: 'Ms. Ngubane',       room: 'A-204', color: '#10B981' },
  it:        { subjectId: 'it',        subject: 'Information Technology', teacher: 'Mr. Sithole',       room: 'D-101', color: '#06B6D4' },
  lifeo:     { subjectId: 'lifeo',     subject: 'Life Orientation',       teacher: 'Ms. Hadebe',        room: 'E-201', color: '#EC4899' },
  break:     { subjectId: '',          subject: 'Break',                  teacher: '',                  room: '',      color: '#374151' },
  lunch:     { subjectId: '',          subject: 'Lunch Break',            teacher: '',                  room: '',      color: '#374151' },
};

// [day][period - 1]
const GRID: (keyof typeof S)[][] = [
  // Monday
  ['math', 'english', 'break', 'physics', 'accounting', 'lunch', 'it', 'lifeo'],
  // Tuesday
  ['english', 'math', 'break', 'isizulu', 'physics', 'lunch', 'accounting', 'it'],
  // Wednesday
  ['physics', 'isizulu', 'break', 'math', 'english', 'lunch', 'lifeo', 'accounting'],
  // Thursday
  ['accounting', 'it', 'break', 'english', 'math', 'lunch', 'physics', 'isizulu'],
  // Friday
  ['isizulu', 'physics', 'break', 'lifeo', 'math', 'lunch', 'english', 'it'],
];

export const TIMETABLE: TimetablePeriod[] = [];
DAYS.forEach((day, di) => {
  PERIODS.forEach((p, pi) => {
    const key = GRID[di][pi];
    const entry = S[key];
    const isBreak = key === 'break' || key === 'lunch';
    TIMETABLE.push({
      day,
      period: p.period,
      time: p.time,
      endTime: p.endTime,
      subject: entry.subject,
      subjectId: entry.subjectId,
      teacher: entry.teacher,
      room: entry.room,
      color: entry.color,
      type: isBreak ? 'Break' : 'Lesson',
    });
  });
});

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

export const SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  { subjectId: 'math',       subject: 'Mathematics',            color: '#3B82F6', attended: 22, total: 23, percentage: 96 },
  { subjectId: 'physics',    subject: 'Physical Sciences',      color: '#EF4444', attended: 21, total: 23, percentage: 91 },
  { subjectId: 'english',    subject: 'English Home Language',  color: '#8B5CF6', attended: 23, total: 23, percentage: 100 },
  { subjectId: 'isizulu',    subject: 'IsiZulu FAL',            color: '#F59E0B', attended: 22, total: 23, percentage: 96 },
  { subjectId: 'accounting', subject: 'Accounting',             color: '#10B981', attended: 23, total: 23, percentage: 100 },
  { subjectId: 'it',         subject: 'Information Technology', color: '#06B6D4', attended: 20, total: 23, percentage: 87 },
  { subjectId: 'lifeo',      subject: 'Life Orientation',       color: '#EC4899', attended: 23, total: 23, percentage: 100 },
];

// Overall this term: 154 / 161 = 95.7%
export const OVERALL_ATTENDANCE = { attended: 154, total: 161, percentage: 95.7 };

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { date: '2024-07-15', status: 'present', note: '' },
  { date: '2024-07-16', status: 'present', note: '' },
  { date: '2024-07-17', status: 'present', note: '' },
  { date: '2024-07-18', status: 'present', note: '' },
  { date: '2024-07-19', status: 'present', note: '' },
  { date: '2024-07-22', status: 'absent', note: 'Sick leave — Doctor\'s note submitted' },
  { date: '2024-07-23', status: 'present', note: '' },
  { date: '2024-07-24', status: 'present', note: '' },
  { date: '2024-07-25', status: 'present', note: '' },
  { date: '2024-07-26', status: 'present', note: '' },
  { date: '2024-07-29', status: 'present', note: '' },
  { date: '2024-07-30', status: 'present', note: '' },
  { date: '2024-07-31', status: 'present', note: '' },
  { date: '2024-08-01', status: 'present', note: '' },
  { date: '2024-08-02', status: 'present', note: '' },
  { date: '2024-08-05', status: 'present', note: '' },
  { date: '2024-08-06', status: 'late', note: 'Arrived 08:15 — Transport delay' },
  { date: '2024-08-07', status: 'present', note: '' },
  { date: '2024-08-08', status: 'present', note: '' },
  { date: '2024-08-09', status: 'present', note: '' },
  { date: '2024-08-12', status: 'present', note: '' },
  { date: '2024-08-13', status: 'present', note: '' },
  { date: '2024-08-14', status: 'present', note: '' },
  { date: '2024-08-15', status: 'absent', note: 'Family bereavement — Excused' },
  { date: '2024-08-16', status: 'excused', note: 'Sporting event — Provincial trials' },
  { date: '2024-08-19', status: 'present', note: '' },
  { date: '2024-08-20', status: 'present', note: '' },
  { date: '2024-08-21', status: 'present', note: '' },
  { date: '2024-08-22', status: 'present', note: '' },
  { date: '2024-08-23', status: 'present', note: '' },
  { date: '2024-08-26', status: 'present', note: '' },
  { date: '2024-08-27', status: 'present', note: '' },
  { date: '2024-08-28', status: 'present', note: '' },
  { date: '2024-08-29', status: 'present', note: '' },
  { date: '2024-08-30', status: 'present', note: '' },
  { date: '2024-09-02', status: 'present', note: '' },
  { date: '2024-09-03', status: 'present', note: '' },
  { date: '2024-09-04', status: 'present', note: '' },
  { date: '2024-09-05', status: 'present', note: '' },
  { date: '2024-09-06', status: 'present', note: '' },
];

// Monthly summary
export const MONTHLY_ATTENDANCE = [
  { month: 'Jul', days: 14, attended: 13, percentage: 93 },
  { month: 'Aug', days: 22, attended: 20, percentage: 91 },
  { month: 'Sep', days: 5,  attended: 5,  percentage: 100 },
];

// ─── NOTICES ─────────────────────────────────────────────────────────────────

export const NOTICES: Notice[] = [
  {
    id: 'n-001',
    category: 'Urgent',
    title: 'Grade 11 Term 3 Exams — Schedule Released',
    body: 'The Term 3 examination timetable for Grade 11 has been finalised. Exams begin on Monday 23 September and conclude on Friday 4 October. All learners are required to report to the examination hall 15 minutes before their exam. Study guides are available from the library.',
    date: '2024-09-10',
    author: 'Deputy Principal — Academics',
    pinned: true,
  },
  {
    id: 'n-002',
    category: 'Academic',
    title: 'Physical Sciences Remedial Classes — Thursday Afternoons',
    body: 'Ms. van der Merwe will be offering additional Physical Sciences support classes every Thursday from 15:00–16:30 in Room C-205. These sessions are compulsory for all learners currently below 60%. Please bring your textbook and calculator.',
    date: '2024-09-08',
    author: 'Ms. van der Merwe',
    pinned: false,
  },
  {
    id: 'n-003',
    category: 'Event',
    title: 'Sappi Innovation Day — Grade 11 Invited',
    body: 'Grade 11 learners are invited to attend the Sappi Innovation Day at the Sidelile Multi-purpose Centre on 18 September. The event showcases careers in STEM, forestry, and sustainability. Permission slips must be returned to Mrs. Sithole by 13 September.',
    date: '2024-09-06',
    author: 'Mr. Buthelezi — HOD Life Orientation',
    pinned: false,
  },
  {
    id: 'n-004',
    category: 'Admin',
    title: 'School Fee Payment Reminder — Term 3',
    body: 'Parents are kindly reminded that Term 3 school fees are due by 30 September 2024. Late payment may result in restrictions on portal access. Queries can be directed to the finance office at finance@sidelile.edu.za or 039 970 7393 ext. 5.',
    date: '2024-09-05',
    author: 'Finance Office',
    pinned: false,
  },
  {
    id: 'n-005',
    category: 'Sport',
    title: 'Netball Team Selection — Grade 10 & 11',
    body: 'Trials for the Grade 10 and 11 netball team will be held on Wednesday 18 September at 14:45 on the main sports field. Learners must bring their sports kit and a signed medical clearance form. All positions are open.',
    date: '2024-09-04',
    author: 'Ms. Khoza — Sports Coordinator',
    pinned: false,
  },
  {
    id: 'n-006',
    category: 'Academic',
    title: 'Mathematics Olympiad — Entries Open',
    body: 'Entries for the KwaZulu-Natal Mathematics Olympiad are now open. All Grade 11 learners with a Mathematics average above 70% are encouraged to participate. Entry forms are available from Mr. Dlamini or the mathematics department notice board.',
    date: '2024-09-02',
    author: 'Mr. Dlamini — Mathematics HOD',
    pinned: false,
  },
  {
    id: 'n-007',
    category: 'Event',
    title: 'Heritage Day Celebration — 24 September',
    body: 'Sidelile High School will celebrate Heritage Day on Tuesday 24 September. Learners are encouraged to dress in their cultural attire. There will be traditional food, music, and cultural displays. All are welcome to participate and showcase South Africa\'s rich cultural heritage.',
    date: '2024-08-30',
    author: 'Principal\'s Office',
    pinned: false,
  },
];

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  {
    id: 'm-001',
    from: 'Ms. van der Merwe',
    fromRole: 'teacher',
    fromInitials: 'VM',
    fromColor: '#EF4444',
    subject: 'Concern regarding your Physical Sciences marks',
    preview: 'Hi Thabo, I wanted to reach out about your recent test results...',
    body: 'Hi Thabo,\n\nI wanted to reach out about your recent Physical Sciences test results. Your Term 3 Test 2 score of 48% is concerning, and I\'d like to discuss a support plan with you.\n\nI\'ll be running extra classes on Thursdays from 15:00. Please attend — it\'s compulsory for learners below 60%.\n\nAlso, I noticed you didn\'t submit Practical 3. Please see me urgently.\n\nKind regards,\nMs. van der Merwe',
    date: '2024-09-09',
    read: false,
    thread: [
      { from: 'Ms. van der Merwe', body: 'Hi Thabo,\n\nI wanted to reach out about your recent Physical Sciences test results. Your Term 3 Test 2 score of 48% is concerning, and I\'d like to discuss a support plan with you.\n\nI\'ll be running extra classes on Thursdays from 15:00. Please attend — it\'s compulsory for learners below 60%.\n\nAlso, I noticed you didn\'t submit Practical 3. Please see me urgently.\n\nKind regards,\nMs. van der Merwe', date: '2024-09-09', isStudent: false },
    ],
  },
  {
    id: 'm-002',
    from: 'Mr. Dlamini',
    fromRole: 'teacher',
    fromInitials: 'JD',
    fromColor: '#3B82F6',
    subject: 'Mathematics Olympiad — You\'re invited!',
    preview: 'Hi Thabo, congratulations on your improved Mathematics performance...',
    body: 'Hi Thabo,\n\nCongratulations on your improved Mathematics performance this term. Your Test 3 score of 80% shows real growth!\n\nI\'d like to nominate you for the KZN Mathematics Olympiad. It\'s a great opportunity to showcase your ability. Let me know if you\'re interested.\n\nMr. Dlamini',
    date: '2024-09-08',
    read: true,
    thread: [
      { from: 'Mr. Dlamini', body: 'Hi Thabo,\n\nCongratulations on your improved Mathematics performance this term. Your Test 3 score of 80% shows real growth!\n\nI\'d like to nominate you for the KZN Mathematics Olympiad. It\'s a great opportunity to showcase your ability. Let me know if you\'re interested.\n\nMr. Dlamini', date: '2024-09-08', isStudent: false },
      { from: 'Thabo Nkosi', body: 'Good afternoon Mr. Dlamini,\n\nThank you so much! I would love to take part in the Olympiad. Please enter my name.\n\nThabo', date: '2024-09-08', isStudent: true },
      { from: 'Mr. Dlamini', body: 'Wonderful! I\'ve registered you. Entry forms need to be completed by Friday. See me at break time.\n\nMr. Dlamini', date: '2024-09-09', isStudent: false },
    ],
  },
  {
    id: 'm-003',
    from: 'Mrs. Khumalo',
    fromRole: 'teacher',
    fromInitials: 'SK',
    fromColor: '#8B5CF6',
    subject: 'Essay 2 feedback — well done!',
    preview: 'Thabo, I\'ve finished marking your Macbeth essay...',
    body: 'Thabo,\n\nI\'ve finished marking your Macbeth essay and I\'m very pleased with your analysis. You scored 40/50 — your best English mark this year!\n\nYour argument about ambition was well-structured. Work on varying your sentence length for the final exam.\n\nMrs. Khumalo',
    date: '2024-09-07',
    read: true,
    thread: [
      { from: 'Mrs. Khumalo', body: 'Thabo,\n\nI\'ve finished marking your Macbeth essay and I\'m very pleased with your analysis. You scored 40/50 — your best English mark this year!\n\nYour argument about ambition was well-structured. Work on varying your sentence length for the final exam.\n\nMrs. Khumalo', date: '2024-09-07', isStudent: false },
    ],
  },
  {
    id: 'm-004',
    from: 'Admin — Sidelile',
    fromRole: 'admin',
    fromInitials: 'SA',
    fromColor: '#60a5fa',
    subject: 'Portal Maintenance — Saturday 14 September',
    preview: 'Please note that the student portal will be undergoing maintenance...',
    body: 'Dear Thabo,\n\nPlease note that the Sidelile student portal will be offline for scheduled maintenance on Saturday 14 September from 08:00 to 14:00.\n\nAll data will be preserved. If you have urgent queries, email support@sidelile.edu.za.\n\nThank you for your understanding.',
    date: '2024-09-05',
    read: true,
    thread: [
      { from: 'Admin — Sidelile', body: 'Dear Thabo,\n\nPlease note that the Sidelile student portal will be offline for scheduled maintenance on Saturday 14 September from 08:00 to 14:00.\n\nAll data will be preserved. If you have urgent queries, email support@sidelile.edu.za.\n\nThank you for your understanding.', date: '2024-09-05', isStudent: false },
    ],
  },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-001', title: 'Perfect Attendance', description: 'Attend school every day for a full month', icon: '🏆', category: 'Attendance', earned: true, earnedDate: '2024-08-31', points: 100, rarity: 'rare' },
  { id: 'ach-002', title: 'Maths Maverick', description: 'Score above 75% in three consecutive Maths tests', icon: '📐', category: 'Academic', earned: true, earnedDate: '2024-09-09', points: 150, rarity: 'rare' },
  { id: 'ach-003', title: 'Early Bird', description: 'Submit 5 assignments before the due date', icon: '⏰', category: 'Academic', earned: true, earnedDate: '2024-08-14', points: 75, rarity: 'common' },
  { id: 'ach-004', title: 'House Champion', description: 'Earn the most points for your house this term', icon: '🦁', category: 'Leadership', earned: true, earnedDate: '2024-07-26', points: 200, rarity: 'epic' },
  { id: 'ach-005', title: 'Language Star', description: 'Score above 80% in IsiZulu', icon: '🌟', category: 'Academic', earned: true, earnedDate: '2024-09-10', points: 100, rarity: 'rare' },
  { id: 'ach-006', title: 'Community Leader', description: 'Volunteer for a school community project', icon: '🤝', category: 'Community', earned: true, earnedDate: '2024-08-09', points: 125, rarity: 'common' },
  { id: 'ach-007', title: 'Science Star', description: 'Score above 75% in Physical Sciences', icon: '⚗️', category: 'Academic', earned: false, earnedDate: null, points: 150, rarity: 'rare' },
  { id: 'ach-008', title: 'Tech Genius', description: 'Score above 80% in IT', icon: '💻', category: 'Academic', earned: false, earnedDate: null, points: 150, rarity: 'rare' },
  { id: 'ach-009', title: 'Olympian', description: 'Participate in a provincial Maths or Science Olympiad', icon: '🎖️', category: 'Academic', earned: false, earnedDate: null, points: 300, rarity: 'legendary' },
  { id: 'ach-010', title: 'On The Board', description: 'Achieve a top-3 position in your class', icon: '🥇', category: 'Academic', earned: false, earnedDate: null, points: 250, rarity: 'epic' },
  { id: 'ach-011', title: 'Streak Keeper', description: 'Log into the portal 30 days in a row', icon: '🔥', category: 'Attendance', earned: false, earnedDate: null, points: 75, rarity: 'common' },
  { id: 'ach-012', title: 'All-Rounder', description: 'Pass every subject with above 60%', icon: '✨', category: 'Academic', earned: false, earnedDate: null, points: 200, rarity: 'epic' },
];

// ─── GOALS ───────────────────────────────────────────────────────────────────

export const GOALS: Goal[] = [
  { id: 'g-001', subjectId: 'math',       subject: 'Mathematics',            color: '#3B82F6', targetMark: 85, currentMark: 78, examWeight: 40, termWeight: 60, createdDate: '2024-07-01' },
  { id: 'g-002', subjectId: 'physics',    subject: 'Physical Sciences',      color: '#EF4444', targetMark: 60, currentMark: 51, examWeight: 40, termWeight: 60, createdDate: '2024-07-01' },
  { id: 'g-003', subjectId: 'english',    subject: 'English Home Language',  color: '#8B5CF6', targetMark: 85, currentMark: 82, examWeight: 30, termWeight: 70, createdDate: '2024-07-01' },
  { id: 'g-004', subjectId: 'it',         subject: 'Information Technology', color: '#06B6D4', targetMark: 75, currentMark: 60, examWeight: 40, termWeight: 60, createdDate: '2024-07-01' },
  { id: 'g-005', subjectId: 'accounting', subject: 'Accounting',             color: '#10B981', targetMark: 80, currentMark: 74, examWeight: 40, termWeight: 60, createdDate: '2024-07-01' },
];

// ─── STATS ────────────────────────────────────────────────────────────────────

export const OVERALL_AVERAGE = Math.round(
  SUBJECTS.reduce((sum, s) => sum + s.currentMark, 0) / SUBJECTS.length
);

export const AT_RISK_SUBJECTS = SUBJECTS.filter(s => s.isAtRisk);
export const CURRENT_STREAK = 12; // days logged in / on track
