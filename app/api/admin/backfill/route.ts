import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// One-time: assign school emails to existing users who don't have one
export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { schoolEmail: null, portalId: { not: null } },
    select: { id: true, portalId: true },
  });

  let updated = 0;
  for (const u of users) {
    if (!u.portalId) continue;
    const schoolEmail = `${u.portalId.toLowerCase()}@sidelile.edu.za`;
    try {
      await prisma.user.update({ where: { id: u.id }, data: { schoolEmail } });
      updated++;
    } catch {
      // skip duplicates
    }
  }

  return NextResponse.json({ success: true, updated });
}
