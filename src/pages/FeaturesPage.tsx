import {
  MapPin, Camera, Bell, Activity, Shield, Zap, Smartphone, BarChart3,
  Route, FileCheck, Globe, Lock, ArrowRight,
} from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const featureGroups = [
  {
    title: 'For citizens',
    features: [
      { icon: Smartphone, title: 'One-tap reporting', desc: 'Open the app, snap a photo, confirm location. A report is filed in under 30 seconds.' },
      { icon: Camera, title: 'Photo evidence', desc: 'Attach multiple photos so authorities see exactly what needs fixing.' },
      { icon: MapPin, title: 'Precise geolocation', desc: 'GPS pin with automatic reverse-geocoded address. No guessing where the hazard is.' },
      { icon: Bell, title: 'Status notifications', desc: 'Get pinged when your report is assigned, in progress, resolved, or verified.' },
    ],
  },
  {
    title: 'For authorities',
    features: [
      { icon: Route, title: 'Smart routing', desc: 'Reports auto-forward to the right department by category and jurisdiction boundary.' },
      { icon: Activity, title: 'Status management', desc: 'Move reports through a clear workflow: reported → assigned → in progress → resolved → verified.' },
      { icon: BarChart3, title: 'Analytics dashboard', desc: 'Track response times, resolution rates, backlog, and crew performance in real time.' },
      { icon: FileCheck, title: 'Repair verification', desc: 'Inspectors confirm repairs with photo proof before a report is closed.' },
    ],
  },
  {
    title: 'Platform',
    features: [
      { icon: Shield, title: 'Row-level security', desc: 'Database-level isolation ensures personal data never leaks into public views.' },
      { icon: Globe, title: 'Live road alerts', desc: 'Broadcast active alerts to nearby drivers the moment a hazard is confirmed.' },
      { icon: Zap, title: 'Deduplication', desc: 'Smart matching flags duplicate reports of the same hazard to cut noise.' },
      { icon: Lock, title: 'API & webhooks', desc: 'Integrate with existing ticketing and GIS systems via REST and webhooks.' },
    ],
  },
];

export function FeaturesPage() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3">Features</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Built for citizens, designed for authorities
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto">
            Every feature in RoadGuard exists to move a hazard from reported to verified — faster, and with full transparency.
          </p>
        </div>
      </section>

      {featureGroups.map((group) => (
        <section key={group.title} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">{group.title}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {group.features.map((f) => (
              <GlassCard key={f.title} hover className="p-6">
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400">
                  <f.icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-400 leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <GlassCard strong className="p-10 sm:p-14 text-center">
          <h2 className="text-3xl font-bold text-white">See it in action</h2>
          <p className="mt-4 text-ink-300 max-w-xl mx-auto">Create a free account and file your first report in minutes.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register"><Button size="lg">Get started free <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link to="/pricing"><Button variant="secondary" size="lg">View pricing</Button></Link>
          </div>
        </GlassCard>
      </section>
    </MarketingLayout>
  );
}
