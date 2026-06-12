import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// Get a grade's timetable
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const grade = req.nextUrl.searchParams.get('grade') ?? 'Grade 11';
  const slots = await prisma.timetableSlot.findMany({
    where: { grade },
    include: { subject: { select: { code: true, name: true, color: true } } },
    orderBy: [{ day: 'asc' }, { period: 'asc' }],
  });
  return NextResponse.json({
    slots: slots.map(s => ({
      day: s.day, period: s.period, time: s.time, endTime: s.endTime,
      room: s.room, subjectCode: s.subject.code, subjectName: s.subject.name, color: s.subject.color,
    })),
  });
}

// Replace a grade's whole timetable
// Body: { grade, slots: [{ day, period, time, endTime, subjectCode, room? }] }
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { grade, slots } = await req.json();
    if (!grade || !Array.isArray(slots)) {
      return NextResponse.json({ error: 'grade and slots are required.' }, { status: 400 });
    }

    const subjects = await prisma.subject.findMany({ select: { id: true, code: true, room: true } });
    const byCode = Object.fromEntries(subjects.map(s => [s.code, s]));

    for (const s of slots) {
      if (!byCode[s.subjectCode]) {
        return NextResponse.json({ error: `Unknown subject code: ${s.subjectCode}` }, { status: 400 });
      }
    }

    await prisma.$transaction([
      prisma.timetableSlot.deleteMany({ where: { grade } }),
      prisma.timetableSlot.createMany({
        data: slots.map((s: any) => ({
          grade,
          day: s.day,
          period: Number(s.period),
          time: s.time,
          endTime: s.endTime,
          room: s.room ?? byCode[s.subjectCode].room,
          subjectId: byCode[s.subjectCode].id,
        })),
      }),
    ]);

    return NextResponse.json({ success: true, count: slots.length });
  } catch (err) {
    console.error('Admin timetable save error:', err);
    return NextResponse.json({ error: 'Could not save timetable.' }, { status: 500 });
  }
}
