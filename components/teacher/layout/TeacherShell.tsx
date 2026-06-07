'use client';

import { useState, useEffect, type ReactNode } from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherTopBar  from './TeacherTopBar';

export default function TeacherShell({ children }: { children: ReactNode }) {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Persist collapse preference
  useEffect(() => {
    const stored = localStorage.getItem('teacher-sidebar-collapsed');
    if (stored === 'true') setSidebarCollapsed(true);
  }, []);

  function toggleCollapse() {
    setSidebarCollapsed(v => {
      localStorage.setItem('teacher-sidebar-collapsed', String(!v));
      return !v;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060f1a' }}>
      {/* Sidebar */}
      <TeacherSidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={toggleCollapse}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TeacherTopBar
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={toggleCollapse}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
