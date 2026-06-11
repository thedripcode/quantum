import type { NextAuthConfig } from 'next-auth';

// Lightweight config used by middleware (Edge Runtime — no bcryptjs/prisma)
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/student-portal',
    error:  '/student-portal',
  },
  providers: [], // filled in auth.ts with Credentials + bcrypt
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role       = (auth?.user as any)?.role as string | undefined;
      const path       = nextUrl.pathname;

      if (!isLoggedIn) {
        const loginPage = path.startsWith('/admin')            ? '/admin-portal'   :
                          path.startsWith('/dashboard/teacher') ? '/teacher-portal' :
                          '/student-portal';
        return Response.redirect(new URL(`${loginPage}?callbackUrl=${path}`, nextUrl));
      }

      if (path.startsWith('/admin') && role !== 'admin')
        return Response.redirect(new URL('/student-portal', nextUrl));
      if (path.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin')
        return Response.redirect(new URL('/teacher-portal', nextUrl));
      if (path.startsWith('/dashboard/student') && !['student','parent','admin'].includes(role ?? ''))
        return Response.redirect(new URL('/student-portal', nextUrl));

      return true;
    },
  },
};
