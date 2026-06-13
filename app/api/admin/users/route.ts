import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// List all users
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, portalId: true, grade: true, stream: true, active: true, createdAt: true },
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json({ users });
}

// Create a user (student, teacher, parent or admin)
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name, email, password, role, grade, stream } = await req.json();
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password and role are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (existing) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });

    const prefix = role === 'student' ? 'STU' : role === 'teacher' ? 'TCH' : role === 'parent' ? 'PAR' : 'ADM';
    const year = new Date().getFullYear();
    const count = await prisma.user.count({ where: { role } });
    const portalId = role === 'teacher' || role === 'admin'
      ? `${prefix}${String(count + 1).padStart(3, '0')}`
      : `${prefix}${year}${String(count + 1).padStart(3, '0')}`;

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: await bcrypt.hash(password, 12),
        role,
        portalId,
        grade:  role === 'student' ? (grade || null)  : null,
        stream: role === 'student' ? (stream || null) : null,
        active: true,
      },
    });

    return NextResponse.json({ success: true, portalId: user.portalId });
  } catch (err) {
    console.error('Admin create user error:', err);
    return NextResponse.json({ error: 'Could not create user.' }, { status: 500 });
  }
}

// Toggle active / update grade / stream
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, active, grade, stream } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    await prisma.user.update({
      where: { id },
      data: {
        ...(active  !== undefined ? { active: !!active }   : {}),
        ...(grade   !== undefined ? { grade }              : {}),
        ...(stream  !== undefined ? { stream }             : {}),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin update user error:', err);
    return NextResponse.json({ error: 'Could not update user.' }, { status: 500 });
  }
}

// Delete a user (and their academic records via cascade)
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    if (id === session.user.id) return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin delete user error:', err);
    return NextResponse.json({ error: 'Could not delete user.' }, { status: 500 });
  }
}
