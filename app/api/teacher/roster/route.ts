import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Teacher/admin: real students and subjects for the capture screens
export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [students, subjects] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'student', active: true },
      select: { portalId: true, name: true, grade: true },
      orderBy: { name: 'asc' },
    }),
    prisma.subject.findMany({
      select: { id: true, code: true, name: true, short: true, color: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return NextResponse.json({ students, subjects });
}
