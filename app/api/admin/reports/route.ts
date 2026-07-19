import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// GET /api/admin/reports — real data for every report type, computed in one pass
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [settings, students, teachers, applications, attendance] = await Promise.all([
    prisma.schoolSettings.upsert({ where: { id: 'main' }, update: {}, create: { id: 'main' } }),
    prisma.user.findMany({
      where: { role: 'student', active: true },
      select: {
        id: true, name: true, grade: true,
        marks: { select: { score: true, total: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: 'teacher', active: true },
      select: {
        id: true, name: true,
        taughtSubjects: { select: { id: true, name: true, _count: { select: { enrollments: true, marks: true } } } },
      },
    }),
    prisma.application.findMany({ select: { status: true } }),
    prisma.attendanceRecord.findMany({
      select: { status: true, student: { select: { grade: true } } },
    }),
  ]);

  const passMark = settings.passMark;

  // Per-student average over graded marks only
  const withAvg = students.map(s => {
    const graded = s.marks.filter(m => m.total > 0);
    const avg = graded.length
      ? graded.reduce((sum, m) => sum + (m.score / m.total) * 100, 0) / graded.length
      : null;
    return { ...s, avg };
  });

  const gradedStudents = withAvg.filter(s => s.avg !== null) as (typeof withAvg[number] & { avg: number })[];
  const schoolAvg = gradedStudents.length
    ? Math.round(gradedStudents.reduce((a, s) => a + s.avg, 0) / gradedStudents.length)
    : null;
  const atRisk = gradedStudents.filter(s => s.avg < passMark).length;

  // Performance per grade
  const performance = GRADES.map(grade => {
    const inGrade = withAvg.filter(s => s.grade === grade);
    const graded = inGrade.filter(s => s.avg !== null) as typeof gradedStudents;
    return {
      grade,
      students: inGrade.length,
      avg: graded.length ? Math.round(graded.reduce((a, s) => a + s.avg, 0) / graded.length) : null,
      passRate: graded.length ? Math.round((graded.filter(s => s.avg >= passMark).length / graded.length) * 100) : null,
    };
  });

  // Attendance per grade
  const attendanceByGrade = GRADES.map(grade => {
    const recs = attendance.filter(a => a.student?.grade === grade);
    const present = recs.filter(a => a.status === 'present' || a.status === 'late').length;
    return {
      grade,
      records: recs.length,
      rate: recs.length ? Math.round((present / recs.length) * 100) : null,
    };
  });

  // Applications by status
  const appCounts: Record<string, number> = {};
  for (const a of applications) appCounts[a.status] = (appCounts[a.status] ?? 0) + 1;

  // Teacher load
  const teacherLoad = teachers.map(t => ({
    name: t.name,
    subjects: t.taughtSubjects.length,
    subjectNames: t.taughtSubjects.map(s => s.name),
    learners: t.taughtSubjects.reduce((a, s) => a + s._count.enrollments, 0),
    marksCaptured: t.taughtSubjects.reduce((a, s) => a + s._count.marks, 0),
  }));

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    passMark,
    stats: {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      schoolAvg,
      atRisk,
      pendingApplications: appCounts['Pending'] ?? 0,
    },
    performance,
    attendance: attendanceByGrade,
    applications: appCounts,
    teacherLoad,
    studentDetail: withAvg.map(s => ({
      name: s.name, grade: s.grade,
      avg: s.avg === null ? null : Math.round(s.avg),
      marksCount: s.marks.filter(m => m.total > 0).length,
    })),
  });
}
