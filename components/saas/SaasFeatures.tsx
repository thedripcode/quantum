import {
  GitBranch, Zap, RefreshCw, BarChart3, Users, Command,
  GitPullRequest, Bell, ArrowUpRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon:  GitBranch,
    title: 'Git-native issues',
    desc:  'Pull requests, commits, and deployments automatically update issue status. Zero manual linking, ever.',
  },
  {
    icon:  Zap,
    title: 'AI-powered triage',
    desc:  'Smart priority suggestions based on codebase activity, customer reports, and historical patterns.',
  },
  {
    icon:  RefreshCw,
    title: 'Sprint cycles',
    desc:  'Time-boxed cycles with auto-calculated team capacity. Stop overcommitting. Start shipping consistently.',
  },
  {
    icon:  BarChart3,
    title: 'Engineering analytics',
    desc:  'Cycle time, throughput, and WIP limits tracked automatically as you work — no dashboards to configure.',
  },
  {
    icon:  Users,
    title: 'Real-time presence',
    desc:  "See exactly who's working on what, right now. Full team awareness without the Slack interruptions.",
  },
  {
    icon:  Command,
    title: 'Keyboard-first design',
    desc:  'Every action is a shortcut away. A command palette built for engineers who prefer keys over clicks.',
  },
];

const INTEGRATIONS = [
  { icon: GitBranch,    label: 'GitHub'     },
  { icon: GitPullRequest, label: 'GitLab'   },
  { icon: Bell,         label: 'Slack'      },
  { icon: Zap,          label: 'Zapier'     },
  { icon: BarChart3,    label: 'Datadog'    },
  { icon: Users,        label: 'PagerDuty'  },
];

export default function SaasFeatures() {
  return (
    <section id="features" className="py-24 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.14em] mb-3">
            Features
          </p>
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[28px] sm:text-[32px] font-bold text-zinc-900 tracking-tight leading-tight">
              How teams ship faster with Kairos
            </h2>
            <a
              href="#"
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors flex-shrink-0 pb-1"
            >
              See all features
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 rounded-xl overflow-hidden border border-zinc-100">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`bg-white p-6 flex flex-col gap-3 hover:bg-zinc-50/60 transition-colors group ${
                  i === 0 ? 'rounded-tl-xl' :
                  i === 2 ? 'rounded-tr-xl sm:rounded-tr-none lg:rounded-tr-xl' :
                  i === 3 ? 'rounded-bl-xl sm:rounded-bl-none lg:rounded-bl-xl' :
                  i === 5 ? 'rounded-br-xl' : ''
                }`}
              >
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center group-hover:border-zinc-200 transition-colors">
                  <Icon className="w-4 h-4 text-zinc-600" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-zinc-900 mb-1.5">{f.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrations strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider flex-shrink-0">
            Connects with
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEGRATIONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 text-[12px] text-zinc-600 bg-white hover:border-zinc-300 hover:bg-zinc-50 transition-colors cursor-default"
              >
                <Icon className="w-3 h-3 text-zinc-400" strokeWidth={1.75} />
                {label}
              </div>
            ))}
            <div className="flex items-center px-3 py-1.5 rounded-full border border-dashed border-zinc-300 text-[12px] text-zinc-400">
              +40 more
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
