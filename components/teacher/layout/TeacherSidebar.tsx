'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, ClipboardList, CalendarCheck,
  Users, UserCheck, AlertTriangle, Building2,
  BarChart2, FileText, Download, Bell, MessageSquare,
  PhoneCall, Settings, GraduationCap, LogOut, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Brain, PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEACHERS, CURRENT_TEACHER_ID, SCHOOL_CLASSES } from '@/lib/teacher/mockData';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';

// ─── Nav structure ────────────────────────────────────────────────────────────

interface NavItem {
  href:     string;
  icon:     React.ElementType;
  label:    string;
  exact?:   boolean;
  soon?:    boolean;
  badgeKey?: 'pending' | 'atRisk' | 'unread' | 'upcoming';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href:'/dashboard/teacher',            icon:LayoutDashboard, label:'Dashboard',    exact:true },
    ],
  },
  {
    label: 'Academic',
    items: [
      { href:'/dashboard/teacher/capture',     icon:PenLine,         label:'Capture' },
      { href:'/dashboard/teacher/gradebook',   icon:BookOpen,        label:'Gradebook',   badgeKey:'pending' },
      { href:'/dashboard/teacher/assignments', icon:ClipboardList,   label:'Assignments' },
      { href:'/dashboard/teacher/exams',       icon:CalendarCheck,   label:'Exams' },
    ],
  },
  {
    label: 'Students',
    items: [
      { href:'/dashboard/teacher/students',    icon:Users,           label:'Profiles',    badgeKey:'atRisk' },
      { href:'/dashboard/teacher/attendance',  icon:UserCheck,       label:'Attendance' },
      { href:'/dashboard/teacher/at-risk',     icon:AlertTriangle,   label:'At-Risk',     badgeKey:'atRisk' },
    ],
  },
  {
    label: 'School',
    items: [
      { href:'/dashboard/teacher/school',      icon:Building2,       label:'Browse Classes' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href:'/dashboard/teacher/analytics',   icon:BarChart2,       label:'Performance' },
      { href:'/dashboard/teacher/reports',     icon:FileText,        label:'Term Reports' },
      { href:'/dashboard/teacher/pdf',         icon:Download,        label:'Generate PDF' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href:'/dashboard/teacher/notices',     icon:Bell,            label:'Notices',     badgeKey:'unread' },
      { href:'/dashboard/teacher/messages',    icon:MessageSquare,   label:'Messages' },
      { href:'/dashboard/teacher/alerts',      icon:PhoneCall,       label:'Parent Alerts' },
    ],
  },
  {
    label: 'SIDI AI',
    items: [
      { href:'/dashboard/teacher/sidi',         icon:Brain,           label:'SIDI — AI Tools' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href:'/dashboard/teacher/settings',    icon:Settings,        label:'Settings' },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open:             boolean;
  collapsed:        boolean;
  onClose:          () => void;
  onToggleCollapse: () => void;
}

// ─── Sidebar inner content (extracted to avoid React Strict Mode key warnings) ──

interface ContentProps {
  collapsed:        boolean;
  onClose:          () => void;
  onToggleCollapse: () => void;
}

const PURPLE = '#7C3AED';

function SidebarContent({ collapsed, onClose, onToggleCollapse }: ContentProps) {
  const pathname    = usePathname();
  const teacher     = TEACHERS.find(t => t._id === CURRENT_TEACHER_ID)!;
  const myClasses   = SCHOOL_CLASSES.filter(c => c.teacherId === CURRENT_TEACHER_ID);
  const { pendingMarks, atRiskCount, unreadCount, upcomingCount } = useTeacherPortal();
  const [badgeErr,  setBadgeErr]  = useState(false);

  const badges: Record<string, number> = {
    pending:  pendingMarks,
    atRisk:   atRiskCount,
    unread:   unreadCount,
    upcoming: upcomingCount,
  };

  function isActive(item: NavItem): boolean {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href) && item.href !== '/dashboard/teacher';
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full text-white transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-64',
      )}
      style={{ background: '#060f1a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* ── Logo ── */}
      <div className={cn(
        'flex items-center gap-3 flex-shrink-0',
        collapsed ? 'justify-center px-0 py-4' : 'px-4 py-4',
      )}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* School badge */}
        {badgeErr ? (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.28)' }}
          >
            <GraduationCap className="w-5 h-5" style={{ color: PURPLE }} />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/images/sidelile-badge.jpg"
            alt="Sidelile crest"
            width={36} height={36}
            style={{ objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.35))' }}
            onError={() => setBadgeErr(true)}
          />
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-[13px] leading-none tracking-wide text-white truncate">Sidelile HS</p>
            <p className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(124,58,237,0.80)' }}>Teacher Portal</p>
          </div>
        )}
      </div>

      {/* ── Teacher profile ── */}
      {!collapsed ? (
        <div className="px-3 py-3 flex-shrink-0">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
              style={{ background: PURPLE }}
            >
              {teacher.avatarInitials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[13px] text-white truncate">{teacher.title} {teacher.lastName}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.40)' }}>{teacher.department}</p>
              <div className="flex gap-1 flex-wrap mt-1.5">
                {myClasses.map(c => (
                  <span
                    key={c._id}
                    className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}
                  >
                    Gr {c.grade}{c.section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-3 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: PURPLE }}
          >
            {teacher.avatarInitials}
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-thin">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <p
                className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'rgba(255,255,255,0.28)' }}
              >
                {group.label}
              </p>
            )}
            {collapsed && <div className="h-2" />}

            {group.items.map(item => {
              const Icon     = item.icon;
              const active   = isActive(item);
              const count    = item.badgeKey ? badges[item.badgeKey] : 0;
              const disabled = item.soon;

              const itemEl = (
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group relative',
                    collapsed ? 'px-0 py-2.5 justify-center mx-1' : 'px-3 py-2.5',
                  )}
                  style={
                    active
                      ? { background: 'rgba(124,58,237,0.18)', color: '#fff', boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.35)' }
                      : disabled
                        ? { color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed' }
                        : { color: 'rgba(255,255,255,0.55)' }
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                      {disabled && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
                        >
                          Soon
                        </span>
                      )}
                      {!disabled && count > 0 && (
                        <span
                          className="text-[10px] min-w-[18px] h-[18px] px-1 rounded-full font-bold flex items-center justify-center text-white"
                          style={{ background: PURPLE }}
                        >
                          {count > 99 ? '99+' : count}
                        </span>
                      )}
                      {active && !disabled && (
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                      )}
                    </>
                  )}
                  {collapsed && !disabled && count > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 text-[8px] rounded-full font-bold flex items-center justify-center text-white"
                      style={{ background: PURPLE }}
                    >
                      {count}
                    </span>
                  )}
                  {collapsed && (
                    <div
                      className="absolute left-full ml-2 px-2.5 py-1.5 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl"
                      style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.10)' }}
                    >
                      {item.label}
                      {disabled && ' (Coming Soon)'}
                      {count > 0 && ` · ${count}`}
                    </div>
                  )}
                </div>
              );

              if (!active && !disabled) {
                // Add hover style via onMouseEnter/Leave
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer group relative',
                        collapsed ? 'px-0 py-2.5 justify-center mx-1' : 'px-3 py-2.5',
                      )}
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                          {count > 0 && (
                            <span className="text-[10px] min-w-[18px] h-[18px] px-1 rounded-full font-bold flex items-center justify-center text-white" style={{ background: PURPLE }}>
                              {count > 99 ? '99+' : count}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 text-[8px] rounded-full font-bold flex items-center justify-center text-white" style={{ background: PURPLE }}>
                          {count}
                        </span>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl" style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.10)' }}>
                          {item.label}{count > 0 && ` · ${count}`}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              }

              return disabled ? (
                <div key={item.href}>{itemEl}</div>
              ) : (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  {itemEl}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={onToggleCollapse}
          className={cn(
            'hidden lg:flex items-center gap-3 w-full px-3 py-2.5 transition-colors text-[13px]',
            collapsed && 'justify-center px-0',
          )}
          style={{ color: 'rgba(255,255,255,0.40)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4" /><span>Collapse</span></>
          }
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/teacher-portal' })}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 transition-colors text-[13px] w-full bg-transparent border-none cursor-pointer',
            collapsed && 'justify-center px-0',
          )}
          style={{ color: 'rgba(255,255,255,0.40)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

// ─── Outer shell ──────────────────────────────────────────────────────────────

export default function TeacherSidebar({ open, collapsed, onClose, onToggleCollapse }: Props) {
  return (
    <>
      {/* Desktop — static */}
      <aside className="hidden lg:flex flex-shrink-0">
        <SidebarContent collapsed={collapsed} onClose={onClose} onToggleCollapse={onToggleCollapse} />
      </aside>

      {/* Mobile — slide drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-30 lg:hidden flex"
          >
            <SidebarContent collapsed={collapsed} onClose={onClose} onToggleCollapse={onToggleCollapse} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
