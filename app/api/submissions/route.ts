import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const pct = (score: number, total: number) => (total > 0 ? Math.round((score / total) * 100) : 0);

// GET — teacher fetches all submissions for their assignments
// ?assignmentId=xxx  to filter by one assignment
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const assignmentId = req.nextUrl.searchParams.get('assignmentId');

  // Build where clause: teacher only sees their own subjects
  const teacherId = session.user.id;
  const teacherSubjects = session.user.role === 'admin'
    ? undefined
    : await prisma.subject.findMany({ where: { teacherId }, select: { id: true } }).then(s => s.map(x => x.id));

  const where: any = {};
  if (assignmentId) {
    where.assignmentId = assignmentId;
  } else if (teacherSubjects) {
    where.assignment = { subjectId: { in: teacherSubjects } };
  }

  const submissions = await prisma.assignmentSubmission.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, portalId: true, grade: true, stream: true } },
      assignment: { include: { subject: { select: { id: true, name: true, short: true, color: true } } } },
    },
    orderBy: [{ assignment: { dueDate: 'desc' } }, { student: { name: 'asc' } }],
  });

  return NextResponse.json({
    submissions: submissions.map(s => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle: s.assignment.title,
      assignmentTotal: s.assignment.total,
      assignmentDue: s.assignment.dueDate.toISOString().slice(0, 10),
      subjectName: s.assignment.subject.name,
      subjectShort: s.assignment.subject.short,
      subjectColor: s.assignment.subject.color,
      student: { id: s.student.id, name: s.student.name, portalId: s.student.portalId, grade: s.student.grade, stream: s.student.stream },
      submittedDate: s.submittedDate?.toISOString().slice(0, 10) ?? null,
      mark: s.mark,
      pct: s.mark != null ? pct(s.mark, s.assignment.total) : null,
      feedback: s.feedback,
      status: s.status,
    })),
  });
}

// POST — student submits an assignment
// Body: { assignmentId }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assignmentId } = await req.json();
    if (!assignmentId) return NextResponse.json({ error: 'assignmentId required.' }, { status: 400 });

    const now = new Date();
    const submission = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId: session.user.id } },
      update: { submittedDate: now, status: 'submitted' },
      create: { assignmentId, studentId: session.user.id, submittedDate: now, status: 'submitted' },
    });

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Could not submit assignment.' }, { status: 500 });
  }
}

// PATCH — teacher grades a submission
// Body: { submissionId, mark, feedback? }
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !['teacher', 'admin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { submissionId, mark, feedback } = await req.json();
    if (!submissionId || mark === undefined) {
      return NextResponse.json({ error: 'submissionId and mark are required.' }, { status: 400 });
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: { mark: Number(mark), feedback: feedback ?? null, status: 'graded' },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (err) {
    console.error('Grade error:', err);
    return NextResponse.json({ error: 'Could not save grade.' }, { status: 500 });
  }
}
