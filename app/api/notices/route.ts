import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Any signed-in user: list notices
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notices = await prisma.notice.findMany({ orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }] });
  return NextResponse.json({
    notices: notices.map(n => ({
      id: n.id, category: n.category, title: n.title, body: n.body,
      date: n.createdAt.toISOString().slice(0, 10),
      author: n.author ?? 'School Office', pinned: n.pinned,
    })),
  });
}

// Teacher/admin: post a notice
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, body, category, pinned } = await req.json();
    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
    }
    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        category: category ?? 'Admin',
        pinned: !!pinned,
        author: session.user.name ?? 'Staff',
      },
    });
    return NextResponse.json({ success: true, noticeId: notice.id });
  } catch (err) {
    console.error('Notice create error:', err);
    return NextResponse.json({ error: 'Could not post notice.' }, { status: 500 });
  }
}

// Teacher/admin: delete a notice
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await prisma.notice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Notice delete error:', err);
    return NextResponse.json({ error: 'Could not delete notice.' }, { status: 500 });
  }
}
