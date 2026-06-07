export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    // Protect all dashboard and admin routes
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
