import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const { ref, documents } = await req.json();
    if (!ref || !documents) return NextResponse.json({ error: 'ref and documents required.' }, { status: 400 });

    await prisma.application.update({
      where: { ref },
      data: { documents },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Documents patch error:', err);
    return NextResponse.json({ error: 'Could not save documents.' }, { status: 500 });
  }
}
