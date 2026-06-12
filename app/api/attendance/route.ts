import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Teacher/admin: mark daily attendance
// Body: { studentPortalId, date (YYYY-MM-DD), status: present|absent|late|excused, note? }
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { studentPortalId, date, status, note } = await req.json();
    if (!studentPortalId || !date || !status) {
      return NextResponse.json({ error: 'studentPortalId, date and status are required.' }, { status: 400 });
    }
    if (!['present', 'absent', 'late', 'excused'].includes(status)) {
      return NextResponse.json({ error: 'status must be present, absent, late or excused.' }, { status: 400 });
    }

    const student = await prisma.user.findUnique({ where: { portalId: studentPortalId } });
    if (!student) return NextResponse.json({ error: `Student ${studentPortalId} not found.` }, { status: 404 });

    const day = new Date(date + 'T00:00:00.000Z');
    const record = await prisma.attendanceRecord.upsert({
      where: { studentId_date: { studentId: student.id, date: day } },
      update: { status, note: note ?? null },
      create: { studentId: student.id, date: day, status, note: note ?? null },
    });

    return NextResponse.json({ success: true, recordId: record.id });
  } catch (err) {
    console.error('Attendance capture error:', err);
    return NextResponse.json({ error: 'Could not save attendance.' }, { status: 500 });
  }
}
