import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const NEXT_GRADE: Record<string, string> = {
  'Grade 8':  'Grade 9',
  'Grade 9':  'Grade 10',
  'Grade 10': 'Grade 11',
  'Grade 11': 'Grade 12',
};

// POST /api/admin/promote — year-end promotion based on the configured pass mark.
// Grade 8-11 students with an overall average >= passMark move up one grade.
// Grade 12s and students without marks are left untouched (reported back).
export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.schoolSettings.upsert({
      where: { id: 'main' }, update: {}, create: { id: 'main' },
    });
    const passMark = settings.passMark;

    const students = await prisma.user.findMany({
      where: { role: 'student', active: true },
      select: { id: true, name: true, grade: true, marks: { select: { score: true, total: true } } },
    });

    let promoted = 0, held = 0, seniors = 0, noMarks = 0;
    const heldNames: string[] = [];

    for (const s of students) {
      const next = s.grade ? NEXT_GRADE[s.grade] : undefined;
      if (!next) { seniors++; continue; }               // Grade 12 or unknown grade

      const graded = s.marks.filter(m => m.total > 0);
      if (graded.length === 0) { noMarks++; heldNames.push(`${s.name} (no marks)`); continue; }

      const avg = graded.reduce((sum, m) => sum + (m.score / m.total) * 100, 0) / graded.length;
      if (avg >= passMark) {
        await prisma.user.update({ where: { id: s.id }, data: { grade: next } });
        promoted++;
      } else {
        held++;
        heldNames.push(`${s.name} (${Math.round(avg)}%)`);
      }
    }

    return NextResponse.json({ success: true, passMark, promoted, held, seniors, noMarks, heldNames });
  } catch (err) {
    console.error('Promotion error:', err);
    return NextResponse.json({ error: 'Promotion failed — no students were changed.' }, { status: 500 });
  }
}
