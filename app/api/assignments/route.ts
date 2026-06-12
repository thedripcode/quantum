import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Teacher/admin: list assignments
export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const assignments = await prisma.assignment.findMany({
    include: { subject: { select: { name: true, short: true, color: true } } },
    orderBy: { dueDate: 'desc' },
    take: 100,
  });
  return NextResponse.json({
    assignments: assignments.map(a => ({
      id: a.id, subject: a.subject.name, subjectShort: a.subject.short, color: a.subject.color,
      title: a.title, type: a.type, dueDate: a.dueDate.toISOString().slice(0, 10),
      total: a.total, priority: a.priority,
    })),
  });
}

// Teacher/admin: delete an assignment
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Assignment delete error:', err);
    return NextResponse.json({ error: 'Could not delete assignment.' }, { status: 500 });
  }
}

// Teacher/admin: post an assignment for a subject
// Body: { subjectCode, title, description?, type?, dueDate (YYYY-MM-DD), total?, priority? }
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subjectCode, title, description, type, dueDate, total, priority } = await req.json();
    if (!subjectCode || !title?.trim() || !dueDate) {
      return NextResponse.json({ error: 'Subject, title and due date are required.' }, { status: 400 });
    }

    const subject = await prisma.subject.findUnique({ where: { code: subjectCode } });
    if (!subject) return NextResponse.json({ error: `Subject ${subjectCode} not found.` }, { status: 404 });

    const assignment = await prisma.assignment.create({
      data: {
        subjectId: subject.id,
        title: title.trim(),
        description: description?.trim() || null,
        type: type ?? 'Assignment',
        dueDate: new Date(dueDate + 'T00:00:00.000Z'),
        total: Number(total ?? 100),
        priority: priority ?? 'medium',
      },
    });

    return NextResponse.json({ success: true, assignmentId: assignment.id });
  } catch (err) {
    console.error('Assignment create error:', err);
    return NextResponse.json({ error: 'Could not create assignment.' }, { status: 500 });
  }
}
