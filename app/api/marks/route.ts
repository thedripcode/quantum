import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Teacher/admin: list recent marks (for review/removal)
export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const marks = await prisma.mark.findMany({
    include: { student: { select: { name: true, portalId: true } }, subject: { select: { name: true, short: true, color: true } } },
    orderBy: { date: 'desc' },
    take: 200,
  });
  return NextResponse.json({
    marks: marks.map(m => ({
      id: m.id, studentName: m.student.name, studentPortalId: m.student.portalId,
      subject: m.subject.name, subjectShort: m.subject.short, color: m.subject.color,
      task: m.task, type: m.type, score: m.score, total: m.total, term: m.term,
      date: m.date.toISOString().slice(0, 10),
    })),
  });
}

// Teacher/admin: delete a mark
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await prisma.mark.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Mark delete error:', err);
    return NextResponse.json({ error: 'Could not delete mark.' }, { status: 500 });
  }
}

// Teacher/admin: capture a mark for a student
// Body: { studentPortalId, subjectCode, task, type?, score, total, weight?, term? }
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentPortalId, subjectCode, task, type, score, total, weight, term } = await req.json();
    if (!studentPortalId || !subjectCode || !task || score == null || total == null) {
      return NextResponse.json({ error: 'studentPortalId, subjectCode, task, score and total are required.' }, { status: 400 });
    }

    const student = await prisma.user.findUnique({ where: { portalId: studentPortalId } });
    if (!student) return NextResponse.json({ error: `Student ${studentPortalId} not found.` }, { status: 404 });

    const subject = await prisma.subject.findUnique({ where: { code: subjectCode } });
    if (!subject) return NextResponse.json({ error: `Subject ${subjectCode} not found.` }, { status: 404 });

    const mark = await prisma.mark.create({
      data: {
        studentId: student.id,
        subjectId: subject.id,
        task,
        type:   type ?? 'Test',
        score:  Number(score),
        total:  Number(total),
        weight: Number(weight ?? 0),
        term:   Number(term ?? 1),
      },
    });

    return NextResponse.json({ success: true, markId: mark.id });
  } catch (err) {
    console.error('Mark capture error:', err);
    return NextResponse.json({ error: 'Could not save mark.' }, { status: 500 });
  }
}
