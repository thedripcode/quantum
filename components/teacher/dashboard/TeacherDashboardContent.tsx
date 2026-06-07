'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, ClipboardList, CalendarCheck, Users, UserCheck,
  AlertTriangle, Building2, BarChart2, FileText, Download,
  Bell, MessageSquare, PhoneCall, Plus, ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEACHERS, CURRENT_TEACHER_ID } from '@/lib/teacher/mockData';
import { useTeacherPortal } from '@/contexts/TeacherPortalContext';
import RightPanel from './RightPanel';
import AddStudentModal from '../students/AddStudentModal';

// ─── Hub card types ────────────────────────────────────────────────────────────

interface HubCard {
  icon:    React.ElementType;
  title:   string;
  desc:    string;
  href:    string;
  badge?:  { count: number; color: 'red'|'orange'|'green'|'blue'|'purple'|'gold' };
  accent:  string;          // Tailwind bg for icon bg
  iconCol: string;          // Tailwind text for icon
  soon?:   boolean;
  action?: () => void;      // override href with action (e.g. open modal)
}

interface HubGroup {
  title:    string;
  subtitle: string;
  cards:    HubCard[];
}

const PURPLE = '#7C3AED';

// ─── Badge color map ──────────────────────────────────────────────────────────

const BADGE_COLORS: Record<string, string> = {
  red:    '#ef4444',
  purple: PURPLE,
  gold:   PURPLE,
};

// ─── HubCard component ────────────────────────────────────────────────────────

function HubCardEl({ card }: { card: HubCard }) {
  const Icon = card.icon;

  const inner = (
    <div
      className={cn(
        'relative flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 h-full',
        card.soon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group hover:-translate-y-0.5',
      )}
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
      onMouseEnter={!card.soon ? e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.30)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.05)';
      } : undefined}
      onMouseLeave={!card.soon ? e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
      } : undefined}
    >
      {/* Badge */}
      {card.badge && card.badge.count > 0 && (
        <span
          className="absolute top-3 right-3 min-w-[20px] h-5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
          style={{ background: BADGE_COLORS[card.badge.color] ?? PURPLE }}
        >
          {card.badge.count > 99 ? '99+' : card.badge.count}
        </span>
      )}

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: card.accent, border: '1px solid rgba(124,58,237,0.18)' }}
      >
        <Icon className="w-5 h-5" style={{ color: card.iconCol }} />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="font-semibold text-[13px] text-white">{card.title}</p>
        <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{card.desc}</p>
      </div>

      {/* Soon tag */}
      {card.soon && (
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full self-start"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.30)' }}
        >
          Coming Soon
        </span>
      )}

      {/* Arrow */}
      {!card.soon && (
        <ChevronRight
          className="absolute bottom-4 right-4 w-4 h-4 transition-colors"
          style={{ color: 'rgba(255,255,255,0.20)' }}
        />
      )}
    </div>
  );

  if (card.soon) return <div>{inner}</div>;
  if (card.action) return <button onClick={card.action} className="text-left h-full w-full">{inner}</button>;
  return <Link href={card.href} className="block h-full">{inner}</Link>;
}

// ─── HubSection component ─────────────────────────────────────────────────────

function HubSection({ group, delay }: { group: HubGroup; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="mb-4">
        <h3
          className="font-bold text-[11px] uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {group.title}
        </h3>
        <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{group.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {group.cards.map(card => (
          <HubCardEl key={card.title} card={card} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function TeacherDashboardContent() {
  const teacher = TEACHERS.find(t => t._id === CURRENT_TEACHER_ID)!;
  const { pendingMarks, atRiskCount, unreadCount, upcomingCount, students } = useTeacherPortal();
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const now  = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const HUB_GROUPS: HubGroup[] = [
    {
      title:    'ACADEMIC MANAGEMENT',
      subtitle: 'Capture marks, manage assignments and upcoming assessments',
      cards: [
        {
          icon: BookOpen, title: 'Gradebook', href: '/dashboard/teacher/gradebook',
          desc: 'Capture & review learner marks',
          accent: 'rgba(124,58,237,0.12)', iconCol: '#a78bfa',
          badge: pendingMarks > 0 ? { count: pendingMarks, color: 'purple' as const } : undefined,
        },
        {
          icon: ClipboardList, title: 'Assignments', href: '#',
          desc: 'Manage and grade learner tasks',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
        {
          icon: CalendarCheck, title: 'Exams', href: '#',
          desc: 'Schedule and track assessments',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
          badge: upcomingCount > 0 ? { count: upcomingCount, color: 'purple' as const } : undefined,
        },
      ],
    },
    {
      title:    'STUDENT MANAGEMENT',
      subtitle: 'Monitor, enrol, and track the progress of your learners',
      cards: [
        {
          icon: Users, title: 'Profiles', href: '/dashboard/teacher/students',
          desc: `View all ${students.length} learners`,
          accent: 'rgba(124,58,237,0.12)', iconCol: '#a78bfa',
          badge: atRiskCount > 0 ? { count: atRiskCount, color: 'red' as const } : undefined,
        },
        {
          icon: UserCheck, title: 'Attendance', href: '#',
          desc: 'Record daily attendance',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
        {
          icon: AlertTriangle, title: 'At-Risk', href: '/dashboard/teacher/students',
          desc: `${atRiskCount} learners flagged`,
          accent: atRiskCount > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(124,58,237,0.10)',
          iconCol: atRiskCount > 0 ? '#f87171' : '#a78bfa',
          badge: atRiskCount > 0 ? { count: atRiskCount, color: 'red' as const } : undefined,
        },
        {
          icon: Plus, title: 'Add Student', href: '#',
          desc: 'Enrol a new learner',
          accent: 'rgba(124,58,237,0.14)', iconCol: '#a78bfa',
          action: () => setAddStudentOpen(true),
        },
      ],
    },
    {
      title:    'SCHOOL OVERVIEW',
      subtitle: 'Browse all grades and classes across the school',
      cards: [
        {
          icon: Building2, title: 'Browse Classes', href: '/dashboard/teacher/school',
          desc: 'View Grades 8–12, all classes',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
        },
        {
          icon: GraduationCap, title: 'My Classes', href: '/dashboard/teacher/gradebook',
          desc: '10B · 11A · 12D Mathematics',
          accent: 'rgba(124,58,237,0.12)', iconCol: '#a78bfa',
        },
      ],
    },
    {
      title:    'REPORTS & ANALYTICS',
      subtitle: 'Generate performance reports and export data',
      cards: [
        {
          icon: BarChart2, title: 'Performance', href: '#',
          desc: 'Class analytics and trends',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
        {
          icon: FileText, title: 'Term Reports', href: '#',
          desc: 'Generate learner report cards',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
        {
          icon: Download, title: 'Generate PDF', href: '#',
          desc: 'Export marks and reports',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
      ],
    },
    {
      title:    'COMMUNICATION',
      subtitle: 'Manage notices, messages and parent contact',
      cards: [
        {
          icon: Bell, title: 'Notices', href: '/dashboard/teacher/notices',
          desc: 'Staff and school notices',
          accent: 'rgba(124,58,237,0.12)', iconCol: '#a78bfa',
          badge: unreadCount > 0 ? { count: unreadCount, color: 'purple' as const } : undefined,
        },
        {
          icon: MessageSquare, title: 'Messages', href: '#',
          desc: 'Staff communication',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
        {
          icon: PhoneCall, title: 'Parent Alerts', href: '#',
          desc: 'Send parent notifications',
          accent: 'rgba(124,58,237,0.10)', iconCol: '#a78bfa',
          soon: true,
        },
      ],
    },
  ];

  return (
    <>
      <div className="flex h-full">
        {/* Hub content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-white">
              {greeting}, {teacher.title} {teacher.lastName} 👋
            </h2>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Term 3 · 2024 — {teacher.role === 'hod' ? 'Mathematics HOD' : 'Mathematics Educator'}
            </p>
          </motion.div>

          {/* Hub sections */}
          {HUB_GROUPS.map((group, i) => (
            <HubSection key={group.title} group={group} delay={i * 0.07} />
          ))}
        </div>

        {/* Right panel (visible on xl+) */}
        <RightPanel />
      </div>

      {/* Add Student modal */}
      <AddStudentModal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
    </>
  );
}
