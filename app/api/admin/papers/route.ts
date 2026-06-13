import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// List all past papers (admin view)
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const papers = await (prisma as any).pastPaper.findMany({
    orderBy: [{ grade: 'asc' }, { year: 'desc' }, { month: 'asc' }],
  });
  return NextResponse.json({ papers });
}

// Upload a past paper (multipart form)
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const form = await req.formData();
    const file        = form.get('file') as File | null;
    const subject     = form.get('subject') as string;
    const subjectCode = form.get('subjectCode') as string;
    const grade       = form.get('grade') as string;
    const year        = form.get('year') as string;
    const month       = form.get('month') as string;
    const type        = form.get('type') as string;
    const language    = (form.get('language') as string) || 'English';

    if (!file || !subject || !grade || !year || !month || !type) {
      return NextResponse.json({ error: 'file, subject, grade, year, month and type are required.' }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to /public/papers/
    const papersDir = join(process.cwd(), 'public', 'papers');
    await mkdir(papersDir, { recursive: true });

    const slug     = `${grade.replace(/\s+/g, '-')}_${year}_${month}_${type}_${language}`.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const ext      = file.name.split('.').pop() ?? 'pdf';
    const fileName = `${slug}_${Date.now()}.${ext}`;
    const filePath = join(papersDir, fileName);

    await writeFile(filePath, buffer);

    const paper = await (prisma as any).pastPaper.create({
      data: {
        subject,
        subjectCode: subjectCode?.toLowerCase() || subject.toLowerCase().replace(/\s+/g, '_'),
        grade,
        year: parseInt(year),
        month,
        type,
        language,
        fileName: file.name,
        fileUrl: `/papers/${fileName}`,
        fileSize: file.size,
      },
    });

    return NextResponse.json({ success: true, paper });
  } catch (err) {
    console.error('Paper upload error:', err);
    return NextResponse.json({ error: 'Could not upload paper.' }, { status: 500 });
  }
}

// Delete a past paper
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    const paper = await (prisma as any).pastPaper.findUnique({ where: { id } });
    if (!paper) return NextResponse.json({ error: 'Paper not found.' }, { status: 404 });

    // Delete file from disk
    try {
      const { unlink } = await import('fs/promises');
      await unlink(join(process.cwd(), 'public', paper.fileUrl));
    } catch { /* file may not exist */ }

    await (prisma as any).pastPaper.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Paper delete error:', err);
    return NextResponse.json({ error: 'Could not delete paper.' }, { status: 500 });
  }
}
