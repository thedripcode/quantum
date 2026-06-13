import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const subject = req.nextUrl.searchParams.get('subject');
  const grade   = req.nextUrl.searchParams.get('grade');
  const year    = req.nextUrl.searchParams.get('year');

  const papers = await (prisma as any).pastPaper.findMany({
    where: {
      ...(subject ? { subjectCode: subject } : {}),
      ...(grade   ? { grade }               : {}),
      ...(year    ? { year: parseInt(year) } : {}),
    },
    orderBy: [{ grade: 'asc' }, { year: 'desc' }, { month: 'asc' }],
  });

  return NextResponse.json({ papers });
}
