import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Building2, Zap } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Citizen',
    icon: Sparkles,
    price: { monthly: 0, yearly: 0 },
    desc: 'For individuals who want to report hazards in their community.',
    features: [
      'Unlimited hazard reports',
      'Photo attachments',
      'Status notifications',
      'Public status tracking',
      'Community road alerts',
    ],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    icon: Zap,
    price: { monthly: 19, yearly: 15 },
    desc: 'For power users, HOAs, and small organizations.',
    features: [
      'Everything in Citizen',
      'Custom report categories',
      'Saved locations & watch areas',
      'CSV / JSON exports',
      'Priority support',
      'Up to 5 team members',
    ],
    cta: 'Start Pro trial',
    highlighted: true,
  },
  {
    name: 'Civic',
    icon: Building2,
    price: { monthly: 199, yearly: 165 },
    desc: 'For municipalities and large authorities.',
    features: [
      'Everything in Pro',
      'Authority routing & assignments',
      'Repair verification workflow',
      'Analytics dashboard',
      'REST API & webhooks',
      'Unlimited team members',
      'Dedicated onboarding',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3">Pricing</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Simple, transparent pricing</h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto">Free for citizens. Pay only when you need team tools or civic-scale features.</p>

          <div className="mt-8 inline-flex items-center gap-1 glass rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition', !yearly ? 'bg-brand-500 text-white' : 'text-ink-300 hover:text-white')}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn('px-4 py-2 rounded-full text-sm font-medium transition', yearly ? 'bg-brand-500 text-white' : 'text-ink-300 hover:text-white')}
            >
              Yearly <span className="text-xs opacity-80">save 20%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard
              key={plan.name}
              strong={plan.highlighted}
              className={cn('p-8 relative flex flex-col', plan.highlighted && 'border-brand-400/40 shadow-glow')}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400">
                <plan.icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-ink-400 leading-relaxed">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">${yearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-ink-400 text-sm">/mo</span>
              </div>
              {yearly && plan.price.yearly > 0 && (
                <p className="mt-1 text-xs text-brand-400">billed annually</p>
              )}
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-200">
                    <Check className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to={plan.name === 'Civic' ? '/contact' : '/register'} className="block">
                  <Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-ink-400">
            All plans include data export, row-level security, and 99.9% uptime. Need something custom?{' '}
            <Link to="/contact" className="text-brand-400 hover:underline">Talk to us</Link>.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}
