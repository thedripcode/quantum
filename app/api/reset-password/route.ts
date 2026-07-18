import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    // ── Step 1: request reset ──────────────────────────────────────
    if (email && !token) {
      const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
      // Always return success to avoid user enumeration
      if (!user) return NextResponse.json({ success: true });

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      await (prisma.user.update as any)({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry: expiry },
      });

      try {
        await sendPasswordResetEmail(user.email, resetToken);
      } catch (emailErr) {
        console.error('Failed to send reset email:', emailErr);
        // Don't fail the request — token is saved, user can contact admin
      }

      return NextResponse.json({ success: true });
    }

    // ── Step 2: complete reset ─────────────────────────────────────
    if (token && password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      const user = await (prisma.user.findFirst as any)({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() },
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
      }

      await (prisma.user.update as any)({
        where: { id: user.id },
        data: {
          password: await bcrypt.hash(password, 12),
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return NextResponse.json({ success: true, message: 'Password updated. You can now sign in.' });
    }

    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
