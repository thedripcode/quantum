import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// List subjects with teacher + enrollment counts
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const subjects = await prisma.subject.findMany({
    include: { teacher: { select: { name: true, portalId: true } }, _count: { select: { enrollments: true, marks: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({
    subjects: subjects.map(s => ({
      id: s.id, code: s.code, name: s.name, short: s.short, color: s.color, room: s.room,
      teacherName: s.teacher?.name ?? null, teacherPortalId: s.teacher?.portalId ?? null,
      enrollments: s._count.enrollments, marks: s._count.marks,
    })),
  });
}

// Create a subject (and enroll all students)
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { code, name, short, color, room, teacherPortalId } = await req.json();
    if (!code?.trim() || !name?.trim() || !short?.trim()) {
      return NextResponse.json({ error: 'Code, name and short label are required.' }, { status: 400 });
    }
    const existing = await prisma.subject.findUnique({ where: { code: code.trim().toLowerCase() } });
    if (existing) return NextResponse.json({ error: 'A subject with this code already exists.' }, { status: 409 });

    let teacherId: string | null = null;
    if (teacherPortalId) {
      const t = await prisma.user.findUnique({ where: { portalId: teacherPortalId } });
      teacherId = t?.id ?? null;
    }

    const subject = await prisma.subject.create({
      data: {
        code: code.trim().toLowerCase(),
        name: name.trim(),
        short: short.trim().toUpperCase(),
        color: color || '#3B82F6',
        room: room?.trim() || null,
        teacherId,
      },
    });

    const students = await prisma.user.findMany({ where: { role: 'student' }, select: { id: true } });
    await prisma.enrollment.createMany({
      data: students.map(st => ({ studentId: st.id, subjectId: subject.id })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, subjectId: subject.id });
  } catch (err) {
    console.error('Admin create subject error:', err);
    return NextResponse.json({ error: 'Could not create subject.' }, { status: 500 });
  }
}

// Update subject details / teacher
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, name, short, color, room, teacherPortalId } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    let teacherId: string | null | undefined = undefined;
    if (teacherPortalId !== undefined) {
      if (teacherPortalId === null || teacherPortalId === '') teacherId = null;
      else {
        const t = await prisma.user.findUnique({ where: { portalId: teacherPortalId } });
        teacherId = t?.id ?? null;
      }
    }

    await prisma.subject.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(short ? { short: short.trim().toUpperCase() } : {}),
        ...(color ? { color } : {}),
        ...(room !== undefined ? { room: room?.trim() || null } : {}),
        ...(teacherId !== undefined ? { teacherId } : {}),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin update subject error:', err);
    return NextResponse.json({ error: 'Could not update subject.' }, { status: 500 });
  }
}

// Delete a subject (cascades enrollments, marks, assignments, timetable)
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin delete subject error:', err);
    return NextResponse.json({ error: 'Could not delete subject.' }, { status: 500 });
  }
}
