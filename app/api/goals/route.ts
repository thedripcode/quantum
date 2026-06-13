import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Student: get own goals with subject info + current average
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;

  const [goals, enrollments, marks] = await Promise.all([
    (prisma as any).goal.findMany({ where: { studentId: userId } }),
    prisma.enrollment.findMany({
      where: { studentId: userId },
      include: { subject: { select: { id: true, name: true, short: true, color: true, code: true } } },
    }),
    prisma.mark.findMany({
      where: { studentId: userId },
      select: { subjectId: true, score: true, total: true },
    }),
  ]);

  const goalMap = Object.fromEntries(goals.map((g: any) => [g.subjectId, g]));

  // Average per subject
  const avgMap: Record<string, number> = {};
  for (const m of marks) {
    if (!avgMap[m.subjectId]) avgMap[m.subjectId] = 0;
  }
  const countMap: Record<string, number> = {};
  for (const m of marks) {
    const pct = (m.score / m.total) * 100;
    avgMap[m.subjectId] = (avgMap[m.subjectId] || 0) + pct;
    countMap[m.subjectId] = (countMap[m.subjectId] || 0) + 1;
  }
  for (const sid of Object.keys(avgMap)) {
    avgMap[sid] = Math.round(avgMap[sid] / countMap[sid]);
  }

  return NextResponse.json({
    goals: enrollments.map((e: any) => ({
      subjectId: e.subject.id,
      subjectCode: e.subject.code,
      subjectName: e.subject.name,
      subjectShort: e.subject.short,
      color: e.subject.color,
      targetMark: goalMap[e.subject.id]?.targetMark ?? e.targetMark ?? 75,
      note: goalMap[e.subject.id]?.note ?? null,
      goalId: goalMap[e.subject.id]?.id ?? null,
      currentAvg: avgMap[e.subject.id] ?? null,
    })),
  });
}

// Student: set/update a goal for a subject
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  try {
    const { subjectId, targetMark, note } = await req.json();
    if (!subjectId || targetMark == null) {
      return NextResponse.json({ error: 'subjectId and targetMark are required.' }, { status: 400 });
    }

    const goal = await (prisma as any).goal.upsert({
      where: { studentId_subjectId: { studentId: userId, subjectId } },
      update: { targetMark: Number(targetMark), note: note ?? null },
      create: { studentId: userId, subjectId, targetMark: Number(targetMark), note: note ?? null },
    });

    return NextResponse.json({ success: true, goalId: goal.id });
  } catch (err) {
    console.error('Goal upsert error:', err);
    return NextResponse.json({ error: 'Could not save goal.' }, { status: 500 });
  }
}
