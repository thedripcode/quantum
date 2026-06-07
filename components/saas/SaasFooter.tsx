import Link from 'next/link';
import { Zap, ArrowRight, Github, Twitter } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features',  href: '#features' },
    { label: 'Pricing',   href: '#pricing'  },
    { label: 'Changelog', href: '#'         },
    { label: 'Roadmap',   href: '#'         },
    { label: 'Security',  href: '#'         },
  ],
  Company: [
    { label: 'About',    href: '#' },
    { label: 'Blog',     href: '#' },
    { label: 'Careers',  href: '#', badge: '4 open' },
    { label: 'Press',    href: '#' },
    { label: 'Brand',    href: '#' },
  ],
  Resources: [
    { label: 'Docs',         href: '#' },
    { label: 'API Reference',href: '#' },
    { label: 'Status',       href: '#' },
    { label: 'Community',    href: '#' },
    { label: 'GitHub',       href: '#' },
  ],
  Legal: [
    { label: 'Privacy',      href: '#' },
    { label: 'Terms',        href: '#' },
    { label: 'Cookies',      href: '#' },
    { label: 'DPA',          href: '#' },
    { label: 'Subprocessors',href: '#' },
  ],
};

export default function SaasFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950">

      {/* CTA band */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight leading-tight mb-2">
              Ready to ship faster?
            </h2>
            <p className="text-[14px] text-zinc-400 max-w-md">
              Join 12,000+ engineering teams already using Kairos. Free to start — no credit card required.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-[13.5px] font-medium rounded-[9px] hover:bg-indigo-500 transition-colors"
            >
              Start for free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-zinc-400 text-[13.5px] font-medium rounded-[9px] border border-white/10 hover:border-white/20 hover:text-white transition-colors"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 mb-12">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/saas" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-[22px] h-[22px] bg-indigo-600 rounded-[5px] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-[14px] text-white tracking-tight">Kairos</span>
            </Link>
            <p className="text-[12.5px] text-zinc-500 leading-relaxed mb-5 max-w-[200px]">
              The project workspace for engineering teams who ship.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-[12.5px] text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                      {'badge' in link && link.badge && (
                        <span className="text-[9.5px] font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-px rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-zinc-600">
            © {year} Kairos, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-zinc-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
