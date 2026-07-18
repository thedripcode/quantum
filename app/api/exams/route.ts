import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET /api/exams?grade=Grade+11&term=1&year=2026
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const grade = searchParams.get('grade');
  const term  = searchParams.get('term');
  const year  = searchParams.get('year');

  const where: any = {};
  if (grade) where.grade = grade;
  if (term)  where.term  = Number(term);
  if (year)  where.year  = Number(year);

  const exams = await prisma.exam.findMany({
    where,
    include: { subject: { select: { id: true, name: true, short: true, color: true, code: true } } },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });

  return NextResponse.json({ exams });
}

// POST /api/exams  — teacher or admin
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subjectId, grade, term, year, date, startTime, endTime, venue, totalMarks, notes } = await req.json();
    if (!subjectId || !grade || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'subjectId, grade, date, startTime and endTime are required.' }, { status: 400 });
    }

    if (role === 'teacher') {
      const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
      if (!subject || subject.teacherId !== session.user.id) {
        return NextResponse.json({ error: 'You can only schedule exams for your own subjects.' }, { status: 403 });
      }
    }

    const exam = await prisma.exam.create({
      data: {
        subjectId,
        grade,
        term:       Number(term ?? 1),
        year:       Number(year ?? new Date().getFullYear()),
        date:       new Date(date),
        startTime,
        endTime,
        venue:      venue?.trim() || null,
        totalMarks: Number(totalMarks ?? 100),
        notes:      notes?.trim() || null,
      },
      include: { subject: { select: { id: true, name: true, short: true, color: true, code: true } } },
    });

    return NextResponse.json({ success: true, exam });
  } catch (err) {
    console.error('Exam create error:', err);
    return NextResponse.json({ error: 'Could not create exam.' }, { status: 500 });
  }
}

// DELETE /api/exams?id=xxx
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required.' }, { status: 400 });

  try {
    if (role === 'teacher') {
      const exam = await prisma.exam.findUnique({ where: { id }, include: { subject: true } });
      if (!exam) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
      if (exam.subject.teacherId !== session.user.id) {
        return NextResponse.json({ error: 'Not your exam.' }, { status: 403 });
      }
    }
    await prisma.exam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Exam delete error:', err);
    return NextResponse.json({ error: 'Could not delete exam.' }, { status: 500 });
  }
}
