import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    portalId?: string | null;
    grade?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      portalId?: string | null;
      grade?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    portalId?: string | null;
    grade?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // JWT strategy — no DB adapter needed for sessions (Credentials + JWT only)
  session: { strategy: 'jwt' },

  pages: {
    signIn:  '/student-portal',   // default redirect for unauthenticated users
    error:   '/student-portal',
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Student / Staff ID or Email', type: 'text' },
        password:   { label: 'Password',                    type: 'password' },
        role:       { label: 'Role',                        type: 'text' },
      },

      async authorize(credentials) {
        const { identifier, password, role } = credentials as {
          identifier: string;
          password:   string;
          role:       string;
        };

        if (!identifier || !password) return null;

        // Look up by portalId first, then by email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { portalId: identifier },
              { email:    identifier },
            ],
            active: true,
          },
        });

        if (!user || !user.password) return null;

        // Optionally validate that the chosen portal matches the stored role
        if (role && user.role !== role) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id:       user.id,
          name:     user.name,
          email:    user.email,
          role:     user.role as UserRole,
          portalId: user.portalId,
          grade:    user.grade,
        };
      },
    }),
  ],

  callbacks: {
    // Route protection — called by middleware on every protected request
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn  = !!auth?.user;
      const role        = auth?.user?.role as string | undefined;
      const path        = nextUrl.pathname;

      // Not logged in → redirect to the appropriate login page
      if (!isLoggedIn) {
        const loginPage = path.startsWith('/admin') ? '/admin-portal' :
                          path.startsWith('/dashboard/teacher') ? '/teacher-portal' :
                          '/student-portal';
        return Response.redirect(new URL(`${loginPage}?callbackUrl=${path}`, nextUrl));
      }

      // Role-based access control
      if (path.startsWith('/admin') && role !== 'admin') {
        return Response.redirect(new URL('/student-portal', nextUrl));
      }
      if (path.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin') {
        return Response.redirect(new URL('/teacher-portal', nextUrl));
      }
      if (path.startsWith('/dashboard/student') && !['student','parent','admin'].includes(role ?? '')) {
        return Response.redirect(new URL('/student-portal', nextUrl));
      }

      return true;
    },

    // Persist role + portalId into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.role     = user.role;
        token.portalId = user.portalId;
        token.grade    = user.grade;
      }
      return token;
    },

    // Expose role + portalId on the session object (available client-side)
    async session({ session, token }) {
      if (session.user) {
        session.user.id       = token.sub as string;
        session.user.role     = token.role;
        session.user.portalId = token.portalId;
        session.user.grade    = token.grade;
      }
      return session;
    },
  },
});
