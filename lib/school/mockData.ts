// ─── Full school data generator ───────────────────────────────────────────────
// Deterministic: same seed → same student name, marks, attendance every render.
// Covers Grade 8–12 with all defined classes and SA-diverse student names.

import type { GradeLevel, ClassSection, RiskLevel, GradeData, ClassData, StudentFull } from '@/types/school';
import { getSubjectIdsForClass } from './subjects';

// ─── Name pools ───────────────────────────────────────────────────────────────

const MALE_FIRST = [
  'Sipho','Thabo','Lungelo','Bongani','Siyanda','Mandla','Sibusiso','Lwazi',
  'Mpendulo','Sanele','Khulekani','Jabulani','Musa','Sifiso','Banele','Thulani',
  'Senzo','Nhlanhla','Simphiwe','Mthokozisi','Kabelo','Katlego','Tshepo',
  'Tumelo','Lebogang','Motheo','Tlotlo','Ruan','Stefan','Pietrus','Wessel',
  'Francois','Arno','Jannie','Krishen','Yusuf','Imraan','Shaheed','Roshan',
  'Kavish','Devon','Wesley','Craig','Nathan','Aiden','Keanu','Sanele',
];

const FEMALE_FIRST = [
  'Amahle','Nomvula','Zanele','Ntombi','Precious','Thandeka','Nokwanda',
  'Nompumelelo','Sithembile','Nosipho','Nonhlanhla','Sindisiwe','Nokukhanya',
  'Ntombifikile','Naledi','Khanyi','Refilwe','Dineo','Pontsho','Nthabiseng',
  'Liesl','Anneke','Chloë','Maret','Bianca','Yolande','Anriette','Riana',
  'Ayesha','Fatima','Kavya','Priya','Anita','Sashika','Nadia','Yashika',
  'Jade','Emma','Layla','Tayla','Samantha','Monique','Lethiwe','Snenhlanhla',
];

const SURNAMES = [
  'Dlamini','Nkosi','Mthembu','Zulu','Khumalo','Ngcobo','Cele','Mkhize',
  'Shabalala','Ntuli','Mhlongo','Msweli','Myeni','Khoza','Sithole','Majola',
  'Ndlela','Mbatha','Zwane','Vilakazi','Hadebe','Gumbi','Nzama','Xulu',
  'Mthethwa','Mokoena','Molefe','Mahlangu','Motsepe','Tau','Masondo','Matlala',
  'Mudau','Mukhuba','Botha','van Wyk','Pretorius','du Preez','Swanepoel',
  'Ferreira','van Heerden','Fourie','Venter','du Plessis','Kruger','Steyn',
  'Naidoo','Pillay','Govender','Patel','Essop','Reddy','Singh','Moodley',
  'Jacobs','Adams','September','Fortune','Solomons','Davids','Williams','Brown',
];

const HOME_LANGUAGES = [
  'Zulu','Zulu','Zulu','Zulu',        // ~40%
  'Xhosa','Xhosa',                    // ~15%
  'Sotho','Tswana',                   // ~15%
  'Afrikaans','Afrikaans',            // ~15%
  'English',                          // ~8%
  'Hindi','Tamil','Venda','Portuguese',// ~7%
];

const EMAIL_DOMAINS  = ['gmail.com','yahoo.com','outlook.com','telkomsa.net','mweb.co.za','webmail.co.za'];
const STREET_NAMES   = ['Mandela Ave','Ubuntu St','Freedom Dr','Soyiso Rd','Protea St','Baobab Cl','Acacia Dr','Nelson St'];
const TOWNS          = ['Limpopo','Polokwane','Mokopane','Bela-Bela','Tzaneen','Thohoyandou','Musina','Lebowakgomo'];
const ROOMS          = { 8:'A',9:'A',10:'B',11:'C',12:'D' };

// ─── Seeded random ────────────────────────────────────────────────────────────

function sr(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return (x - Math.floor(x));
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(sr(seed) * arr.length)];
}

// ─── Risk calculation ─────────────────────────────────────────────────────────

function calcRisk(avg: number, att: number): RiskLevel {
  if (avg < 30 || att < 60)  return 'critical';
  if (avg < 40 || att < 75)  return 'high';
  if (avg < 50 || att < 85)  return 'moderate';
  if (avg >= 70)             return 'excelling';
  return 'on-track';
}

// ─── Student generator ────────────────────────────────────────────────────────

function generateStudent(
  grade: number, section: string, idx: number,
): StudentFull {
  // Unique seed per student
  const s = (grade * 1000 + section.charCodeAt(0) * 50 + idx + 1) * 7919;

  const isMale    = sr(s) < 0.5;
  const firstName = pick(isMale ? MALE_FIRST : FEMALE_FIRST, s + 1);
  const lastName  = pick(SURNAMES, s + 2);

  // Ability profile 0–1 determines marks and attendance
  const ability = sr(s + 3);
  const rawAvg  = ability * 65 + 20 + (sr(s+4) - 0.5) * 18;
  const avg     = Math.max(10, Math.min(97, Math.round(rawAvg)));

  const rawAtt  = (ability * 0.28 + 0.65) + (sr(s+5) - 0.5) * 0.12;
  const att     = Math.max(45, Math.min(100, Math.round(rawAtt * 100)));

  const risk   = calcRisk(avg, att);
  const pNum   = `STU-${grade}${section}-${String(idx + 1).padStart(3,'0')}`;
  const bYear  = 2024 - (grade - 8 + 13);
  const bMonth = Math.floor(sr(s+6) * 12) + 1;
  const bDay   = Math.floor(sr(s+7) * 28) + 1;
  const slug   = lastName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5);
  const phone  = `+27 7${Math.floor(sr(s+10)*9)+1} ${String(Math.floor(sr(s+11)*9000000)+1000000)}`;
  const emPhone= `+27 8${Math.floor(sr(s+18)*9)+1} ${String(Math.floor(sr(s+19)*9000000)+1000000)}`;

  return {
    id:               `gs-${grade}${section}-${idx + 1}`,
    studentNumber:    pNum,
    firstName,
    lastName,
    fullName:         `${lastName}, ${firstName}`,
    grade:            grade as GradeLevel,
    classId:          `${grade}${section}`,
    classSection:     section as ClassSection,
    dateOfBirth:      `${bYear}-${String(bMonth).padStart(2,'0')}-${String(bDay).padStart(2,'0')}`,
    gender:           isMale ? 'male' : 'female',
    homeLanguage:     pick(HOME_LANGUAGES, s + 8),
    parentName:       `${pick(isMale ? FEMALE_FIRST : MALE_FIRST, s+9)} ${lastName}`,
    parentContact:    phone,
    parentEmail:      `${slug}${Math.floor(sr(s+12)*99)+1}@${pick(EMAIL_DOMAINS, s+13)}`,
    address:          `${Math.floor(sr(s+14)*200)+1} ${pick(STREET_NAMES, s+15)}, ${pick(TOWNS, s+16)}`,
    emergencyContact: `${pick(MALE_FIRST, s+17)} ${lastName}`,
    emergencyNumber:  emPhone,
    riskLevel:        risk,
    averageMark:      avg,
    attendanceRate:   att,
    enrolledDate:     `${2024 - (grade - 8)}-01-15`,
    isActive:         true,
  };
}

// ─── Student count per class (deterministic, 8–12 range) ─────────────────────

function studentCount(grade: number, section: string): number {
  const s = (grade * 31 + section.charCodeAt(0)) * 1009;
  return grade <= 9
    ? Math.floor(sr(s) * 3) + 10   // 10–12
    : Math.floor(sr(s) * 5) + 8;   // 8–12
}

// ─── Class room assignment ────────────────────────────────────────────────────

function getRoom(grade: number, section: string): string {
  const prefix = ROOMS[grade as keyof typeof ROOMS] ?? 'X';
  const num    = (section.charCodeAt(0) - 65 + 1);
  return `${prefix}${String(num).padStart(2, '0')}`;
}

// ─── Teacher assignment ───────────────────────────────────────────────────────
// Mr. Nkosi (t-001) is assigned Mathematics to 10B, 11A, 12D.
// All other classes get placeholder IDs.

const NKOSI_CLASSES = new Set(['10B', '11A', '12D']);

function teacherId(classId: string): string {
  return NKOSI_CLASSES.has(classId) ? 't-001' : `t-${classId.toLowerCase()}`;
}

// ─── Grade & section definitions ─────────────────────────────────────────────

const GR89_SECTIONS  : ClassSection[] = ['A','B','C','D','E'];
const GR1012_SECTIONS: ClassSection[] = ['A','B','C','D','E','F','G','H','I','J'];

// ─── Build full school data ───────────────────────────────────────────────────

export const SCHOOL_GRADES: GradeData[] = ([8,9,10,11,12] as GradeLevel[]).map(grade => {
  const sections = grade <= 9 ? GR89_SECTIONS : GR1012_SECTIONS;
  const classes: ClassData[] = sections.map(section => {
    const id      = `${grade}${section}`;
    const count   = studentCount(grade, section);
    const subjIds = getSubjectIdsForClass(grade, section);
    return {
      id,
      grade,
      section,
      subjectIds:        subjIds,
      studentIds:        Array.from({ length: count }, (_, i) => `gs-${grade}${section}-${i+1}`),
      assignedTeacherId: teacherId(id),
      room:              getRoom(grade, section),
      studentCount:      count,
    };
  });
  return { level: grade, classes };
});

// ─── Flat student registry ────────────────────────────────────────────────────
// Lazily accessed via helper — avoids generating 400+ objects at module init.

const _studentCache = new Map<string, StudentFull>();

export function getStudent(id: string): StudentFull | undefined {
  if (_studentCache.has(id)) return _studentCache.get(id);
  // Parse id: "gs-10B-3"
  const m = id.match(/^gs-(\d+)([A-J])-(\d+)$/);
  if (!m) return undefined;
  const [, gr, sec, idx] = m;
  const s = generateStudent(parseInt(gr), sec, parseInt(idx) - 1);
  _studentCache.set(id, s);
  return s;
}

export function getStudentsForClass(classId: string): StudentFull[] {
  const [, gr, sec] = classId.match(/^(\d+)([A-J])$/) ?? [];
  if (!gr) return [];
  const grade   = parseInt(gr);
  const gradeData = SCHOOL_GRADES.find(g => g.level === grade);
  const cls     = gradeData?.classes.find(c => c.section === sec);
  if (!cls) return [];
  return cls.studentIds.map(id => getStudent(id)).filter(Boolean) as StudentFull[];
}

export function getClass(classId: string): ClassData | undefined {
  for (const g of SCHOOL_GRADES) {
    const c = g.classes.find(cl => cl.id === classId);
    if (c) return c;
  }
  return undefined;
}

// ─── School-wide aggregates ───────────────────────────────────────────────────

export const SCHOOL_STATS = {
  totalGrades:   5,
  totalClasses:  SCHOOL_GRADES.reduce((a, g) => a + g.classes.length, 0),
  totalStudents: SCHOOL_GRADES.reduce((a, g) =>
    a + g.classes.reduce((b, c) => b + c.studentCount, 0), 0),
};
