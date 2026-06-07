import Link from 'next/link';
import {
  ArrowRight, Zap, Inbox, GitPullRequest, BarChart3, Hash, ChevronDown,
  Settings, Filter, Plus, CheckCircle2, Circle, AlertCircle,
} from 'lucide-react';
import VideoModal from '@/components/saas/VideoModal';

// ─── Mockup sub-components ──────────────────────────────────────────────────

type Priority = 'urgent' | 'high' | 'medium' | 'low';
type IssueStatus = 'in-progress' | 'todo' | 'done';
type LabelKind  = 'Bug' | 'Feature' | 'Improvement' | 'Chore';

function PriorityDot({ level }: { level: Priority }) {
  const colors: Record<Priority, string> = {
    urgent: 'bg-red-500',
    high:   'bg-orange-400',
    medium: 'bg-yellow-400',
    low:    'bg-zinc-300',
  };
  return (
    <span className={`inline-block w-[3px] h-3.5 rounded-full flex-shrink-0 ${colors[level]}`} />
  );
}

function StatusIcon({ status }: { status: IssueStatus }) {
  if (status === 'in-progress') {
    return (
      <span className="w-[14px] h-[14px] rounded-full border-2 border-orange-400 flex items-center justify-center flex-shrink-0">
        <span className="w-[5px] h-[5px] rounded-full bg-orange-400" />
      </span>
    );
  }
  if (status === 'done') {
    return <CheckCircle2 className="w-[14px] h-[14px] text-emerald-500 flex-shrink-0" />;
  }
  return <Circle className="w-[14px] h-[14px] text-zinc-300 flex-shrink-0" />;
}

function LabelBadge({ kind }: { kind: LabelKind }) {
  const styles: Record<LabelKind, string> = {
    Bug:         'border-red-200    text-red-600    bg-red-50',
    Feature:     'border-indigo-200 text-indigo-600 bg-indigo-50',
    Improvement: 'border-sky-200    text-sky-600    bg-sky-50',
    Chore:       'border-zinc-200   text-zinc-500   bg-zinc-50',
  };
  return (
    <span className={`hidden sm:inline text-[9px] px-1.5 py-[1px] rounded border font-medium flex-shrink-0 ${styles[kind]}`}>
      {kind}
    </span>
  );
}

function Avatar({
  initials, color, size = 'sm',
}: { initials: string; color: string; size?: 'sm' | 'xs' }) {
  const sz = size === 'xs' ? 'w-4 h-4 text-[7px]' : 'w-[18px] h-[18px] text-[8px]';
  return (
    <span className={`${sz} rounded-full ${color} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </span>
  );
}

interface IssueRowProps {
  priority:      Priority;
  title:         string;
  label:         LabelKind;
  assignee:      string;
  assigneeColor: string;
  status:        IssueStatus;
}

function IssueRow({ priority, title, label, assignee, assigneeColor, status }: IssueRowProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-[7px] border-b border-zinc-50 cursor-pointer hover:bg-zinc-50/60 transition-colors ${
        status === 'done' ? 'opacity-50' : ''
      }`}
    >
      <PriorityDot level={priority} />
      <StatusIcon status={status} />
      <span className={`text-[11px] flex-1 truncate ${status === 'done' ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>
        {title}
      </span>
      <LabelBadge kind={label} />
      <Avatar initials={assignee} color={assigneeColor} />
    </div>
  );
}

interface SidebarNavItemProps {
  icon:    React.ElementType;
  label:   string;
  active?: boolean;
  badge?:  string;
}

function SidebarNavItem({ icon: Icon, label, active, badge }: SidebarNavItemProps) {
  return (
    <div className={`flex items-center gap-2 px-2 py-[5px] rounded-md text-[11px] cursor-pointer select-none ${
      active
        ? 'bg-zinc-100 text-zinc-900 font-medium'
        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
    }`}>
      <Icon className={`w-[13px] h-[13px] flex-shrink-0 ${active ? 'text-zinc-700' : 'text-zinc-400'}`} />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="ml-auto bg-indigo-100 text-indigo-600 text-[9px] font-bold px-1.5 py-px rounded-full leading-none">
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Dashboard Mockup ───────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200/80 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)]">

      {/* Window chrome */}
      <div className="h-9 bg-zinc-100 border-b border-zinc-200 flex items-center px-3 gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex-1 flex justify-center pr-10">
          <div className="bg-white border border-zinc-200 rounded-md flex items-center gap-1.5 px-3 py-[3px]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10.5px] text-zinc-400">app.kairos.dev/my-issues</span>
          </div>
        </div>
      </div>

      {/* App body */}
      <div className="flex bg-white overflow-hidden" style={{ height: 430 }}>

        {/* ── Sidebar ── */}
        <div className="w-[188px] flex-shrink-0 border-r border-zinc-100 flex flex-col bg-zinc-50/40">

          {/* Workspace header */}
          <div className="h-10 px-3 flex items-center gap-2 border-b border-zinc-100">
            <div className="w-[18px] h-[18px] bg-indigo-600 rounded-[4px] flex items-center justify-center flex-shrink-0">
              <Zap className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[11.5px] font-semibold text-zinc-900 flex-1">Kairos</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </div>

          {/* Nav items */}
          <div className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
            <SidebarNavItem icon={Inbox}         label="Inbox"         badge="3" />
            <SidebarNavItem icon={AlertCircle}   label="My Issues"     active />
            <SidebarNavItem icon={GitPullRequest} label="Pull Requests" />
            <SidebarNavItem icon={BarChart3}     label="Analytics" />

            {/* Projects */}
            <p className="pt-3 pb-1 px-2 text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
              Projects
            </p>
            {[
              { label: 'Core Platform', color: 'bg-indigo-500' },
              { label: 'API Gateway',   color: 'bg-violet-500' },
              { label: 'Infrastructure',color: 'bg-emerald-500'},
            ].map(p => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-2 py-[5px] rounded-md cursor-pointer text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
              >
                <Hash className="w-[13px] h-[13px] text-zinc-400 flex-shrink-0" />
                <span className="text-[11px] truncate">{p.label}</span>
                <span className={`ml-auto w-[6px] h-[6px] rounded-full ${p.color} flex-shrink-0`} />
              </div>
            ))}

            {/* Members */}
            <p className="pt-3 pb-1 px-2 text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
              Members
            </p>
            {[
              { initials: 'JD', name: 'Jordan D.', color: 'bg-indigo-500', online: true  },
              { initials: 'SM', name: 'Sara M.',   color: 'bg-violet-500', online: true  },
              { initials: 'AL', name: 'Alex L.',   color: 'bg-emerald-500', online: false },
            ].map(m => (
              <div key={m.initials} className="flex items-center gap-2 px-2 py-[5px] rounded-md cursor-pointer text-zinc-500 hover:bg-zinc-50">
                <div className="relative flex-shrink-0">
                  <Avatar initials={m.initials} color={m.color} size="xs" />
                  {m.online && (
                    <span className="absolute -bottom-px -right-px w-[5px] h-[5px] rounded-full bg-emerald-400 border border-white" />
                  )}
                </div>
                <span className="text-[11px] text-zinc-500 truncate">{m.name}</span>
              </div>
            ))}
          </div>

          {/* User footer */}
          <div className="px-3 py-2.5 border-t border-zinc-100 flex items-center gap-2">
            <Avatar initials="JD" color="bg-indigo-500" size="xs" />
            <span className="text-[11px] text-zinc-500 flex-1 truncate">Jordan D.</span>
            <Settings className="w-3 h-3 text-zinc-400" />
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-10 border-b border-zinc-100 flex items-center gap-3 px-4 flex-shrink-0">
            <h2 className="text-[12.5px] font-semibold text-zinc-900">My Issues</h2>
            <div className="ml-auto flex items-center gap-1.5">
              <button className="flex items-center gap-1 h-6 px-2 rounded-md border border-zinc-200 text-[11px] text-zinc-500 hover:bg-zinc-50">
                <Filter className="w-[11px] h-[11px]" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1.5 h-6 px-2.5 rounded-md bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700">
                <Plus className="w-[11px] h-[11px]" />
                <span>New issue</span>
              </button>
            </div>
          </div>

          {/* Issue list */}
          <div className="flex-1 overflow-y-auto">

            {/* ── In Progress ── */}
            <div className="px-4 py-2 flex items-center gap-2 bg-white sticky top-0 border-b border-zinc-50">
              <span className="w-3 h-3 rounded-full border-2 border-orange-400 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              </span>
              <span className="text-[11px] font-semibold text-zinc-600">In Progress</span>
              <span className="text-[11px] text-zinc-400">3</span>
            </div>

            <IssueRow
              priority="urgent" status="in-progress" label="Bug"
              title="Resolve auth token race condition in session middleware"
              assignee="JD" assigneeColor="bg-indigo-500"
            />
            <IssueRow
              priority="high" status="in-progress" label="Feature"
              title="Migrate billing to Stripe Payment Intents API"
              assignee="SM" assigneeColor="bg-violet-500"
            />
            <IssueRow
              priority="high" status="in-progress" label="Improvement"
              title="Add distributed tracing with OpenTelemetry"
              assignee="AL" assigneeColor="bg-emerald-500"
            />

            {/* ── Todo ── */}
            <div className="px-4 py-2 mt-1 flex items-center gap-2 bg-white sticky top-0 border-b border-zinc-50">
              <Circle className="w-3 h-3 text-zinc-300" />
              <span className="text-[11px] font-semibold text-zinc-600">Todo</span>
              <span className="text-[11px] text-zinc-400">5</span>
            </div>

            <IssueRow
              priority="high"   status="todo" label="Feature"
              title="Implement SSO with SAML 2.0 support"
              assignee="JD" assigneeColor="bg-indigo-500"
            />
            <IssueRow
              priority="medium" status="todo" label="Feature"
              title="Design system: add virtualized data table component"
              assignee="SM" assigneeColor="bg-violet-500"
            />
            <IssueRow
              priority="medium" status="todo" label="Improvement"
              title="Optimize cold-start latency in Edge runtime functions"
              assignee="AL" assigneeColor="bg-emerald-500"
            />
            <IssueRow
              priority="low"    status="todo" label="Chore"
              title="Write API reference documentation for v2 endpoints"
              assignee="JD" assigneeColor="bg-indigo-500"
            />
            <IssueRow
              priority="low"    status="todo" label="Feature"
              title="Add webhook retry with exponential backoff"
              assignee="SM" assigneeColor="bg-violet-500"
            />

            {/* ── Done ── */}
            <div className="px-4 py-2 mt-1 flex items-center gap-2 bg-white sticky top-0 border-b border-zinc-50">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[11px] font-semibold text-zinc-600">Done</span>
              <span className="text-[11px] text-zinc-400">12 this week</span>
            </div>

            <IssueRow
              priority="high"   status="done" label="Improvement"
              title="Upgrade Next.js to version 15 and fix breaking changes"
              assignee="AL" assigneeColor="bg-emerald-500"
            />
            <IssueRow
              priority="medium" status="done" label="Feature"
              title="Add dark mode support to design system tokens"
              assignee="SM" assigneeColor="bg-violet-500"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

export default function SaasHero() {
  return (
    <section className="pt-[72px] pb-0 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Content */}
        <div className="pt-14 pb-12 max-w-3xl">

          {/* What's new badge */}
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 text-[12.5px] text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 transition-colors mb-8 group"
          >
            <span className="inline-flex items-center gap-1.5 font-medium text-indigo-600">
              <Zap className="w-3 h-3" />
              New
            </span>
            <span className="w-px h-3 bg-zinc-200" />
            Kairos AI: smart issue triage is in beta
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          {/* Headline */}
          <h1
            className="font-bold text-zinc-900 leading-[1.08] tracking-tight mb-5"
            style={{ fontSize: 'clamp(38px, 5.5vw, 62px)' }}
          >
            The project workspace
            <br />
            <span className="text-zinc-400">teams actually love.</span>
          </h1>

          {/* Sub-copy */}
          <p className="text-[17px] text-zinc-500 leading-relaxed max-w-xl mb-8">
            Ship fast and stay aligned. Kairos connects issues, pull requests, and
            your roadmap in one workspace — built for engineering teams who care about craft.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13.5px] font-medium rounded-[9px] hover:bg-zinc-700 transition-colors shadow-sm"
            >
              Start for free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-zinc-600 text-[13.5px] font-medium rounded-[9px] border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              Book a demo
            </Link>
          </div>

          {/* Social proof micro-copy */}
          <p className="mt-5 text-[12px] text-zinc-400">
            Free up to 5 members · No credit card required · 12,000+ engineering teams
          </p>
        </div>

        {/* Dashboard mockup — click or hover to watch the product demo */}
        <VideoModal duration="2:41">
          <DashboardMockup />
        </VideoModal>
      </div>
    </section>
  );
}
