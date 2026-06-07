// ─── Sidelile High School — Admin Portal Mock Data ────────────────────────────

export interface Application {
  id: string; ref: string; firstName: string; lastName: string;
  dob: string; gender: 'Male' | 'Female'; gradeApplying: number;
  currentSchool: string; currentAverage: number;
  mathsMark: number; scienceMark: number;
  subjectChoices: string[]; parentName: string; parentPhone: string;
  parentEmail: string; address: string; dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'info_requested';
  notes: string; missingDocs?: string[];
  assignedClass?: string; studentNumber?: string; adminNote?: string;
}

export interface AdminStudent {
  id: string; studentNumber: string; firstName: string; lastName: string;
  grade: number; className: string; average: number; attendance: number;
  status: 'active' | 'inactive' | 'suspended';
  dob: string; gender: string; phone: string; email: string;
  parentName: string; parentPhone: string; house: string;
  initials: string; color: string; mathsMark?: number; scienceMark?: number;
}

export interface AdminTeacher {
  id: string; employeeNumber: string; firstName: string; lastName: string;
  title: string; subjects: string[]; classes: string[];
  phone: string; email: string; role: 'hod' | 'educator' | 'deputy' | 'principal';
  department: string; status: 'active' | 'on_leave' | 'inactive';
  initials: string; color: string; joinedDate: string;
}

export interface AdminClass {
  id: string; name: string; grade: number; section: string; stream: string;
  homeTeacher: string; studentCount: number; capacity: number;
  subjects: string[]; averageMark: number; room: string;
}

export interface AdminNotice {
  id: string; title: string;
  category: 'Academic' | 'Admin' | 'Event' | 'Urgent' | 'General';
  content: string; target: string; priority: 'normal' | 'important' | 'urgent';
  publishedDate: string; author: string; active: boolean; pinned?: boolean;
  views?: number; status: 'published' | 'draft' | 'scheduled';
}

export interface StreamStudent {
  id: string; studentNumber: string; firstName: string; lastName: string;
  currentAverage: number; mathsMark: number; scienceMark: number;
  pref1: string; pref2: string; pref3: string; recommended: string;
  assignedClass: string | null; status: 'pending' | 'assigned';
}

export interface AuditEntry {
  id: string; timestamp: string; admin: string; action: string;
  record: string; details: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'export';
}

const C = ['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6','#06B6D4','#EC4899','#14B8A6','#F97316','#6366F1'];

export const APPLICATIONS: Application[] = [
  { id:'app-001', ref:'SHS-2025-001', firstName:'Amahle',    lastName:'Zulu',      dob:'2012-03-14', gender:'Female', gradeApplying:8,  currentSchool:'Thandokuhle Primary', currentAverage:88, mathsMark:91, scienceMark:87, subjectChoices:['Mathematics','Natural Sciences','Social Sciences'], parentName:'Mrs. Nomsa Zulu',       parentPhone:'071 234 5678', parentEmail:'nomsa.zulu@gmail.com',    address:'12 Umgeni Rd, Durban, 4001',         dateSubmitted:'2 Sep 2025',  status:'pending',       notes:'' },
  { id:'app-002', ref:'SHS-2025-002', firstName:'Lethiwe',   lastName:'Dlamini',   dob:'2012-07-22', gender:'Female', gradeApplying:8,  currentSchool:'Hillcrest Primary',   currentAverage:79, mathsMark:75, scienceMark:80, subjectChoices:['Mathematics','Natural Sciences','Technology'],      parentName:'Mr. Sipho Dlamini',      parentPhone:'082 345 6789', parentEmail:'sipho.d@hotmail.com',     address:'4 Palm Drive, Pinetown, 3610',       dateSubmitted:'3 Sep 2025',  status:'pending',       notes:'' },
  { id:'app-003', ref:'SHS-2025-003', firstName:'Siphamandla',lastName:'Mthembu',  dob:'2011-11-05', gender:'Male',   gradeApplying:9,  currentSchool:'Sidelile High School',currentAverage:74, mathsMark:70, scienceMark:72, subjectChoices:['Mathematics','Physical Sciences','IT'],             parentName:'Mrs. Thandi Mthembu',    parentPhone:'083 456 7890', parentEmail:'thandi.m@gmail.com',      address:'88 Sappi Rd, KwaDukuza, 4450',       dateSubmitted:'4 Sep 2025',  status:'approved',      notes:'Strong candidate.', assignedClass:'9B', studentNumber:'STU-9B-2025-031' },
  { id:'app-004', ref:'SHS-2025-004', firstName:'Khanyisile', lastName:'Nkosi',    dob:'2012-01-30', gender:'Female', gradeApplying:8,  currentSchool:'Merewent Primary',    currentAverage:65, mathsMark:60, scienceMark:63, subjectChoices:['English','Social Sciences','Life Skills'],          parentName:'Mr. Bongani Nkosi',      parentPhone:'079 567 8901', parentEmail:'bongani.nkosi@yahoo.com', address:'5 Merewent Ave, Durban South, 4052', dateSubmitted:'5 Sep 2025',  status:'pending',       notes:'', missingDocs:['Birth certificate','Previous report card'] },
  { id:'app-005', ref:'SHS-2025-005', firstName:'Sibonelo',   lastName:'Hadebe',   dob:'2011-06-18', gender:'Male',   gradeApplying:9,  currentSchool:'Pinetown Junior',     currentAverage:55, mathsMark:48, scienceMark:52, subjectChoices:['Mathematics','Social Sciences','Technology'],       parentName:'Mrs. Zanele Hadebe',     parentPhone:'073 678 9012', parentEmail:'zanele.h@gmail.com',      address:'22 Old Main Rd, Hillcrest, 3650',    dateSubmitted:'6 Sep 2025',  status:'rejected',      notes:'Does not meet minimum entry requirement of 60%.' },
  { id:'app-006', ref:'SHS-2025-006', firstName:'Nokukhanya', lastName:'Buthelezi',dob:'2012-09-12', gender:'Female', gradeApplying:8,  currentSchool:'Berea Road Primary',  currentAverage:92, mathsMark:95, scienceMark:90, subjectChoices:['Mathematics','Natural Sciences','Social Sciences'], parentName:'Dr. Lungelo Buthelezi',  parentPhone:'031 555 0199', parentEmail:'l.buthelezi@medway.co.za',address:'14 Ridge Rd, Berea, 4001',           dateSubmitted:'7 Sep 2025',  status:'pending',       notes:'' },
  { id:'app-007', ref:'SHS-2025-007', firstName:'Mthokozisi', lastName:'Ngubane',  dob:'2012-05-03', gender:'Male',   gradeApplying:8,  currentSchool:'Westville Primary',   currentAverage:82, mathsMark:84, scienceMark:79, subjectChoices:['Mathematics','Natural Sciences','Technology'],      parentName:'Mrs. Phindile Ngubane',  parentPhone:'074 789 0123', parentEmail:'phindile.n@gmail.com',    address:'7 Westville Dr, Westville, 3629',    dateSubmitted:'8 Sep 2025',  status:'info_requested',notes:'Awaiting original school report.', missingDocs:['Original school report'] },
  { id:'app-008', ref:'SHS-2025-008', firstName:'Thandeka',   lastName:'Mkhize',   dob:'2011-08-25', gender:'Female', gradeApplying:10, currentSchool:'Sidelile High School',currentAverage:71, mathsMark:68, scienceMark:74, subjectChoices:['Accounting','Business Studies','Mathematics'],      parentName:'Mr. Sifiso Mkhize',      parentPhone:'082 890 1234', parentEmail:'sifiso.m@sappi.com',      address:'33 Valley View, Stanger, 4450',      dateSubmitted:'9 Sep 2025',  status:'approved',      notes:'Internal transfer.', assignedClass:'10C', studentNumber:'STU-10C-2025-018' },
  { id:'app-009', ref:'SHS-2025-009', firstName:'Zakhele',    lastName:'Khumalo',  dob:'2012-04-15', gender:'Male',   gradeApplying:8,  currentSchool:'Northdene Primary',   currentAverage:76, mathsMark:78, scienceMark:74, subjectChoices:['Mathematics','Natural Sciences','Technology'],      parentName:'Mrs. Buhle Khumalo',     parentPhone:'076 123 4567', parentEmail:'buhle.k@gmail.com',       address:'55 Northdene Rd, Queensburgh, 4093', dateSubmitted:'10 Sep 2025', status:'pending',       notes:'' },
  { id:'app-010', ref:'SHS-2025-010', firstName:'Sanele',     lastName:'Cele',     dob:'2011-12-08', gender:'Male',   gradeApplying:9,  currentSchool:'Merebank Secondary',  currentAverage:68, mathsMark:65, scienceMark:70, subjectChoices:['Mathematics','Technology','Social Sciences'],       parentName:'Mr. Themba Cele',        parentPhone:'078 234 5678', parentEmail:'themba.cele@yahoo.com',   address:'9 Bluff Rd, Bluff, 4052',            dateSubmitted:'11 Sep 2025', status:'pending',       notes:'' },
  { id:'app-011', ref:'SHS-2025-011', firstName:'Lungelo',    lastName:'Ndlovu',   dob:'2012-02-20', gender:'Male',   gradeApplying:8,  currentSchool:'Isipingo Hills Primary',currentAverage:85,mathsMark:88, scienceMark:84, subjectChoices:['Mathematics','Natural Sciences','Social Sciences'], parentName:'Mrs. Nonhlanhla Ndlovu', parentPhone:'071 345 6789', parentEmail:'nonhlanhla.n@gmail.com',  address:'22 Marine Dr, Amanzimtoti, 4126',    dateSubmitted:'12 Sep 2025', status:'pending',       notes:'' },
  { id:'app-012', ref:'SHS-2025-012', firstName:'Nokwanda',   lastName:'Sithole',  dob:'2012-06-30', gender:'Female', gradeApplying:8,  currentSchool:'Pinecrest Primary',   currentAverage:58, mathsMark:52, scienceMark:60, subjectChoices:['English','Social Sciences','Life Skills'],          parentName:'Mrs. Ntombi Sithole',    parentPhone:'082 456 7890', parentEmail:'ntombi.s@gmail.com',      address:'3 Pine Ave, Pinetown, 3600',         dateSubmitted:'13 Sep 2025', status:'pending',       notes:'', missingDocs:['Immunisation record'] },
];

export const ADMIN_STUDENTS: AdminStudent[] = [
  { id:'s-001', studentNumber:'STU-11A-007', firstName:'Thabo',     lastName:'Nkosi',     grade:11, className:'11A', average:73, attendance:96,  status:'active',    dob:'2007-03-14', gender:'Male',   phone:'083 456 7890', email:'thabo.nkosi@students.sidelile.edu.za',     parentName:'Mrs. Zanele Nkosi',     parentPhone:'071 234 5678', house:'Shaka',     initials:'TN', color:C[0], mathsMark:68, scienceMark:71 },
  { id:'s-002', studentNumber:'STU-11A-003', firstName:'Nomvula',   lastName:'Dlamini',   grade:11, className:'11A', average:81, attendance:98,  status:'active',    dob:'2007-06-22', gender:'Female', phone:'072 234 5678', email:'nomvula.dlamini@students.sidelile.edu.za',  parentName:'Mr. Sipho Dlamini',     parentPhone:'082 345 6789', house:'Shaka',     initials:'ND', color:C[1], mathsMark:83, scienceMark:85 },
  { id:'s-003', studentNumber:'STU-11B-012', firstName:'Siyanda',   lastName:'Mthembu',   grade:11, className:'11B', average:67, attendance:91,  status:'active',    dob:'2007-09-05', gender:'Male',   phone:'074 345 6789', email:'siyanda.mthembu@students.sidelile.edu.za',  parentName:'Mrs. Thandi Mthembu',   parentPhone:'083 456 7890', house:'Cetshwayo', initials:'SM', color:C[2], mathsMark:62, scienceMark:65 },
  { id:'s-004', studentNumber:'STU-11A-019', firstName:'Ayanda',    lastName:'Khumalo',   grade:11, className:'11A', average:55, attendance:87,  status:'active',    dob:'2007-11-14', gender:'Female', phone:'076 456 7890', email:'ayanda.khumalo@students.sidelile.edu.za',   parentName:'Mr. Bongani Khumalo',   parentPhone:'079 567 8901', house:'Shaka',     initials:'AK', color:C[3], mathsMark:48, scienceMark:51 },
  { id:'s-005', studentNumber:'STU-12A-004', firstName:'Lungelo',   lastName:'Zulu',      grade:12, className:'12A', average:78, attendance:99,  status:'active',    dob:'2006-02-28', gender:'Male',   phone:'078 567 8901', email:'lungelo.zulu@students.sidelile.edu.za',     parentName:'Mrs. Nompumelelo Zulu', parentPhone:'073 678 9012', house:'Mandela',   initials:'LZ', color:C[4], mathsMark:80, scienceMark:77 },
  { id:'s-006', studentNumber:'STU-12B-008', firstName:'Zintle',    lastName:'Ngubane',   grade:12, className:'12B', average:85, attendance:100, status:'active',    dob:'2006-05-17', gender:'Female', phone:'071 678 9012', email:'zintle.ngubane@students.sidelile.edu.za',   parentName:'Dr. Phindile Ngubane',  parentPhone:'074 789 0123', house:'Mandela',   initials:'ZN', color:C[5], mathsMark:88, scienceMark:90 },
  { id:'s-007', studentNumber:'STU-10C-015', firstName:'Sipho',     lastName:'Hadebe',    grade:10, className:'10C', average:62, attendance:88,  status:'active',    dob:'2008-08-09', gender:'Male',   phone:'073 789 0123', email:'sipho.hadebe@students.sidelile.edu.za',     parentName:'Mrs. Zanele Hadebe',    parentPhone:'073 678 9012', house:'Biko',      initials:'SH', color:C[6], mathsMark:58, scienceMark:62 },
  { id:'s-008', studentNumber:'STU-09B-022', firstName:'Nandi',     lastName:'Buthelezi', grade:9,  className:'9B',  average:76, attendance:95,  status:'active',    dob:'2009-12-03', gender:'Female', phone:'079 890 1234', email:'nandi.buthelezi@students.sidelile.edu.za',  parentName:'Mr. Lungelo Buthelezi', parentPhone:'031 555 0199', house:'Biko',      initials:'NB', color:C[7], mathsMark:78, scienceMark:74 },
  { id:'s-009', studentNumber:'STU-11C-007', firstName:'Sanele',    lastName:'Mkhize',    grade:11, className:'11C', average:48, attendance:79,  status:'suspended', dob:'2007-04-20', gender:'Male',   phone:'076 901 2345', email:'sanele.mkhize@students.sidelile.edu.za',    parentName:'Mr. Sifiso Mkhize',     parentPhone:'082 890 1234', house:'Cetshwayo', initials:'SM', color:C[8], mathsMark:40, scienceMark:45 },
  { id:'s-010', studentNumber:'STU-12C-001', firstName:'Phiwe',     lastName:'Bhengu',    grade:12, className:'12C', average:91, attendance:100, status:'active',    dob:'2006-07-30', gender:'Female', phone:'082 012 3456', email:'phiwe.bhengu@students.sidelile.edu.za',     parentName:'Mrs. Nokwanda Bhengu',  parentPhone:'082 123 4567', house:'Mandela',   initials:'PB', color:C[1], mathsMark:93, scienceMark:95 },
  { id:'s-011', studentNumber:'STU-09A-015', firstName:'Lwazi',     lastName:'Ntanzi',    grade:9,  className:'9A',  average:82, attendance:94,  status:'active',    dob:'2009-05-12', gender:'Male',   phone:'071 112 3456', email:'lwazi.ntanzi@students.sidelile.edu.za',     parentName:'Mr. Vusi Ntanzi',       parentPhone:'071 112 3456', house:'Shaka',     initials:'LN', color:C[9], mathsMark:85, scienceMark:82 },
  { id:'s-012', studentNumber:'STU-09A-008', firstName:'Simangele', lastName:'Ngema',     grade:9,  className:'9A',  average:69, attendance:90,  status:'active',    dob:'2009-08-25', gender:'Female', phone:'082 223 4567', email:'simangele.ngema@students.sidelile.edu.za',  parentName:'Mrs. Hlengiwe Ngema',   parentPhone:'082 223 4567', house:'Biko',      initials:'SN', color:C[0], mathsMark:64, scienceMark:68 },
];

export const ADMIN_TEACHERS: AdminTeacher[] = [
  { id:'t-001', employeeNumber:'EMP-001', firstName:'Jabulani',  lastName:'Dlamini',      title:'Mr.',  subjects:['Mathematics'],           classes:['11A','11B','12A'],             phone:'031 970 7393', email:'dlamini@sidelile.edu.za',     role:'hod',     department:'Mathematics',     status:'active',   initials:'JD', color:C[0], joinedDate:'2015-01-12' },
  { id:'t-002', employeeNumber:'EMP-002', firstName:'Annelie',   lastName:'van der Merwe',title:'Ms.',  subjects:['Physical Sciences'],      classes:['11A','11B','12B'],             phone:'031 970 7394', email:'vandermerwe@sidelile.edu.za', role:'educator',department:'Sciences',         status:'active',   initials:'VM', color:C[1], joinedDate:'2018-01-15' },
  { id:'t-003', employeeNumber:'EMP-003', firstName:'Sibongile', lastName:'Khumalo',       title:'Mrs.', subjects:['English Home Language'],  classes:['11A','10B','9A'],              phone:'031 970 7395', email:'khumalo@sidelile.edu.za',     role:'educator',department:'Languages',        status:'active',   initials:'SK', color:C[2], joinedDate:'2016-07-18' },
  { id:'t-004', employeeNumber:'EMP-004', firstName:'Nhlanhla',  lastName:'Mthembu',       title:'Mr.',  subjects:['IsiZulu FAL'],            classes:['11A','11B','11C','10A'],       phone:'031 970 7396', email:'mthembu@sidelile.edu.za',     role:'hod',     department:'Languages',        status:'active',   initials:'NM', color:C[3], joinedDate:'2012-01-09' },
  { id:'t-005', employeeNumber:'EMP-005', firstName:'Bongekile', lastName:'Ngubane',        title:'Ms.',  subjects:['Accounting'],             classes:['11A','12B','10C'],             phone:'031 970 7397', email:'ngubane@sidelile.edu.za',     role:'educator',department:'Commerce',          status:'active',   initials:'BN', color:C[4], joinedDate:'2019-01-14' },
  { id:'t-006', employeeNumber:'EMP-006', firstName:'Phiwe',     lastName:'Sithole',        title:'Mr.',  subjects:['Information Technology'], classes:['11A','11B','10A','9B'],        phone:'031 970 7398', email:'sithole@sidelile.edu.za',     role:'educator',department:'Technology',        status:'active',   initials:'PS', color:C[5], joinedDate:'2020-01-13' },
  { id:'t-007', employeeNumber:'EMP-007', firstName:'Nobuhle',   lastName:'Hadebe',         title:'Ms.',  subjects:['Life Orientation'],       classes:['11A','11B','11C','10A','10B'], phone:'031 970 7399', email:'hadebe@sidelile.edu.za',      role:'educator',department:'Life Orientation', status:'active',   initials:'NH', color:C[6], joinedDate:'2017-07-10' },
  { id:'t-008', employeeNumber:'EMP-008', firstName:'Thulisile', lastName:'Buthelezi',      title:'Mrs.', subjects:['Life Sciences'],          classes:['11B','11C','12A','10B'],       phone:'031 970 7400', email:'buthelezi@sidelile.edu.za',   role:'hod',     department:'Sciences',         status:'on_leave', initials:'TB', color:C[7], joinedDate:'2014-01-20' },
  { id:'t-009', employeeNumber:'EMP-009', firstName:'Sandile',   lastName:'Ndlovu',         title:'Mr.',  subjects:['Geography'],              classes:['12A','12B','11C'],             phone:'031 970 7401', email:'ndlovu@sidelile.edu.za',      role:'educator',department:'Humanities',        status:'active',   initials:'SN', color:C[8], joinedDate:'2021-01-11' },
  { id:'t-010', employeeNumber:'EMP-010', firstName:'Zanele',    lastName:'Cele',           title:'Mrs.', subjects:['History'],                classes:['12C','11C','10D'],             phone:'031 970 7402', email:'cele@sidelile.edu.za',        role:'educator',department:'Humanities',        status:'active',   initials:'ZC', color:C[9], joinedDate:'2013-07-15' },
];

export const ADMIN_CLASSES: AdminClass[] = [
  { id:'c-8a',  name:'8A',  grade:8,  section:'A', stream:'General',         homeTeacher:'Mr. Ndlovu',       studentCount:38, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:74, room:'F-101' },
  { id:'c-8b',  name:'8B',  grade:8,  section:'B', stream:'General',         homeTeacher:'Mrs. Shabalala',   studentCount:37, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:71, room:'F-102' },
  { id:'c-8c',  name:'8C',  grade:8,  section:'C', stream:'General',         homeTeacher:'Mr. Cele',         studentCount:36, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:68, room:'F-103' },
  { id:'c-8d',  name:'8D',  grade:8,  section:'D', stream:'General',         homeTeacher:'Ms. Mbatha',       studentCount:35, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:66, room:'F-104' },
  { id:'c-8e',  name:'8E',  grade:8,  section:'E', stream:'General',         homeTeacher:'Mrs. Nzama',       studentCount:34, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:63, room:'F-105' },
  { id:'c-9a',  name:'9A',  grade:9,  section:'A', stream:'General',         homeTeacher:'Mr. Mthembu',      studentCount:36, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:72, room:'F-201' },
  { id:'c-9b',  name:'9B',  grade:9,  section:'B', stream:'General',         homeTeacher:'Ms. Cele',         studentCount:35, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:70, room:'F-202' },
  { id:'c-9c',  name:'9C',  grade:9,  section:'C', stream:'General',         homeTeacher:'Mrs. Nkosi',       studentCount:34, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:67, room:'F-203' },
  { id:'c-9d',  name:'9D',  grade:9,  section:'D', stream:'General',         homeTeacher:'Mr. Bhengu',       studentCount:33, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:64, room:'F-204' },
  { id:'c-9e',  name:'9E',  grade:9,  section:'E', stream:'General',         homeTeacher:'Ms. Dlamini',      studentCount:32, capacity:40, subjects:['Maths','English','IsiZulu','Nat Sciences','Social Sciences','Tech','EMS','LO'], averageMark:61, room:'F-205' },
  { id:'c-10a', name:'10A', grade:10, section:'A', stream:'Pure Sciences',   homeTeacher:'Ms. Ngubane',      studentCount:34, capacity:38, subjects:['Maths','English','IsiZulu','Physics','Life Sciences','IT','LO'],              averageMark:76, room:'A-101' },
  { id:'c-10b', name:'10B', grade:10, section:'B', stream:'Applied Sciences',homeTeacher:'Mrs. Khumalo',     studentCount:33, capacity:38, subjects:['Maths','English','IsiZulu','Life Sciences','Business','Geog','LO'],           averageMark:72, room:'A-102' },
  { id:'c-10c', name:'10C', grade:10, section:'C', stream:'Commerce',        homeTeacher:'Mr. Sithole',      studentCount:32, capacity:38, subjects:['Maths','English','IsiZulu','Accounting','Business','Economics','LO'],         averageMark:68, room:'A-103' },
  { id:'c-10d', name:'10D', grade:10, section:'D', stream:'Humanities',      homeTeacher:'Mrs. Cele',        studentCount:31, capacity:38, subjects:['Maths','English','IsiZulu','History','Geog','Consumer Studies','LO'],        averageMark:65, room:'A-104' },
  { id:'c-10e', name:'10E', grade:10, section:'E', stream:'General',         homeTeacher:'Mr. Hadebe',       studentCount:30, capacity:38, subjects:['Tech Maths','English','IsiZulu','Consumer Studies','Business','LO'],         averageMark:62, room:'A-105' },
  { id:'c-11a', name:'11A', grade:11, section:'A', stream:'Pure Sciences',   homeTeacher:'Mr. Dlamini',      studentCount:30, capacity:35, subjects:['Maths','English','IsiZulu','Physics','IT','Accounting','LO'],               averageMark:73, room:'B-101' },
  { id:'c-11b', name:'11B', grade:11, section:'B', stream:'Applied Sciences',homeTeacher:'Ms. van der Merwe',studentCount:29, capacity:35, subjects:['Maths','English','IsiZulu','Life Sciences','Business','LO'],               averageMark:70, room:'B-102' },
  { id:'c-11c', name:'11C', grade:11, section:'C', stream:'Humanities',      homeTeacher:'Ms. Hadebe',       studentCount:28, capacity:35, subjects:['Maths','English','IsiZulu','Geography','History','LO'],                    averageMark:65, room:'B-103' },
  { id:'c-11d', name:'11D', grade:11, section:'D', stream:'Commerce',        homeTeacher:'Ms. Ngubane',      studentCount:27, capacity:35, subjects:['Maths','English','IsiZulu','Accounting','Economics','LO'],                 averageMark:68, room:'B-104' },
  { id:'c-11e', name:'11E', grade:11, section:'E', stream:'General',         homeTeacher:'Mr. Mthembu',      studentCount:26, capacity:35, subjects:['Tech Maths','English','IsiZulu','Consumer Studies','LO'],                  averageMark:61, room:'B-105' },
  { id:'c-12a', name:'12A', grade:12, section:'A', stream:'Pure Sciences',   homeTeacher:'Mrs. Buthelezi',   studentCount:26, capacity:32, subjects:['Maths','English','IsiZulu','Physics','Life Sciences','LO'],               averageMark:78, room:'C-101' },
  { id:'c-12b', name:'12B', grade:12, section:'B', stream:'Commerce',        homeTeacher:'Ms. Ngubane',      studentCount:25, capacity:32, subjects:['Maths','English','IsiZulu','Accounting','Business','LO'],                 averageMark:75, room:'C-102' },
  { id:'c-12c', name:'12C', grade:12, section:'C', stream:'Humanities',      homeTeacher:'Mr. Mthembu',      studentCount:24, capacity:32, subjects:['Maths','English','IsiZulu','Geography','History','LO'],                   averageMark:72, room:'C-103' },
  { id:'c-12d', name:'12D', grade:12, section:'D', stream:'Applied Sciences',homeTeacher:'Mr. Ndlovu',       studentCount:23, capacity:32, subjects:['Maths','English','IsiZulu','Life Sciences','Geog','LO'],                  averageMark:69, room:'C-104' },
  { id:'c-12e', name:'12E', grade:12, section:'E', stream:'General',         homeTeacher:'Mr. Sithole',      studentCount:22, capacity:32, subjects:['Tech Maths','English','IsiZulu','Consumer Studies','LO'],                  averageMark:65, room:'C-105' },
];

export const ADMIN_NOTICES: AdminNotice[] = [
  { id:'n-001', title:'Grade 11 Term 3 Exam Timetable Released', category:'Urgent',   content:'Final examinations for Grade 11 commence 17 November 2025. All learners must report to the examination hall 15 minutes before their scheduled paper. Study guides are available from the library.', target:'Grade 11', priority:'urgent',    publishedDate:'10 Sep 2025', author:'Deputy Principal', active:true,  pinned:true,  views:234, status:'published' },
  { id:'n-002', title:'Annual Prize Giving — 28 November',        category:'Event',    content:'The Annual Sidelile High School Prize Giving Ceremony will be held on Friday, 28 November 2025 at 18:00 in the school hall. Parents and guardians are warmly invited. Smart dress code required.', target:'All',      priority:'important', publishedDate:'8 Sep 2025',  author:'Principal',        active:true,  pinned:false, views:512, status:'published' },
  { id:'n-003', title:'Grade 11 Mathematics Extra Classes',        category:'Academic', content:'Mr. Dlamini will be hosting extra support sessions for Grade 11 Mathematics every Monday and Wednesday from 14:45–16:00 in Room B-101. All Grade 11 learners are encouraged to attend.', target:'Grade 11', priority:'normal',    publishedDate:'6 Sep 2025',  author:'Mr. Dlamini',      active:true,  pinned:false, views:178, status:'published' },
  { id:'n-004', title:'School Fee Final Payment Reminder',         category:'Admin',    content:'Parents are reminded that Term 4 school fees are due by 31 October 2025. Interest of 2% per month will be charged on outstanding balances. Please contact finance@sidelile.edu.za.', target:'All',      priority:'important', publishedDate:'5 Sep 2025',  author:'Finance Office',   active:true,  pinned:false, views:389, status:'published' },
  { id:'n-005', title:'Sappi Innovation Day — Grade 11 & 12',      category:'Event',    content:'Grade 11 and 12 learners are invited to the Sappi Innovation Day on 18 October 2025. The event showcases careers in STEM, forestry, and sustainability. Permission slips due 10 October.', target:'Grade 11', priority:'normal',    publishedDate:'4 Sep 2025',  author:'Mr. Buthelezi',    active:true,  pinned:false, views:143, status:'published' },
  { id:'n-006', title:'Term 4 Academic Calendar (Draft)',          category:'Academic', content:'Term 4 opens Monday 13 October. Final examinations begin 3 November for Grade 12 and 10 November for Grades 8-11. All students must collect their exam timetables from their homeroom teacher.', target:'All',      priority:'normal',    publishedDate:'3 Sep 2025',  author:'School Admin',     active:false, pinned:false, views:0,   status:'draft'     },
];

export const STREAM_STUDENTS: StreamStudent[] = [
  { id:'ss-001', studentNumber:'STU-9A-001', firstName:'Amahle',    lastName:'Bhengu',   currentAverage:88, mathsMark:92, scienceMark:86, pref1:'Pure Sciences',   pref2:'Commerce',        pref3:'General',     recommended:'10A', assignedClass:'10A', status:'assigned' },
  { id:'ss-002', studentNumber:'STU-9A-002', firstName:'Siphokazi', lastName:'Cele',     currentAverage:74, mathsMark:70, scienceMark:76, pref1:'Commerce',         pref2:'Applied Sciences', pref3:'General',     recommended:'10B', assignedClass:null,  status:'pending'  },
  { id:'ss-003', studentNumber:'STU-9A-003', firstName:'Lungani',   lastName:'Dlamini',  currentAverage:82, mathsMark:88, scienceMark:80, pref1:'Pure Sciences',   pref2:'Applied Sciences', pref3:'Commerce',    recommended:'10A', assignedClass:null,  status:'pending'  },
  { id:'ss-004', studentNumber:'STU-9B-001', firstName:'Thandeka',  lastName:'Gumede',   currentAverage:67, mathsMark:61, scienceMark:70, pref1:'Humanities',      pref2:'Commerce',         pref3:'General',     recommended:'10D', assignedClass:'10D', status:'assigned' },
  { id:'ss-005', studentNumber:'STU-9B-002', firstName:'Nkosinathi',lastName:'Hadebe',   currentAverage:79, mathsMark:76, scienceMark:80, pref1:'Commerce',         pref2:'Pure Sciences',    pref3:'General',     recommended:'10C', assignedClass:null,  status:'pending'  },
  { id:'ss-006', studentNumber:'STU-9A-004', firstName:'Zinhle',    lastName:'Khumalo',  currentAverage:91, mathsMark:95, scienceMark:90, pref1:'Pure Sciences',   pref2:'Applied Sciences', pref3:'Commerce',    recommended:'10A', assignedClass:'10A', status:'assigned' },
  { id:'ss-007', studentNumber:'STU-9B-003', firstName:'Mpendulo',  lastName:'Mkhize',   currentAverage:60, mathsMark:55, scienceMark:62, pref1:'Humanities',      pref2:'General',          pref3:'Commerce',    recommended:'10E', assignedClass:null,  status:'pending'  },
  { id:'ss-008', studentNumber:'STU-9A-005', firstName:'Ayanda',    lastName:'Ntanzi',   currentAverage:85, mathsMark:88, scienceMark:82, pref1:'Pure Sciences',   pref2:'Applied Sciences', pref3:'Commerce',    recommended:'10A', assignedClass:null,  status:'pending'  },
  { id:'ss-009', studentNumber:'STU-9C-001', firstName:'Busisiwe',  lastName:'Mthembu',  currentAverage:72, mathsMark:68, scienceMark:74, pref1:'Applied Sciences', pref2:'Commerce',         pref3:'Humanities',  recommended:'10B', assignedClass:null,  status:'pending'  },
  { id:'ss-010', studentNumber:'STU-9C-002', firstName:'Sipho',     lastName:'Nxumalo',  currentAverage:58, mathsMark:52, scienceMark:60, pref1:'General',          pref2:'Humanities',       pref3:'Commerce',    recommended:'10E', assignedClass:null,  status:'pending'  },
  { id:'ss-011', studentNumber:'STU-9B-004', firstName:'Nokwanda',  lastName:'Ntuli',    currentAverage:77, mathsMark:80, scienceMark:75, pref1:'Commerce',         pref2:'Applied Sciences', pref3:'Humanities',  recommended:'10C', assignedClass:null,  status:'pending'  },
  { id:'ss-012', studentNumber:'STU-9A-006', firstName:'Lindani',   lastName:'Mnguni',   currentAverage:83, mathsMark:86, scienceMark:84, pref1:'Pure Sciences',   pref2:'Applied Sciences', pref3:'Commerce',    recommended:'10A', assignedClass:null,  status:'pending'  },
  { id:'ss-013', studentNumber:'STU-9C-003', firstName:'Zanele',    lastName:'Mdlalose', currentAverage:65, mathsMark:58, scienceMark:66, pref1:'Humanities',      pref2:'General',          pref3:'Commerce',    recommended:'10D', assignedClass:null,  status:'pending'  },
  { id:'ss-014', studentNumber:'STU-9D-001', firstName:'Siphelele', lastName:'Xulu',     currentAverage:70, mathsMark:72, scienceMark:68, pref1:'Applied Sciences', pref2:'Commerce',         pref3:'Humanities',  recommended:'10B', assignedClass:null,  status:'pending'  },
  { id:'ss-015', studentNumber:'STU-9D-002', firstName:'Hlengiwe',  lastName:'Zondi',    currentAverage:63, mathsMark:60, scienceMark:64, pref1:'Commerce',         pref2:'Humanities',       pref3:'General',     recommended:'10C', assignedClass:null,  status:'pending'  },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id:'a-001', timestamp:'2025-09-13 09:12', admin:'School Admin',     action:'Approved application', record:'app-003 (Siphamandla Mthembu)', details:'Assigned to Grade 9B. Student number STU-9B-2025-031 generated.',     type:'approve' },
  { id:'a-002', timestamp:'2025-09-13 09:05', admin:'School Admin',     action:'Approved application', record:'app-008 (Thandeka Mkhize)',     details:'Assigned to Grade 10C. Student number STU-10C-2025-018 generated.', type:'approve' },
  { id:'a-003', timestamp:'2025-09-12 14:30', admin:'School Admin',     action:'Rejected application', record:'app-005 (Sibonelo Hadebe)',     details:'Reason: Academic requirements not met (55% average).',             type:'reject'  },
  { id:'a-004', timestamp:'2025-09-12 11:00', admin:'Deputy Principal', action:'Published notice',     record:'n-001 (Exam Timetable)',        details:'Published to Grade 11 students.',                                  type:'create'  },
  { id:'a-005', timestamp:'2025-09-11 08:45', admin:'School Admin',     action:'User login',           record:'admin@sidelile.edu.za',         details:'Successful login from 196.11.22.33',                               type:'login'   },
  { id:'a-006', timestamp:'2025-09-10 15:20', admin:'School Admin',     action:'Assigned stream',      record:'ss-001 (Amahle Bhengu)',        details:'Assigned to Grade 10A (Pure Sciences).',                           type:'update'  },
  { id:'a-007', timestamp:'2025-09-10 15:18', admin:'School Admin',     action:'Assigned stream',      record:'ss-004 (Thandeka Gumede)',      details:'Assigned to Grade 10D (Humanities).',                              type:'update'  },
  { id:'a-008', timestamp:'2025-09-10 15:15', admin:'School Admin',     action:'Assigned stream',      record:'ss-006 (Zinhle Khumalo)',       details:'Assigned to Grade 10A (Pure Sciences).',                           type:'update'  },
  { id:'a-009', timestamp:'2025-09-09 10:00', admin:'School Admin',     action:'Exported report',      record:'Term 3 Marks Report',           details:'Exported as PDF for all grades.',                                  type:'export'  },
  { id:'a-010', timestamp:'2025-09-08 09:30', admin:'Deputy Principal', action:'Updated settings',     record:'Academic Year 2025',            details:'Term 3 end date updated to 26 Sep 2025.',                          type:'update'  },
];

export const SCHOOL_STATS = {
  totalStudents:       1247,
  totalTeachers:       85,
  pendingApplications: APPLICATIONS.filter(a => a.status === 'pending').length,
  schoolAverage:       71,
  passRate:            94,
  attendanceRate:      93,
  totalClasses:        ADMIN_CLASSES.length,
  currentTerm:         3,
  currentYear:         2025,
};
