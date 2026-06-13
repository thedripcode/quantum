import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'parent') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parentId = session.user.id;
  const parent = await (prisma.user.findUnique as any)({ where: { id: parentId }, select: { linkedStudentId: true } });
  const studentId = parent?.linkedStudentId;

  if (!studentId) {
    return NextResponse.json({ linked: false, student: null });
  }

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { id: true, name: true, portalId: true, grade: true, stream: true, schoolEmail: true, active: true },
  });

  if (!student) return NextResponse.json({ linked: false, student: null });

  // Enrollments + subjects
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: { subject: true },
  });

  // All marks
  const marks = await prisma.mark.findMany({
    where: { studentId },
    include: { subject: { select: { id: true, name: true, short: true, color: true, code: true } } },
    orderBy: [{ term: 'asc' }, { date: 'asc' }],
  });

  // Attendance
  const attendance = await prisma.attendanceRecord.findMany({
    where: { studentId },
    orderBy: { date: 'desc' },
    take: 90,
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : null;

  // Per-subject averages
  const subjectMap: Record<string, { name: string; short: string; color: string; marks: { score: number; total: number; term: number }[] }> = {};
  for (const m of marks) {
    const key = m.subjectId;
    if (!subjectMap[key]) {
      subjectMap[key] = { name: m.subject.name, short: m.subject.short, color: m.subject.color, marks: [] };
    }
    subjectMap[key].marks.push({ score: m.score, total: m.total, term: m.term });
  }

  const subjects = Object.entries(subjectMap).map(([id, s]) => {
    const pct = s.marks.length
      ? Math.round((s.marks.reduce((a, m) => a + m.score / m.total, 0) / s.marks.length) * 100)
      : null;
    return { id, name: s.name, short: s.short, color: s.color, average: pct, markCount: s.marks.length };
  });

  const overallAvg = subjects.filter(s => s.average !== null).length > 0
    ? Math.round(subjects.filter(s => s.average !== null).reduce((a, s) => a + (s.average ?? 0), 0) / subjects.filter(s => s.average !== null).length)
    : null;

  // Notices for parents / all
  const notices = await prisma.notice.findMany({
    where: { audience: { in: ['all', 'parents'] } },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    take: 20,
  });

  return NextResponse.json({
    linked: true,
    student,
    subjects,
    overallAvg,
    marks: marks.map(m => ({
      id: m.id,
      task: m.task,
      type: m.type,
      score: m.score,
      total: m.total,
      pct: Math.round((m.score / m.total) * 100),
      term: m.term,
      date: m.date,
      subjectName: m.subject.name,
      subjectShort: m.subject.short,
      subjectColor: m.subject.color,
    })),
    attendance: {
      records: attendance,
      totalDays,
      presentDays,
      attendancePct,
    },
    notices,
  });
}
