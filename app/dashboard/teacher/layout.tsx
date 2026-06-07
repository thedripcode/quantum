import type { ReactNode } from 'react';
import { TeacherPortalProvider } from '@/contexts/TeacherPortalContext';
import TeacherShell from '@/components/teacher/layout/TeacherShell';

export const metadata = {
  title: 'Teacher Portal — Sidelile High School',
};

export default function TeacherDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TeacherPortalProvider>
      <TeacherShell>{children}</TeacherShell>
    </TeacherPortalProvider>
  );
}
