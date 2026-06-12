import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const pct = (score: number, total: number) => (total > 0 ? Math.round((score / total) * 100) : 0);

// Everything the student dashboard pages need, shaped like the old mock data.
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const grade  = (session.user as any).grade ?? 'Grade 11';

  const [enrollments, allMarks, attendance, notices, timetableSlots] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: userId },
      include: { subject: { include: { teacher: true, assignments: { include: { submissions: { where: { studentId: userId } } }, orderBy: { dueDate: 'asc' } } } } },
    }),
    prisma.mark.findMany({ where: { studentId: userId }, orderBy: { date: 'asc' } }),
    prisma.attendanceRecord.findMany({ where: { studentId: userId }, orderBy: { date: 'asc' } }),
    prisma.notice.findMany({ orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }], take: 30 }),
    prisma.timetableSlot.findMany({ where: { grade }, include: { subject: { include: { teacher: true } } }, orderBy: [{ day: 'asc' }, { period: 'asc' }] }),
  ]);

  // Class stats per subject (all students' marks)
  const subjectIds = enrollments.map(e => e.subjectId);
  const classMarks = await prisma.mark.findMany({ where: { subjectId: { in: subjectIds } } });

  const today = new Date();

  const subjects = enrollments.map(({ subject, targetMark }) => {
    const marks = allMarks.filter(m => m.subjectId === subject.id);
    const currentMark = marks.length ? Math.round(marks.reduce((s, m) => s + pct(m.score, m.total), 0) / marks.length) : 0;

    // Term averages
    const terms = [...new Set(marks.map(m => m.term))].sort();
    const termAverages = terms.map(term => {
      const tm = marks.filter(m => m.term === term);
      return { term, average: Math.round(tm.reduce((s, m) => s + pct(m.score, m.total), 0) / tm.length) };
    });

    // Class stats
    const cm = classMarks.filter(m => m.subjectId === subject.id);
    const perStudent: Record<string, number[]> = {};
    cm.forEach(m => { (perStudent[m.studentId] ??= []).push(pct(m.score, m.total)); });
    const studentAvgs = Object.values(perStudent).map(a => Math.round(a.reduce((x, y) => x + y, 0) / a.length));
    const classAverage   = studentAvgs.length ? Math.round(studentAvgs.reduce((x, y) => x + y, 0) / studentAvgs.length) : 0;
    const highestInClass = studentAvgs.length ? Math.max(...studentAvgs) : 0;
    const lowestInClass  = studentAvgs.length ? Math.min(...studentAvgs) : 0;

    const nextAsgn = subject.assignments.find(a => new Date(a.dueDate) >= today);

    return {
      id: subject.code,
      name: subject.name,
      short: subject.short,
      teacher: subject.teacher?.name ?? 'TBA',
      teacherEmail: subject.teacher?.email ?? '',
      teacherInitials: (subject.teacher?.name ?? 'T B').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      room: subject.room ?? '—',
      color: subject.color,
      currentMark,
      targetMark,
      isAtRisk: marks.length > 0 && currentMark < 60,
      termAverages,
      marks: marks.map(m => ({ task: m.task, type: m.type, mark: m.score, score: m.score, total: m.total, percentage: pct(m.score, m.total), weight: m.weight, term: m.term, date: m.date.toISOString().slice(0, 10) })),
      classAverage,
      highestInClass,
      lowestInClass,
      attendance: 0, // per-subject attendance not tracked (daily register model)
      nextAssessment: nextAsgn ? { task: nextAsgn.title, date: nextAsgn.dueDate.toISOString().slice(0, 10), weight: 0 } : null,
    };
  });

  const withMarks = subjects.filter(s => s.marks.length > 0);
  const overallAverage = withMarks.length ? Math.round(withMarks.reduce((s, x) => s + x.currentMark, 0) / withMarks.length) : 0;

  // Assignments flattened
  const assignments = enrollments.flatMap(({ subject }) =>
    subject.assignments.map(a => {
      const sub = a.submissions[0];
      const overdue = !sub?.submittedDate && new Date(a.dueDate) < today;
      return {
        id: a.id,
        subjectId: subject.code,
        subject: subject.name,
        subjectColor: subject.color,
        title: a.title,
        description: a.description ?? '',
        type: a.type,
        dueDate: a.dueDate.toISOString().slice(0, 10),
        submittedDate: sub?.submittedDate?.toISOString().slice(0, 10) ?? null,
        status: sub?.mark != null ? 'graded' : sub?.submittedDate ? 'submitted' : overdue ? 'overdue' : 'pending',
        mark: sub?.mark ?? null,
        total: a.total,
        feedback: sub?.feedback ?? null,
        priority: a.priority,
      };
    })
  );

  // Attendance
  const counts = { present: 0, absent: 0, late: 0, excused: 0 } as Record<string, number>;
  attendance.forEach(r => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
  const attended = counts.present + counts.late;
  const overallAttendance = {
    attended,
    total: attendance.length,
    percentage: attendance.length ? Math.round((attended / attendance.length) * 1000) / 10 : 0,
  };

  const monthly: Record<string, { days: number; attended: number }> = {};
  attendance.forEach(r => {
    const key = r.date.toLocaleDateString('en-ZA', { month: 'short' });
    monthly[key] ??= { days: 0, attended: 0 };
    monthly[key].days++;
    if (r.status === 'present' || r.status === 'late') monthly[key].attended++;
  });
  const monthlyAttendance = Object.entries(monthly).map(([month, v]) => ({
    month, days: v.days, attended: v.attended, percentage: Math.round((v.attended / v.days) * 100),
  }));

  // Streak: consecutive most-recent records that are present/late
  let streak = 0;
  for (let i = attendance.length - 1; i >= 0; i--) {
    if (attendance[i].status === 'present' || attendance[i].status === 'late') streak++;
    else break;
  }

  // Timetable
  const timetable = timetableSlots.map(t => ({
    day: t.day, period: t.period, time: t.time, endTime: t.endTime,
    subject: t.subject.name, subjectId: t.subject.code,
    teacher: t.subject.teacher?.name ?? 'TBA', room: t.room ?? '—',
    color: t.subject.color, type: 'Lesson' as const,
  }));

  return NextResponse.json({
    subjects,
    assignments,
    overallAverage,
    atRiskSubjects: subjects.filter(s => s.isAtRisk),
    currentStreak: streak,
    timetable,
    attendanceRecords: attendance.map(r => ({ date: r.date.toISOString().slice(0, 10), status: r.status, note: r.note ?? '' })),
    overallAttendance,
    monthlyAttendance,
    notices: notices.map(n => ({
      id: n.id, category: n.category, title: n.title, body: n.body,
      date: n.createdAt.toISOString().slice(0, 10),
      author: n.author ?? 'School Office', pinned: n.pinned,
    })),
  });
}
