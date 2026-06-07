import type { SubjectDef, GradeLevel } from '@/types/school';

// ─── All subjects at Sidelile High School ─────────────────────────────────────

export const ALL_SUBJECTS: SubjectDef[] = [
  // ── Grade 8–9 compulsory (same 9 subjects for all classes A–E) ──────────────
  { id:'eng-hl',   code:'ENG_HL',   name:'English Home Language',             shortName:'English',  isCompulsory:true,  gradeRange:[8,9,10,11,12], passMark:40 },
  { id:'zul-hl',   code:'ZUL_HL',   name:'Zulu Home Language',                shortName:'Zulu',     isCompulsory:true,  gradeRange:[8,9,10,11,12], passMark:40 },
  { id:'lo',       code:'LIFE_ORI', name:'Life Orientation',                  shortName:'LO',       isCompulsory:true,  gradeRange:[8,9,10,11,12], passMark:30 },
  { id:'math-89',  code:'MATH',     name:'Mathematics',                       shortName:'Maths',    isCompulsory:true,  gradeRange:[8,9],           passMark:30 },
  { id:'nat-sci',  code:'NAT_SCI',  name:'Natural Sciences',                  shortName:'Nat Sci',  isCompulsory:true,  gradeRange:[8,9],           passMark:30 },
  { id:'soc-sci',  code:'SOC_SCI',  name:'Social Sciences',                   shortName:'Soc Sci',  isCompulsory:true,  gradeRange:[8,9],           passMark:30 },
  { id:'ems',      code:'EMS',      name:'Economic & Management Sciences',     shortName:'EMS',      isCompulsory:true,  gradeRange:[8,9],           passMark:30 },
  { id:'tech',     code:'TECH',     name:'Technology',                        shortName:'Tech',     isCompulsory:true,  gradeRange:[8,9],           passMark:30 },
  { id:'arts',     code:'ARTS',     name:'Creative Arts',                     shortName:'Arts',     isCompulsory:true,  gradeRange:[8,9],           passMark:30 },

  // ── Grade 10–12 elective subjects ───────────────────────────────────────────
  { id:'math-hi',  code:'MATH',     name:'Mathematics',                       shortName:'Maths',    isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'math-lit', code:'MATH_LIT', name:'Mathematical Literacy',             shortName:'Maths Lit',isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'phy-sci',  code:'PHY_SCI',  name:'Physical Sciences',                 shortName:'Phy Sci',  isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'life-sci', code:'LIFE_SCI', name:'Life Sciences',                     shortName:'Life Sci', isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'geo',      code:'GEO',      name:'Geography',                         shortName:'Geog',     isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'hist',     code:'HIST',     name:'History',                           shortName:'Hist',     isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'acc',      code:'ACC',      name:'Accounting',                        shortName:'Acc',      isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'it',       code:'IT',       name:'Information Technology',            shortName:'IT',       isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'bus-stu',  code:'BUS_STU',  name:'Business Studies',                  shortName:'Bus Stud', isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'econ',     code:'ECON',     name:'Economics',                         shortName:'Econ',     isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'con-stu',  code:'CON_STU',  name:'Consumer Studies',                  shortName:'Con Stud', isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
  { id:'tourism',  code:'TOURISM',  name:'Tourism',                           shortName:'Tourism',  isCompulsory:false, gradeRange:[10,11,12],      passMark:30 },
];

export const SUBJECT_MAP = new Map(ALL_SUBJECTS.map(s => [s.id, s]));

// ── Grade 8–9: all 9 compulsory subjects ───────────────────────────────────────
export const GR89_SUBJECT_IDS: string[] = [
  'eng-hl','zul-hl','math-89','nat-sci','soc-sci','lo','ems','tech','arts',
];

// ── Grade 10–12 compulsory + electives by section ─────────────────────────────
export const GR1012_COMPULSORY: string[] = ['eng-hl', 'zul-hl', 'lo'];

export const GR1012_ELECTIVES: Record<string, string[]> = {
  A: ['math-hi',  'phy-sci',  'life-sci', 'it'      ],
  B: ['math-hi',  'phy-sci',  'life-sci', 'acc'     ],
  C: ['math-hi',  'phy-sci',  'geo',      'acc'     ],
  D: ['math-hi',  'life-sci', 'geo',      'it'      ],
  E: ['math-lit', 'hist',     'geo',      'con-stu' ],
  F: ['math-lit', 'hist',     'con-stu',  'it'      ],
  G: ['math-lit', 'geo',      'con-stu',  'bus-stu' ],
  H: ['math-lit', 'hist',     'bus-stu',  'econ'    ],
  I: ['math-lit', 'con-stu',  'econ',     'tourism' ],
  J: ['math-lit', 'hist',     'tourism',  'bus-stu' ],
};

export function getSubjectIdsForClass(grade: GradeLevel, section: string): string[] {
  if (grade <= 9) return GR89_SUBJECT_IDS;
  return [...GR1012_COMPULSORY, ...(GR1012_ELECTIVES[section] ?? [])];
}

export function getSubjectName(id: string): string {
  return SUBJECT_MAP.get(id)?.shortName ?? id;
}
