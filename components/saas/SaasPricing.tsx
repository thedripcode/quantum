'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Zap } from 'lucide-react';

const PLANS = [
  {
    name:       'Starter',
    desc:       'For small teams getting started.',
    price:      { monthly: 0,  annual: 0 },
    cta:        'Get started free',
    ctaVariant: 'outline' as const,
    features:   [
      'Up to 5 members',
      '3 active projects',
      '1,000 issues/month',
      '7-day issue history',
      'GitHub integration',
      'Community support',
    ],
    notIncluded: [
      'Custom workflows',
      'Analytics & reports',
      'Priority support',
    ],
  },
  {
    name:       'Pro',
    desc:       'For growing engineering teams.',
    price:      { monthly: 12, annual: 10 },
    cta:        'Start 14-day trial',
    ctaVariant: 'primary' as const,
    featured:   true,
    features:   [
      'Unlimited members',
      'Unlimited projects',
      'Unlimited issues',
      'Full history',
      'All integrations',
      'Custom workflows',
      'Analytics & reports',
      'Priority support',
      'Time tracking',
      'Roadmap view',
    ],
  },
  {
    name:       'Enterprise',
    desc:       'For large organizations at scale.',
    price:      { monthly: null, annual: null },
    cta:        'Talk to sales',
    ctaVariant: 'outline' as const,
    features:   [
      'Everything in Pro',
      'SSO / SAML 2.0',
      'Audit logs',
      'Custom contracts & MSA',
      'Dedicated CSM',
      '99.9% uptime SLA',
      'On-premise option',
      'Custom integrations',
      'Advanced permissions',
      'Volume pricing',
    ],
  },
];

export default function SaasPricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-[0.14em] mb-3">
              Pricing
            </p>
            <h2 className="text-[28px] sm:text-[32px] font-bold text-zinc-900 tracking-tight leading-tight">
              Simple, transparent pricing
            </h2>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setAnnual(false)}
              className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all ${
                !annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-all flex items-center gap-1.5 ${
                annual ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Annual
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-px rounded-full">
                –20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`rounded-xl flex flex-col ${
                plan.featured
                  ? 'bg-zinc-900 text-white ring-1 ring-zinc-700 shadow-[0_8px_32px_rgba(0,0,0,0.14)]'
                  : 'bg-white border border-zinc-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
              }`}
            >
              {/* Card header */}
              <div className="p-6 pb-5">
                {plan.featured && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      Most popular
                    </span>
                  </div>
                )}

                <h3 className={`text-[15px] font-semibold mb-1 ${plan.featured ? 'text-white' : 'text-zinc-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-[12.5px] mb-5 ${plan.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {plan.desc}
                </p>

                {/* Price */}
                <div className="flex items-end gap-1.5 mb-5">
                  {plan.price.monthly === null ? (
                    <span className={`text-[30px] font-bold tracking-tight leading-none ${plan.featured ? 'text-white' : 'text-zinc-900'}`}>
                      Custom
                    </span>
                  ) : plan.price.monthly === 0 ? (
                    <span className={`text-[30px] font-bold tracking-tight leading-none ${plan.featured ? 'text-white' : 'text-zinc-900'}`}>
                      Free
                    </span>
                  ) : (
                    <>
                      <span className={`text-[13px] font-medium -mb-1 ${plan.featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        $
                      </span>
                      <span className={`text-[30px] font-bold tracking-tight leading-none ${plan.featured ? 'text-white' : 'text-zinc-900'}`}>
                        {annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className={`text-[12.5px] -mb-1 ${plan.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        /seat/mo
                      </span>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="#"
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : plan.featured
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-zinc-900 text-white hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Divider */}
              <div className={`h-px mx-6 ${plan.featured ? 'bg-white/10' : 'bg-zinc-100'}`} />

              {/* Features */}
              <div className="p-6 flex-1">
                <p className={`text-[11px] font-semibold uppercase tracking-wider mb-4 ${plan.featured ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  What's included
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={`w-3.5 h-3.5 mt-[1px] flex-shrink-0 ${plan.featured ? 'text-indigo-400' : 'text-emerald-500'}`} />
                      <span className={`text-[12.5px] ${plan.featured ? 'text-zinc-300' : 'text-zinc-600'}`}>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map(f => (
                    <li key={f} className="flex items-start gap-2.5 opacity-40">
                      <span className="w-3.5 h-3.5 mt-[1px] flex-shrink-0 flex items-center justify-center">
                        <span className="w-2.5 border-t border-zinc-400" />
                      </span>
                      <span className="text-[12.5px] text-zinc-500">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[12.5px] text-zinc-400 mt-8">
          All plans include a 14-day free trial. No credit card required.
          <a href="#" className="text-zinc-600 hover:text-zinc-900 ml-1 underline underline-offset-2">
            Compare all features →
          </a>
        </p>
      </div>
    </section>
  );
}
