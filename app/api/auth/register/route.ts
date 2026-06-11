import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, grade, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Generate portal ID
    const year = new Date().getFullYear();
    const prefix = role === 'student' ? 'STU' : role === 'parent' ? 'PAR' : 'TCH';
    const count = await prisma.user.count({ where: { role } });
    const portalId = `${prefix}${year}${String(count + 1).padStart(3, '0')}`;

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        portalId,
        grade: role === 'student' ? grade : null,
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      portalId: user.portalId,
      message: `Account created! Your portal ID is ${user.portalId}`,
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
