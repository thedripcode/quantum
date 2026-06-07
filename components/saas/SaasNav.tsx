'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features',  href: '#features'  },
  { label: 'Changelog', href: '#'           },
  { label: 'Pricing',   href: '#pricing'    },
  { label: 'Docs',      href: '#'           },
];

export default function SaasNav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-150 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-md border-b border-zinc-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-white border-b border-zinc-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-[52px] gap-6">

          {/* Logo */}
          <Link href="/saas" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-[22px] h-[22px] bg-indigo-600 rounded-[5px] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[14px] text-zinc-900 tracking-tight">Kairos</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-[13.5px] text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            <Link
              href="#"
              className="px-3 py-1.5 text-[13.5px] text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-[7px] bg-zinc-900 text-white text-[13px] font-medium rounded-[8px] hover:bg-zinc-700 transition-colors"
            >
              Get started
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto md:hidden p-1.5 text-zinc-500 hover:text-zinc-900 rounded-md"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-4 pb-4 pt-2 space-y-0.5">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="#" className="px-3 py-2 text-sm text-zinc-500 rounded-md">Sign in</Link>
            <Link
              href="#"
              className="px-3 py-2 text-sm font-medium bg-zinc-900 text-white rounded-[8px] text-center"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
