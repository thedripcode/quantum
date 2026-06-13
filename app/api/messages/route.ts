import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// GET: inbox for current user (received messages)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const box = req.nextUrl.searchParams.get('box') ?? 'inbox';

  const [messages, users] = await Promise.all([
    (prisma as any).message.findMany({
      where: box === 'sent' ? { senderId: userId } : { receiverId: userId },
      orderBy: { sentAt: 'desc' },
      take: 100,
    }),
    prisma.user.findMany({ select: { id: true, name: true, role: true, portalId: true } }),
  ]);

  const userMap = Object.fromEntries(users.map((u: any) => [u.id, u]));
  return NextResponse.json({
    messages: messages.map((m: any) => ({
      id: m.id,
      subject: m.subject,
      body: m.body,
      sentAt: m.sentAt,
      readAt: m.readAt,
      sender: userMap[m.senderId] ?? { name: 'Unknown', role: 'unknown' },
      receiver: userMap[m.receiverId] ?? { name: 'Unknown', role: 'unknown' },
    })),
  });
}

// POST: send a message
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  try {
    const { receiverId, subject, body } = await req.json();
    if (!receiverId || !subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'receiverId, subject and body are required.' }, { status: 400 });
    }
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) return NextResponse.json({ error: 'Recipient not found.' }, { status: 404 });

    const msg = await (prisma as any).message.create({
      data: { senderId: userId, receiverId, subject: subject.trim(), body: body.trim() },
    });
    return NextResponse.json({ success: true, messageId: msg.id });
  } catch (err) {
    console.error('Message send error:', err);
    return NextResponse.json({ error: 'Could not send message.' }, { status: 500 });
  }
}

// PATCH: mark a message as read
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await (prisma as any).message.updateMany({
      where: { id, receiverId: userId },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update message.' }, { status: 500 });
  }
}

// DELETE: delete a message
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id as string;
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await (prisma as any).message.deleteMany({ where: { id, receiverId: userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Could not delete message.' }, { status: 500 });
  }
}
