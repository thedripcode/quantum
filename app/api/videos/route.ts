import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Extract a playable video id from a pasted link
function parseVideoUrl(url: string): { provider: string; videoId: string | null } {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname === '/watch') return { provider: 'youtube', videoId: u.searchParams.get('v') };
      const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{6,})/);
      if (m) return { provider: 'youtube', videoId: m[2] };
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return { provider: 'youtube', videoId: id || null };
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const m = u.pathname.match(/(\d{6,})/);
      return { provider: 'vimeo', videoId: m ? m[1] : null };
    }
    return { provider: 'other', videoId: null };
  } catch {
    return { provider: 'other', videoId: null };
  }
}

// GET /api/videos?grade=Grade+11&subjectId=xxx — any logged-in user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const grade     = searchParams.get('grade');
  const subjectId = searchParams.get('subjectId');

  const where: any = {};
  // Grade filter includes videos marked for all grades (grade = null)
  if (grade)     where.OR = [{ grade }, { grade: null }];
  if (subjectId) where.subjectId = subjectId;

  const videos = await prisma.videoResource.findMany({
    where,
    include: {
      subject: { select: { id: true, name: true, short: true, color: true, code: true } },
      addedBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ videos });
}

// POST /api/videos — teacher or admin
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, url, subjectId, grade, description } = await req.json();
    if (!title?.trim() || !url?.trim()) {
      return NextResponse.json({ error: 'Title and video link are required.' }, { status: 400 });
    }

    const { provider, videoId } = parseVideoUrl(url);
    if (provider === 'youtube' && !videoId) {
      return NextResponse.json({ error: 'That YouTube link looks invalid — paste the full video URL.' }, { status: 400 });
    }

    const video = await prisma.videoResource.create({
      data: {
        title:       title.trim(),
        url:         url.trim(),
        videoId,
        provider,
        description: description?.trim() || null,
        grade:       grade || null,
        subjectId:   subjectId || null,
        addedById:   session.user.id!,
      },
      include: {
        subject: { select: { id: true, name: true, short: true, color: true, code: true } },
        addedBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (err) {
    console.error('Video create error:', err);
    return NextResponse.json({ error: 'Could not save the video.' }, { status: 500 });
  }
}

// DELETE /api/videos?id=xxx — the teacher who added it, or admin
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== 'teacher' && role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required.' }, { status: 400 });

  try {
    const video = await prisma.videoResource.findUnique({ where: { id } });
    if (!video) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (role === 'teacher' && video.addedById !== session.user.id) {
      return NextResponse.json({ error: 'You can only remove videos you added.' }, { status: 403 });
    }
    await prisma.videoResource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Video delete error:', err);
    return NextResponse.json({ error: 'Could not delete the video.' }, { status: 500 });
  }
}
