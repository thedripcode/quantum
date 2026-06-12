// One-time structural seed: subjects, enrollments, Grade 11 timetable.
// No fake marks/attendance — teachers enter those for real.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SUBJECTS = [
  { code: 'math',    name: 'Mathematics',        short: 'MATH', color: '#3B82F6', room: 'A-101' },
  { code: 'physci',  name: 'Physical Sciences',  short: 'SCI',  color: '#8B5CF6', room: 'B-204' },
  { code: 'lifesci', name: 'Life Sciences',      short: 'LIFE', color: '#10B981', room: 'B-201' },
  { code: 'eng',     name: 'English HL',         short: 'ENG',  color: '#F59E0B', room: 'C-103' },
  { code: 'zulu',    name: 'isiZulu FAL',        short: 'ZULU', color: '#EF4444', room: 'C-105' },
  { code: 'geo',     name: 'Geography',          short: 'GEO',  color: '#06B6D4', room: 'A-302' },
  { code: 'it',      name: 'Information Tech',   short: 'IT',   color: '#EC4899', room: 'D-Lab1' },
  { code: 'lo',      name: 'Life Orientation',   short: 'LO',   color: '#84CC16', room: 'C-201' },
];

// Simple Grade 11 weekly rotation (4 lessons/day)
const WEEK = {
  Monday:    ['math', 'eng', 'physci', 'zulu'],
  Tuesday:   ['lifesci', 'math', 'geo', 'it'],
  Wednesday: ['eng', 'physci', 'lo', 'math'],
  Thursday:  ['zulu', 'geo', 'math', 'lifesci'],
  Friday:    ['it', 'eng', 'physci', 'lo'],
};
const TIMES = [
  ['07:30', '08:30'], ['08:30', '09:30'], ['10:00', '11:00'], ['11:00', '12:00'],
];

async function main() {
  // Teachers to assign
  const tch1 = await prisma.user.findFirst({ where: { portalId: 'TCH001' } });
  const tch2 = await prisma.user.findFirst({ where: { portalId: 'TCH002' } });

  // 1. Subjects
  const subjectByCode = {};
  for (let i = 0; i < SUBJECTS.length; i++) {
    const s = SUBJECTS[i];
    const teacherId = i % 2 === 0 ? tch1?.id : tch2?.id;
    subjectByCode[s.code] = await prisma.subject.upsert({
      where: { code: s.code },
      update: { teacherId },
      create: { ...s, teacherId },
    });
  }
  console.log(`Subjects: ${Object.keys(subjectByCode).length}`);

  // 2. Enroll every student in all subjects
  const students = await prisma.user.findMany({ where: { role: 'student' } });
  let enrolled = 0;
  for (const stu of students) {
    for (const code of Object.keys(subjectByCode)) {
      await prisma.enrollment.upsert({
        where: { studentId_subjectId: { studentId: stu.id, subjectId: subjectByCode[code].id } },
        update: {},
        create: { studentId: stu.id, subjectId: subjectByCode[code].id },
      });
      enrolled++;
    }
  }
  console.log(`Enrollments: ${enrolled} (${students.length} students)`);

  // 3. Grade 11 timetable (idempotent: wipe & recreate)
  await prisma.timetableSlot.deleteMany({ where: { grade: 'Grade 11' } });
  let slots = 0;
  for (const [day, codes] of Object.entries(WEEK)) {
    for (let p = 0; p < codes.length; p++) {
      const subj = subjectByCode[codes[p]];
      await prisma.timetableSlot.create({
        data: {
          grade: 'Grade 11', day, period: p + 1,
          time: TIMES[p][0], endTime: TIMES[p][1],
          room: subj.room, subjectId: subj.id,
        },
      });
      slots++;
    }
  }
  console.log(`Timetable slots: ${slots}`);

  // 4. A real welcome notice
  const noticeCount = await prisma.notice.count();
  if (noticeCount === 0) {
    await prisma.notice.create({
      data: {
        title: 'Welcome to the Sidelile Portal',
        body: 'The school portal is now live. Marks, attendance and assignments will appear here as your teachers capture them.',
        audience: 'all',
      },
    });
    console.log('Notice created');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
