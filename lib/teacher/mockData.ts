import type {
  Teacher, Student, Subject, SchoolClass, Assessment,
  Mark, AttendanceRecord, TeacherNotification, TeacherNote,
  SubjectCode, AttendanceStatus,
} from '@/types/teacher';

// ─── Current session: logged-in teacher ──────────────────────────────────────
export const CURRENT_TEACHER_ID = 't-001';

// ─── Teachers ─────────────────────────────────────────────────────────────────
export const TEACHERS: Teacher[] = [
  {
    _id: 't-001',
    employeeNumber: 'TCH-2019-001',
    firstName: 'Thabo',
    lastName: 'Nkosi',
    title: 'Mr.',
    email: 'thabo.nkosi@sidelile.edu.za',
    phone: '+27 72 345 6789',
    subjects: ['MATH'],
    classIds: ['cls-10b-math', 'cls-11a-math', 'cls-12d-math'],
    role: 'hod',
    department: 'Mathematics & Science',
    avatarInitials: 'TN',
    joinedDate: '2019-01-15',
    isActive: true,
  },
  {
    _id: 't-002',
    employeeNumber: 'TCH-2020-002',
    firstName: 'Priya',
    lastName: 'Naidoo',
    title: 'Ms.',
    email: 'priya.naidoo@sidelile.edu.za',
    phone: '+27 82 456 7890',
    subjects: ['PHY_SCI', 'LIFE_SCI'],
    classIds: ['cls-10a-sci', 'cls-11b-sci', 'cls-12c-sci'],
    role: 'teacher',
    department: 'Mathematics & Science',
    avatarInitials: 'PN',
    joinedDate: '2020-02-01',
    isActive: true,
  },
  {
    _id: 't-003',
    employeeNumber: 'TCH-2017-003',
    firstName: 'Anneke',
    lastName: 'van der Berg',
    title: 'Mrs.',
    email: 'anneke.vanderberg@sidelile.edu.za',
    phone: '+27 83 567 8901',
    subjects: ['ENG_HL', 'AFR_FAL'],
    classIds: ['cls-10c-eng', 'cls-11c-eng', 'cls-12a-eng'],
    role: 'teacher',
    department: 'Languages',
    avatarInitials: 'AB',
    joinedDate: '2017-07-20',
    isActive: true,
  },
];

// ─── Subjects ─────────────────────────────────────────────────────────────────
export const SUBJECTS: Subject[] = [
  { _id: 'sub-math',     code: 'MATH',     name: 'Mathematics',        shortName: 'Math',    passMark: 30, creditWeight: 4, isElective: false },
  { _id: 'sub-sci',      code: 'PHY_SCI',  name: 'Physical Sciences',  shortName: 'Sci',     passMark: 30, creditWeight: 4, isElective: false },
  { _id: 'sub-lsci',     code: 'LIFE_SCI', name: 'Life Sciences',      shortName: 'LifeSci', passMark: 30, creditWeight: 4, isElective: true  },
  { _id: 'sub-eng',      code: 'ENG_HL',   name: 'English Home Lang',  shortName: 'Eng',     passMark: 40, creditWeight: 4, isElective: false },
  { _id: 'sub-afr',      code: 'AFR_FAL',  name: 'Afrikaans FAL',      shortName: 'Afr',     passMark: 40, creditWeight: 2, isElective: false },
  { _id: 'sub-zul',      code: 'ZUL_HL',   name: 'Zulu Home Lang',     shortName: 'Zulu',    passMark: 40, creditWeight: 4, isElective: false },
  { _id: 'sub-lo',       code: 'LIFE_ORI', name: 'Life Orientation',   shortName: 'LO',      passMark: 30, creditWeight: 2, isElective: false },
  { _id: 'sub-hist',     code: 'HIST',     name: 'History',            shortName: 'Hist',    passMark: 30, creditWeight: 4, isElective: true  },
  { _id: 'sub-geo',      code: 'GEO',      name: 'Geography',          shortName: 'Geo',     passMark: 30, creditWeight: 4, isElective: true  },
  { _id: 'sub-acc',      code: 'ACC',      name: 'Accounting',         shortName: 'Acc',     passMark: 30, creditWeight: 4, isElective: true  },
  { _id: 'sub-bus',      code: 'BUS_STU',  name: 'Business Studies',   shortName: 'Bus',     passMark: 30, creditWeight: 4, isElective: true  },
  { _id: 'sub-econ',     code: 'ECON',     name: 'Economics',          shortName: 'Econ',    passMark: 30, creditWeight: 4, isElective: true  },
];

// ─── Students ─────────────────────────────────────────────────────────────────
// 35 students across 3 classes (Grade 10B, 11A, 12D) — assigned to Mr. Nkosi
// Authentic South African names: Zulu, Xhosa, Sotho, Afrikaans, English, Indian

const makeStudent = (
  id: string, num: string, first: string, last: string,
  grade: 8 | 9 | 10 | 11 | 12, classCode: string, classId: string,
  gender: 'male' | 'female', dob: string, parentEmail: string, parentPhone: string,
): Student => ({
  _id: id, studentNumber: num, firstName: first, lastName: last,
  fullName: `${last}, ${first}`, grade, classCode, classId, gender,
  dateOfBirth: dob, parentEmail, parentPhone,
  avatarInitials: `${first[0]}${last[0]}`,
  enrolledDate: `${2023 - (grade - 10 + 2)}-01-15`,
  isActive: true,
});

export const STUDENTS: Student[] = [
  // ── Grade 10B ─────────────────────────────────────────────────────────────
  makeStudent('s-001','STU-10B-01','Amahle',    'Dlamini',    10,'10B','cls-10b-math','female','2009-03-12','n.dlamini@gmail.com',     '+27 71 100 0001'),
  makeStudent('s-002','STU-10B-02','Sipho',     'Mthembu',    10,'10B','cls-10b-math','male',  '2009-07-24','b.mthembu@webmail.co.za', '+27 72 100 0002'),
  makeStudent('s-003','STU-10B-03','Lerato',    'Molefe',     10,'10B','cls-10b-math','female','2009-11-05','s.molefe@yahoo.com',      '+27 73 100 0003'),
  makeStudent('s-004','STU-10B-04','Pietrus',   'van Wyk',    10,'10B','cls-10b-math','male',  '2009-01-30','h.vanwyk@telkomsa.net',   '+27 74 100 0004'),
  makeStudent('s-005','STU-10B-05','Nomvula',   'Khumalo',    10,'10B','cls-10b-math','female','2009-08-16','z.khumalo@gmail.com',     '+27 75 100 0005'),
  makeStudent('s-006','STU-10B-06','Kabelo',    'Sithole',    10,'10B','cls-10b-math','male',  '2009-04-22','m.sithole@outlook.com',   '+27 76 100 0006'),
  makeStudent('s-007','STU-10B-07','Ayesha',    'Patel',      10,'10B','cls-10b-math','female','2009-09-14','r.patel@gmail.com',       '+27 77 100 0007'),
  makeStudent('s-008','STU-10B-08','Lungelo',   'Nxumalo',    10,'10B','cls-10b-math','male',  '2009-02-03','t.nxumalo@gmail.com',     '+27 78 100 0008'),
  makeStudent('s-009','STU-10B-09','Chloë',     'du Preez',   10,'10B','cls-10b-math','female','2009-06-27','a.dupreez@mweb.co.za',   '+27 79 100 0009'),
  makeStudent('s-010','STU-10B-10','Sibusiso',  'Shabalala',  10,'10B','cls-10b-math','male',  '2009-10-18','d.shabalala@gmail.com',   '+27 71 100 0010'),
  makeStudent('s-011','STU-10B-11','Naledi',    'Mokoena',    10,'10B','cls-10b-math','female','2009-05-09','p.mokoena@gmail.com',     '+27 72 100 0011'),
  makeStudent('s-012','STU-10B-12','Ruan',      'Botha',      10,'10B','cls-10b-math','male',  '2009-12-01','c.botha@telkomsa.net',   '+27 73 100 0012'),

  // ── Grade 11A ─────────────────────────────────────────────────────────────
  makeStudent('s-013','STU-11A-01','Zanele',    'Zulu',       11,'11A','cls-11a-math','female','2008-03-15','n.zulu@gmail.com',        '+27 74 110 0001'),
  makeStudent('s-014','STU-11A-02','Thulani',   'Ngcobo',     11,'11A','cls-11a-math','male',  '2008-07-22','b.ngcobo@webmail.co.za',  '+27 75 110 0002'),
  makeStudent('s-015','STU-11A-03','Precious',  'Mahlangu',   11,'11A','cls-11a-math','female','2008-11-11','s.mahlangu@yahoo.com',    '+27 76 110 0003'),
  makeStudent('s-016','STU-11A-04','Stefan',    'Pretorius',  11,'11A','cls-11a-math','male',  '2008-01-28','h.pretorius@gmail.com',   '+27 77 110 0004'),
  makeStudent('s-017','STU-11A-05','Ntombi',    'Mkhize',     11,'11A','cls-11a-math','female','2008-09-03','z.mkhize@outlook.com',    '+27 78 110 0005'),
  makeStudent('s-018','STU-11A-06','Siyanda',   'Cele',       11,'11A','cls-11a-math','male',  '2008-04-19','m.cele@gmail.com',        '+27 79 110 0006'),
  makeStudent('s-019','STU-11A-07','Fatima',    'Essop',      11,'11A','cls-11a-math','female','2008-08-25','r.essop@gmail.com',       '+27 71 110 0007'),
  makeStudent('s-020','STU-11A-08','Musa',      'Mhlongo',    11,'11A','cls-11a-math','male',  '2008-02-14','t.mhlongo@mweb.co.za',   '+27 72 110 0008'),
  makeStudent('s-021','STU-11A-09','Anita',     'Govender',   11,'11A','cls-11a-math','female','2008-06-30','a.govender@gmail.com',    '+27 73 110 0009'),
  makeStudent('s-022','STU-11A-10','Lwazi',     'Ntuli',      11,'11A','cls-11a-math','male',  '2008-10-07','d.ntuli@gmail.com',       '+27 74 110 0010'),
  makeStudent('s-023','STU-11A-11','Liesl',     'Fourie',     11,'11A','cls-11a-math','female','2008-05-16','p.fourie@telkomsa.net',  '+27 75 110 0011'),
  makeStudent('s-024','STU-11A-12','Bonga',     'Mthethwa',   11,'11A','cls-11a-math','male',  '2008-12-23','c.mthethwa@gmail.com',    '+27 76 110 0012'),

  // ── Grade 12D ─────────────────────────────────────────────────────────────
  makeStudent('s-025','STU-12D-01','Nokwanda',  'Hadebe',     12,'12D','cls-12d-math','female','2007-03-18','n.hadebe@gmail.com',      '+27 77 120 0001'),
  makeStudent('s-026','STU-12D-02','Mpendulo',  'Gumbi',      12,'12D','cls-12d-math','male',  '2007-07-11','b.gumbi@webmail.co.za',   '+27 78 120 0002'),
  makeStudent('s-027','STU-12D-03','Thandeka',  'Nzama',      12,'12D','cls-12d-math','female','2007-11-29','s.nzama@yahoo.com',       '+27 79 120 0003'),
  makeStudent('s-028','STU-12D-04','Dirk',      'Swanepoel',  12,'12D','cls-12d-math','male',  '2007-02-08','h.swanepoel@mweb.co.za', '+27 71 120 0004'),
  makeStudent('s-029','STU-12D-05','Nompumelelo','Dube',       12,'12D','cls-12d-math','female','2007-09-21','z.dube@gmail.com',        '+27 72 120 0005'),
  makeStudent('s-030','STU-12D-06','Sanele',    'Khoza',      12,'12D','cls-12d-math','male',  '2007-04-14','m.khoza@outlook.com',     '+27 73 120 0006'),
  makeStudent('s-031','STU-12D-07','Kavya',     'Pillay',     12,'12D','cls-12d-math','female','2007-08-05','r.pillay@gmail.com',      '+27 74 120 0007'),
  makeStudent('s-032','STU-12D-08','Jabulani',  'Msweli',     12,'12D','cls-12d-math','male',  '2007-01-17','t.msweli@gmail.com',      '+27 75 120 0008'),
  makeStudent('s-033','STU-12D-09','Maret',     'van Heerden',12,'12D','cls-12d-math','female','2007-06-26','a.vanheerden@telkomsa.net','+27 76 120 0009'),
  makeStudent('s-034','STU-12D-10','Khulekani', 'Myeni',      12,'12D','cls-12d-math','male',  '2007-10-31','d.myeni@gmail.com',       '+27 77 120 0010'),
  makeStudent('s-035','STU-12D-11','Bianca',    'Ferreira',   12,'12D','cls-12d-math','female','2007-05-13','p.ferreira@gmail.com',    '+27 78 120 0011'),
];

// ─── School Classes ────────────────────────────────────────────────────────────
export const SCHOOL_CLASSES: SchoolClass[] = [
  {
    _id: 'cls-10b-math', grade: 10, section: 'B', code: '10B',
    teacherId: 't-001', subjectCode: 'MATH', year: 2024, term: 3,
    studentIds: STUDENTS.filter(s => s.classId === 'cls-10b-math').map(s => s._id),
    room: 'C12', schedule: [
      { dayOfWeek: 0, startTime: '08:00', endTime: '08:45' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '10:45' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '09:45' },
    ],
  },
  {
    _id: 'cls-11a-math', grade: 11, section: 'A', code: '11A',
    teacherId: 't-001', subjectCode: 'MATH', year: 2024, term: 3,
    studentIds: STUDENTS.filter(s => s.classId === 'cls-11a-math').map(s => s._id),
    room: 'B08', schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '09:45' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '08:45' },
      { dayOfWeek: 4, startTime: '11:00', endTime: '11:45' },
    ],
  },
  {
    _id: 'cls-12d-math', grade: 12, section: 'D', code: '12D',
    teacherId: 't-001', subjectCode: 'MATH', year: 2024, term: 3,
    studentIds: STUDENTS.filter(s => s.classId === 'cls-12d-math').map(s => s._id),
    room: 'A04', schedule: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '10:45' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '08:45' },
      { dayOfWeek: 3, startTime: '13:00', endTime: '13:45' },
    ],
  },
];

// ─── Assessments ──────────────────────────────────────────────────────────────
export const ASSESSMENTS: Assessment[] = [
  // Grade 10B — Term 3 Mathematics
  { _id:'a-10b-1', classId:'cls-10b-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 1 — Algebra',     type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-07-19', conductedDate:'2024-07-19', isPublished:true,  createdAt:'2024-07-01' },
  { _id:'a-10b-2', classId:'cls-10b-math', teacherId:'t-001', subjectCode:'MATH', title:'Assignment 1',         type:'assignment', term:3, totalMarks:30,  weight:10, dueDate:'2024-08-02', conductedDate:'2024-08-02', isPublished:true,  createdAt:'2024-07-15' },
  { _id:'a-10b-3', classId:'cls-10b-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 2 — Functions',   type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-08-23', conductedDate:'2024-08-23', isPublished:true,  createdAt:'2024-08-05' },
  { _id:'a-10b-4', classId:'cls-10b-math', teacherId:'t-001', subjectCode:'MATH', title:'Project — Data Stats', type:'project',    term:3, totalMarks:100, weight:20, dueDate:'2024-09-06', conductedDate:'2024-09-06', isPublished:true,  createdAt:'2024-08-20' },
  { _id:'a-10b-5', classId:'cls-10b-math', teacherId:'t-001', subjectCode:'MATH', title:'Term Exam',            type:'exam',       term:3, totalMarks:100, weight:40, dueDate:'2024-09-20', conductedDate:null,         isPublished:false, createdAt:'2024-08-30' },

  // Grade 11A — Term 3 Mathematics
  { _id:'a-11a-1', classId:'cls-11a-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 1 — Trig',        type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-07-19', conductedDate:'2024-07-19', isPublished:true,  createdAt:'2024-07-01' },
  { _id:'a-11a-2', classId:'cls-11a-math', teacherId:'t-001', subjectCode:'MATH', title:'Assignment 1',         type:'assignment', term:3, totalMarks:30,  weight:10, dueDate:'2024-08-02', conductedDate:'2024-08-02', isPublished:true,  createdAt:'2024-07-15' },
  { _id:'a-11a-3', classId:'cls-11a-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 2 — Sequences',   type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-08-23', conductedDate:'2024-08-23', isPublished:true,  createdAt:'2024-08-05' },
  { _id:'a-11a-4', classId:'cls-11a-math', teacherId:'t-001', subjectCode:'MATH', title:'Investigation',        type:'project',    term:3, totalMarks:50,  weight:20, dueDate:'2024-09-06', conductedDate:'2024-09-06', isPublished:true,  createdAt:'2024-08-20' },
  { _id:'a-11a-5', classId:'cls-11a-math', teacherId:'t-001', subjectCode:'MATH', title:'Term Exam',            type:'exam',       term:3, totalMarks:150, weight:40, dueDate:'2024-09-20', conductedDate:null,         isPublished:false, createdAt:'2024-08-30' },

  // Grade 12D — Term 3 Mathematics (matric — higher stakes)
  { _id:'a-12d-1', classId:'cls-12d-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 1 — Calculus',    type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-07-19', conductedDate:'2024-07-19', isPublished:true,  createdAt:'2024-07-01' },
  { _id:'a-12d-2', classId:'cls-12d-math', teacherId:'t-001', subjectCode:'MATH', title:'Assignment 1',         type:'assignment', term:3, totalMarks:30,  weight:10, dueDate:'2024-08-02', conductedDate:'2024-08-02', isPublished:true,  createdAt:'2024-07-15' },
  { _id:'a-12d-3', classId:'cls-12d-math', teacherId:'t-001', subjectCode:'MATH', title:'Test 2 — Probability', type:'test',       term:3, totalMarks:50,  weight:15, dueDate:'2024-08-23', conductedDate:'2024-08-23', isPublished:true,  createdAt:'2024-08-05' },
  { _id:'a-12d-4', classId:'cls-12d-math', teacherId:'t-001', subjectCode:'MATH', title:'Trial Exam P1',        type:'exam',       term:3, totalMarks:150, weight:60, dueDate:'2024-09-13', conductedDate:'2024-09-13', isPublished:true,  createdAt:'2024-08-28' },
];

// ─── Mark generation helpers ───────────────────────────────────────────────────
// Deterministic pseudo-random so data is consistent across renders
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateMark(
  assessmentId: string, studentId: string, classId: string, teacherId: string,
  assessment: Assessment, studentIndex: number, classProfile: number,
): Mark {
  const seed = assessmentId.charCodeAt(2) * 100 + studentIndex;
  const rand = seededRand(seed);
  // Each student has a profile (0-1 = weak to strong)
  const baseScore = classProfile * 0.7 + rand * 0.3;
  const rawMark = Math.round(Math.max(0, Math.min(1, baseScore)) * assessment.totalMarks);
  const absent = rand < 0.04; // ~4% absence rate

  return {
    _id: `mark-${assessmentId}-${studentId}`,
    assessmentId,
    studentId,
    classId,
    teacherId,
    rawMark: absent ? null : rawMark,
    percentage: absent ? null : Math.round((rawMark / assessment.totalMarks) * 100),
    isAbsent: absent,
    comment: '',
    capturedAt: assessment.conductedDate ? `${assessment.conductedDate}T14:00:00Z` : null,
    updatedAt: null,
  };
}

// Student ability profiles (0=weak, 1=strong) for each class — keeps data realistic
const PROFILES_10B = [0.82,0.55,0.91,0.38,0.74,0.60,0.88,0.43,0.96,0.51,0.77,0.33];
const PROFILES_11A = [0.79,0.62,0.85,0.29,0.70,0.56,0.93,0.48,0.87,0.40,0.75,0.65];
const PROFILES_12D = [0.68,0.72,0.84,0.25,0.80,0.58,0.91,0.45,0.77,0.50,0.88];

export const MARKS: Mark[] = [
  ...ASSESSMENTS.filter(a => a.classId === 'cls-10b-math' && a.conductedDate !== null).flatMap(assessment =>
    STUDENTS.filter(s => s.classId === 'cls-10b-math').map((student, i) =>
      generateMark(assessment._id, student._id, 'cls-10b-math', 't-001', assessment, i, PROFILES_10B[i] ?? 0.6)
    )
  ),
  ...ASSESSMENTS.filter(a => a.classId === 'cls-11a-math' && a.conductedDate !== null).flatMap(assessment =>
    STUDENTS.filter(s => s.classId === 'cls-11a-math').map((student, i) =>
      generateMark(assessment._id, student._id, 'cls-11a-math', 't-001', assessment, i, PROFILES_11A[i] ?? 0.6)
    )
  ),
  ...ASSESSMENTS.filter(a => a.classId === 'cls-12d-math' && a.conductedDate !== null).flatMap(assessment =>
    STUDENTS.filter(s => s.classId === 'cls-12d-math').map((student, i) =>
      generateMark(assessment._id, student._id, 'cls-12d-math', 't-001', assessment, i, PROFILES_12D[i] ?? 0.6)
    )
  ),
];

// ─── Attendance ────────────────────────────────────────────────────────────────
// August–November 2024 — generate one record per school day per student
function schoolDays(year: number, month: number): string[] {
  const days: string[] = [];
  const d = new Date(year, month - 1, 1);
  while (d.getMonth() === month - 1) {
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) {
      days.push(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function generateAttendance(
  student: Student, classId: string, profile: number,
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const months = [8, 9, 10, 11]; // Aug–Nov
  months.forEach(month => {
    schoolDays(2024, month).forEach(date => {
      const seed = parseInt(student._id.replace(/\D/g, '')) * 1000 + month * 31 + parseInt(date.split('-')[2]);
      const rand = seededRand(seed);
      // Students with higher profiles attend more
      const absenceThreshold = (1 - profile) * 0.25 + 0.03;
      let status: AttendanceStatus = 'present';
      if (rand < absenceThreshold * 0.4) status = 'absent';
      else if (rand < absenceThreshold * 0.6) status = 'late';
      else if (rand < absenceThreshold * 0.7) status = 'excused';

      records.push({
        _id: `att-${student._id}-${date}`,
        classId,
        teacherId: 't-001',
        studentId: student._id,
        date,
        status,
        note: '',
        capturedAt: `${date}T08:00:00Z`,
      });
    });
  });
  return records;
}

export const ATTENDANCE: AttendanceRecord[] = [
  ...STUDENTS.filter(s => s.classId === 'cls-10b-math').flatMap((s, i) =>
    generateAttendance(s, 'cls-10b-math', PROFILES_10B[i] ?? 0.6)
  ),
  ...STUDENTS.filter(s => s.classId === 'cls-11a-math').flatMap((s, i) =>
    generateAttendance(s, 'cls-11a-math', PROFILES_11A[i] ?? 0.6)
  ),
  ...STUDENTS.filter(s => s.classId === 'cls-12d-math').flatMap((s, i) =>
    generateAttendance(s, 'cls-12d-math', PROFILES_12D[i] ?? 0.6)
  ),
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const NOTIFICATIONS: TeacherNotification[] = [
  { _id:'n-001', teacherId:'t-001', title:'Trial Exam Marks Due', message:'Grade 12D Trial Exam P1 marks must be submitted to the HOD by Friday 20 September 2024.', type:'urgent',  isRead:false, createdAt:'2024-09-14T08:00:00Z' },
  { _id:'n-002', teacherId:'t-001', title:'Staff Meeting — Thursday', message:'Compulsory staff meeting in the hall at 14:30 on Thursday. Please bring your term planning documents.', type:'info',   isRead:false, createdAt:'2024-09-12T11:00:00Z' },
  { _id:'n-003', teacherId:'t-001', title:'3 Students at Risk', message:'Pietrus van Wyk (10B), Stefan Pretorius (11A) and Dirk Swanepoel (12D) are below 40% in Mathematics. Parent letters are required.', type:'warning', isRead:false, createdAt:'2024-09-10T09:00:00Z' },
  { _id:'n-004', teacherId:'t-001', title:'Stationery Request Approved', message:'Your requisition for graph paper and calculators has been approved. Collect from the storeroom.', type:'success', isRead:true,  createdAt:'2024-09-08T10:00:00Z' },
  { _id:'n-005', teacherId:'t-001', title:'CAPS Pacing Update', message:'Updated CAPS pacing document for Term 4 has been shared to the staff Google Drive. Please review before planning.', type:'info',   isRead:true,  createdAt:'2024-09-05T14:00:00Z' },
];

// ─── Teacher Notes ─────────────────────────────────────────────────────────────
export const TEACHER_NOTES: TeacherNote[] = [
  { _id:'tn-001', teacherId:'t-001', studentId:'s-004', note:'Parent contacted on 2 Sept re failing mark. Parent is aware and has arranged tutoring.', isPrivate:false, createdAt:'2024-09-02T15:00:00Z', updatedAt:'2024-09-02T15:00:00Z' },
  { _id:'tn-002', teacherId:'t-001', studentId:'s-016', note:'Student shows inconsistency — excellent during class but fails tests. Possible test anxiety. Recommend counsellor referral.', isPrivate:false, createdAt:'2024-08-28T11:00:00Z', updatedAt:'2024-09-05T09:00:00Z' },
  { _id:'tn-003', teacherId:'t-001', studentId:'s-028', note:'Repeated disruptions during lessons. Discussed with student. Improvement noted after conversation.', isPrivate:false, createdAt:'2024-08-15T14:00:00Z', updatedAt:'2024-08-15T14:00:00Z' },
  { _id:'tn-004', teacherId:'t-001', studentId:'s-009', note:'Outstanding student. Should be considered for the Maths Olympiad team.', isPrivate:false, createdAt:'2024-08-10T10:00:00Z', updatedAt:'2024-08-10T10:00:00Z' },
];
