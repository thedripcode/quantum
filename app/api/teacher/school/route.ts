import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

// GET /api/teacher/school — the real school: grades → class sections → students,
// with per-student averages and attendance. Teacher or admin.
export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [students, subjects] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'student', active: true },
      select: {
        id: true, name: true, portalId: true, grade: true, stream: true,
        marks: { select: { score: true, total: true } },
        attendanceRecords: { select: { status: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.subject.findMany({ select: { name: true, short: true, grades: true } }),
  ]);

  const enriched = students.map(s => {
    const graded = s.marks.filter(m => m.total > 0);
    const avg = graded.length
      ? Math.round(graded.reduce((sum, m) => sum + (m.score / m.total) * 100, 0) / graded.length)
      : null;
    const att = s.attendanceRecords;
    const present = att.filter(a => a.status === 'present' || a.status === 'late').length;
    const attendanceRate = att.length ? Math.round((present / att.length) * 100) : null;
    return {
      id: s.id, name: s.name, portalId: s.portalId,
      grade: s.grade, stream: s.stream,
      avg, attendanceRate, gradedCount: graded.length,
    };
  });

  const grades = GRADES.map(grade => {
    const inGrade = enriched.filter(s => s.grade === grade);
    const gradeNum = grade.replace('Grade ', '');

    const streams = Array.from(new Set(inGrade.map(s => s.stream ?? ''))).sort();
    const sections = streams.map(stream => {
      const sectionStudents = inGrade.filter(s => (s.stream ?? '') === stream);
      return {
        id: `${gradeNum}-${stream || 'unassigned'}`,
        label: stream ? `${gradeNum}${stream}` : `${gradeNum} (no section)`,
        stream: stream || null,
        students: sectionStudents,
      };
    });

    // A subject with no grade list is offered school-wide
    const subjectCount = subjects.filter(su =>
      su.grades.trim() === '' || su.grades.split(',').map(g => g.trim()).includes(grade)
    ).length;

    return { grade, gradeNum, total: inGrade.length, subjectCount, sections };
  });

  return NextResponse.json({
    totalStudents: enriched.length,
    totalClasses: grades.reduce((a, g) => a + g.sections.length, 0),
    grades,
  });
}
