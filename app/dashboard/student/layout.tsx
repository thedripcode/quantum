'use client';

import StudentPortalSidebar from '@/components/student/StudentPortalSidebar';
import StudentPortalTopBar  from '@/components/student/StudentPortalTopBar';

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C0C0C' }}>
      <StudentPortalSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <StudentPortalTopBar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
