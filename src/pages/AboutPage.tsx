import { Shield, Target, Users, Globe, Heart, Award } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const values = [
  { icon: Target, title: 'Accountability', desc: 'Every report has a trail. No more black boxes — progress is visible to everyone involved.' },
  { icon: Users, title: 'Community first', desc: 'Citizens and authorities are partners, not adversaries. We design for both sides of the table.' },
  { icon: Globe, title: 'Open by default', desc: 'Road data should be accessible. We support open exports and transparency reporting.' },
  { icon: Heart, title: 'Safety obsessed', desc: 'A missed pothole can be a fatal one. We treat every report as a safety issue until proven otherwise.' },
  { icon: Award, title: 'Measurable impact', desc: 'We hold ourselves to outcomes — response times, resolution rates — not vanity metrics.' },
  { icon: Shield, title: 'Privacy respected', desc: 'Personal details stay private. Only hazard data is shared with the community.' },
];

const team = [
  { name: 'Aisha Karim', role: 'Co-founder & CEO', initials: 'AK' },
  { name: 'Marco Reyes', role: 'Co-founder & CTO', initials: 'MR' },
  { name: 'Lena Hoffmann', role: 'Head of Product', initials: 'LH' },
  { name: 'Tomás Silva', role: 'Head of Civic Partnerships', initials: 'TS' },
];

export function AboutPage() {
  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3">About us</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight">
            We build the bridge between citizens and city halls
          </h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            RoadGuard started in 2023 after our co-founder blew a tire on an unreported pothole. We believed reporting road issues shouldn't feel like shouting into the void — and that the data could make every city safer.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <GlassCard strong className="p-8">
            <h2 className="text-2xl font-bold text-white">Our mission</h2>
            <p className="mt-4 text-ink-300 leading-relaxed">
              To make road hazard reporting as easy as taking a photo, and to make resolution as transparent as a package tracker. We believe safer roads come from accountability — and accountability comes from visibility.
            </p>
            <p className="mt-4 text-ink-300 leading-relaxed">
              Today RoadGuard powers reporting for over 120 municipalities and processes tens of thousands of reports every month, from potholes and flooding to broken signage and dangerous debris.
            </p>
          </GlassCard>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '2023', l: 'Founded' },
              { v: '120+', l: 'Municipalities' },
              { v: '48k+', l: 'Hazards reported' },
              { v: '92%', l: 'Resolution rate' },
            ].map((s) => (
              <GlassCard key={s.l} className="p-6 text-center">
                <p className="text-3xl font-bold text-gradient">{s.v}</p>
                <p className="mt-1 text-sm text-ink-400">{s.l}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading center eyebrow="Values" title="What we stand for" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <GlassCard key={v.title} hover className="p-6">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400">
                <v.icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-400 leading-relaxed">{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading center eyebrow="Team" title="The people behind RoadGuard" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <GlassCard key={m.name} hover className="p-6 text-center">
              <span className="mx-auto grid place-items-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/30 to-accent-500/20 border border-white/10 text-xl font-bold text-white">
                {m.initials}
              </span>
              <p className="mt-4 text-white font-semibold">{m.name}</p>
              <p className="text-xs text-ink-400 mt-1">{m.role}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <GlassCard strong className="p-10 sm:p-14 text-center">
          <h2 className="text-3xl font-bold text-white">Want to join our mission?</h2>
          <p className="mt-4 text-ink-300 max-w-xl mx-auto">We're always looking for civic-minded builders.</p>
          <div className="mt-8">
            <Link to="/contact"><Button size="lg">Get in touch</Button></Link>
          </div>
        </GlassCard>
      </section>
    </MarketingLayout>
  );
}
