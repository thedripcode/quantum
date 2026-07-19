import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// GET /api/admin/settings — returns the single settings row (created on first read)
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await prisma.schoolSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });

  return NextResponse.json({ settings });
}

// PUT /api/admin/settings — save changes
export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data: any = {};

    for (const key of ['schoolName', 'principal', 'address', 'phone', 'email', 'currentTerm', 'academicYear', 'sessionTimeout'] as const) {
      if (typeof body[key] === 'string') data[key] = body[key].trim();
    }
    for (const key of ['emailNotifs', 'smsNotifs', 'parentNotifs', 'twoFA'] as const) {
      if (typeof body[key] === 'boolean') data[key] = body[key];
    }
    if (body.passMark !== undefined) {
      const pm = Number(body.passMark);
      if (!Number.isFinite(pm) || pm < 0 || pm > 100) {
        return NextResponse.json({ error: 'Pass mark must be between 0 and 100.' }, { status: 400 });
      }
      data.passMark = Math.round(pm);
    }
    if (body.gradeCapacity && typeof body.gradeCapacity === 'object') {
      data.gradeCapacity = JSON.stringify(body.gradeCapacity);
    }

    const settings = await prisma.schoolSettings.upsert({
      where: { id: 'main' },
      update: data,
      create: { id: 'main', ...data },
    });

    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: 'Could not save settings.' }, { status: 500 });
  }
}
