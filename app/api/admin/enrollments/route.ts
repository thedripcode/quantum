import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// GET: enrollment matrix for a grade+stream (or all students if no filter)
// ?grade=Grade+10&stream=A
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const grade  = req.nextUrl.searchParams.get('grade');
  const stream = req.nextUrl.searchParams.get('stream');

  const [students, subjects, enrollments] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'student', active: true,
        ...(grade  ? { grade }  : {}),
        ...(stream ? { stream } : {}),
      },
      select: { id: true, name: true, portalId: true, grade: true, stream: true },
      orderBy: { name: 'asc' },
    }),
    prisma.subject.findMany({ select: { id: true, code: true, name: true, short: true, color: true, grades: true }, orderBy: { name: 'asc' } }),
    prisma.enrollment.findMany({ select: { studentId: true, subjectId: true, targetMark: true } }),
  ]);

  // Build a set of "studentId:subjectId" pairs for quick lookup
  const enrolled = new Set(enrollments.map(e => `${e.studentId}:${e.subjectId}`));

  return NextResponse.json({ students, subjects, enrolled: [...enrolled] });
}

// POST: bulk enroll students in subjects
// Body: { studentIds: string[], subjectIds: string[], targetMark?: number }
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { studentIds, subjectIds, targetMark } = await req.json();
    if (!Array.isArray(studentIds) || !Array.isArray(subjectIds) || !studentIds.length || !subjectIds.length) {
      return NextResponse.json({ error: 'studentIds and subjectIds arrays are required.' }, { status: 400 });
    }

    const data = studentIds.flatMap((sid: string) =>
      subjectIds.map((subId: string) => ({ studentId: sid, subjectId: subId, targetMark: targetMark ?? 75 }))
    );

    await prisma.enrollment.createMany({ data, skipDuplicates: true });
    return NextResponse.json({ success: true, created: data.length });
  } catch (err) {
    console.error('Enrollment create error:', err);
    return NextResponse.json({ error: 'Could not create enrollments.' }, { status: 500 });
  }
}

// DELETE: remove specific enrollment
// Body: { studentId, subjectId } or query ?studentId=&subjectId=
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const studentId = req.nextUrl.searchParams.get('studentId');
    const subjectId = req.nextUrl.searchParams.get('subjectId');

    if (studentId && subjectId) {
      await prisma.enrollment.deleteMany({ where: { studentId, subjectId } });
      return NextResponse.json({ success: true });
    }

    // Bulk remove: body with arrays
    const body = await req.json().catch(() => null);
    if (body?.studentIds && body?.subjectIds) {
      for (const sid of body.studentIds) {
        await prisma.enrollment.deleteMany({ where: { studentId: sid, subjectId: { in: body.subjectIds } } });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'studentId and subjectId are required.' }, { status: 400 });
  } catch (err) {
    console.error('Enrollment delete error:', err);
    return NextResponse.json({ error: 'Could not remove enrollment.' }, { status: 500 });
  }
}
