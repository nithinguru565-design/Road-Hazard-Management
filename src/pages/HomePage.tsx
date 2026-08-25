import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, MapPin, Zap, Camera, Activity, Bell, ArrowRight, Check, ChevronDown,
  Users, TrendingUp, Clock, CheckCircle2, Quote, Star,
} from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';

const features = [
  { icon: MapPin, title: 'Geo-located Reporting', desc: 'Drop a pin on the exact location of any hazard with GPS precision and automatic address detection.' },
  { icon: Camera, title: 'Photo Evidence', desc: 'Attach photos so authorities see the problem before they dispatch a crew — faster triage, fewer trips.' },
  { icon: Bell, title: 'Real-time Alerts', desc: 'Broadcast live road alerts to nearby drivers the moment a hazard is confirmed or escalates.' },
  { icon: Activity, title: 'Status Tracking', desc: 'Follow every report from submitted to verified with a transparent, timestamped status history.' },
  { icon: Shield, title: 'Authority Routing', desc: 'Reports auto-route to the right municipal department based on category and jurisdiction.' },
  { icon: Zap, title: 'Repair Verification', desc: 'Citizens and inspectors confirm repairs are done right, closing the accountability loop.' },
];

const benefits = [
  'Reduce response times by up to 60%',
  'Cut duplicate reports with smart deduplication',
  'Give residents a voice in road safety',
  'Build a permanent, searchable maintenance record',
  'Measure authority performance with real metrics',
  'Open data exports for transparency reports',
];

const stats = [
  { value: '48k+', label: 'Hazards reported', icon: TrendingUp },
  { value: '92%', label: 'Resolution rate', icon: CheckCircle2 },
  { value: '3.2h', label: 'Avg. response time', icon: Clock },
  { value: '120+', label: 'Municipalities', icon: Users },
];

const testimonials = [
  { name: 'Maria Chen', role: 'City Engineer, Portland', quote: 'RoadGuard cut our pothole backlog from months to days. The photo-first triage alone paid for the platform.', rating: 5 },
  { name: 'David Okoye', role: 'Resident Advocate', quote: 'Finally a tool where reports don\'t disappear into a void. My neighbors actually see progress.', rating: 5 },
  { name: 'Sarah Lindqvist', role: 'Operations Lead, Transit Authority', quote: 'Assignment routing means the right crew gets the right job. Our dispatch overhead dropped dramatically.', rating: 5 },
];

const faqs = [
  { q: 'How does RoadGuard route reports to the right authority?', a: 'Each report is tagged with category and geolocation. RoadGuard matches those against jurisdiction boundaries and forwards the report to the responsible department automatically.' },
  { q: 'Can citizens track the status of their reports?', a: 'Yes. Every report has a public status timeline — reported, assigned, in progress, resolved, and verified — with timestamps and notes from the handling authority.' },
  { q: 'Do I need special hardware or sensors?', a: 'No. RoadGuard runs on any smartphone. Reports use your device GPS and camera; authorities use a standard web dashboard.' },
  { q: 'Is my data private?', a: 'Personal contact details are never shown publicly. Only the hazard location, photos, and status are visible to the community. Row-level security enforces this at the database level.' },
  { q: 'Can municipalities integrate RoadGuard with existing systems?', a: 'Yes. We offer a REST API and webhook integrations on the Pro and Civic plans for ticketing and GIS systems.' },
];

export function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <FeaturesSection />
      <BenefitsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </MarketingLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <Badge className="border-brand-400/30 bg-brand-500/10 text-brand-300">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-brand-400 animate-pulse-ring" />
                <span className="relative w-2 h-2 rounded-full bg-brand-400" />
              </span>
              Live in 120+ municipalities
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
              Report road hazards.
              <br />
              <span className="text-gradient">Track them to resolution.</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-xl">
              RoadGuard turns every citizen into a road-safety sensor. Snap a photo, drop a pin, and watch your report move from filed to fixed — with full transparency at every step.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/register">
                <Button size="lg">
                  Start reporting free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="secondary" size="lg">
                  Explore features
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink-400">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> No credit card</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-400" /> Free for citizens</span>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <GlassCard strong className="p-5 rotate-[-1deg] animate-float">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-warn-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
          </div>
          <Badge className="border-warn-500/30 bg-warn-500/15 text-warn-400">
            <Zap className="w-3 h-3" /> Critical
          </Badge>
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-ink-800 to-ink-950 border border-white/10 grid place-items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="relative flex flex-col items-center text-center px-6">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-danger-500/20 border border-danger-500/30 mb-3">
              <MapPin className="w-7 h-7 text-danger-400" />
            </span>
            <p className="text-white font-semibold">Large pothole on Maple Ave</p>
            <p className="text-xs text-ink-400 mt-1">40.7128° N, 74.0060° W</p>
          </div>
          <div className="absolute left-6 bottom-6 right-6 flex items-center justify-between">
            <Badge className="border-warn-500/30 bg-warn-500/15 text-warn-400">In Progress</Badge>
            <span className="text-xs text-ink-400">3h ago</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['Reported', 'Assigned', 'In Progress'].map((s, i) => (
            <div key={s} className="rounded-lg bg-white/5 border border-white/10 p-2.5">
              <p className="text-[10px] text-ink-400 uppercase tracking-wide">{i + 1}</p>
              <p className="text-xs text-white font-medium mt-0.5">{s}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="absolute -bottom-6 -left-6 p-4 w-56 rotate-[2deg] hidden sm:block">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30">
            <CheckCircle2 className="w-5 h-5 text-brand-400" />
          </span>
          <div>
            <p className="text-sm text-white font-semibold">Repaired & verified</p>
            <p className="text-xs text-ink-400">2 reports closed today</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <SectionHeading
        center
        eyebrow="Features"
        title="Everything you need to close the loop"
        subtitle="From the first photo to the final verification, RoadGuard covers the entire hazard lifecycle for citizens and authorities alike."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <GlassCard key={f.title} hover className="p-6 animate-fade-up" >
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400">
              <f.icon className="w-6 h-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-400 leading-relaxed">{f.desc}</p>
            <span className="mt-4 inline-block text-xs text-ink-600">{String(i + 1).padStart(2, '0')}</span>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Benefits"
            title="Better roads, measurable results"
            subtitle="RoadGuard isn't just a complaint box. It's an accountability system that produces real, trackable outcomes."
          />
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center w-6 h-6 rounded-full bg-brand-500/20 border border-brand-400/30 shrink-0">
                  <Check className="w-3.5 h-3.5 text-brand-400" />
                </span>
                <span className="text-ink-200">{b}</span>
              </li>
            ))}
          </ul>
          <Link to="/about" className="mt-8 inline-block">
            <Button variant="secondary">
              Learn our story <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <GlassCard strong className="p-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-4xl font-bold text-gradient">60%</p>
              <p className="mt-1 text-sm text-ink-400">Faster response times</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gradient">3.2h</p>
              <p className="mt-1 text-sm text-ink-400">Average resolution</p>
            </div>
            <div className="col-span-2 h-px bg-white/10" />
            <div>
              <p className="text-4xl font-bold text-gradient">48k+</p>
              <p className="mt-1 text-sm text-ink-400">Hazards reported</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gradient">92%</p>
              <p className="mt-1 text-sm text-ink-400">Resolution rate</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-6 text-center">
            <span className="mx-auto grid place-items-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-brand-400">
              <s.icon className="w-6 h-6" />
            </span>
            <p className="mt-4 text-3xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-sm text-ink-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <SectionHeading
        center
        eyebrow="Testimonials"
        title="Trusted by cities and citizens"
        subtitle="Real teams using RoadGuard to keep their roads safe."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <GlassCard key={t.name} hover className="p-6">
            <Quote className="w-8 h-8 text-brand-400/40" />
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-warn-400 text-warn-400" />
              ))}
            </div>
            <p className="mt-4 text-ink-200 leading-relaxed text-sm">"{t.quote}"</p>
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-ink-400">{t.role}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <SectionHeading
        center
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="Everything you need to know about how RoadGuard works."
      />
      <div className="mt-12 space-y-3">
        {faqs.map((f, i) => (
          <GlassCard key={i} className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-white font-medium">{f.q}</span>
              <ChevronDown className={`w-5 h-5 text-ink-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-ink-300 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <GlassCard strong className="relative overflow-hidden p-10 sm:p-14 text-center">
        <div className="absolute inset-0 bg-hero-glow opacity-60 pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to fix your roads?</h2>
          <p className="mt-4 text-ink-300 max-w-xl mx-auto">
            Join thousands of citizens and municipalities making roads safer, one report at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Create free account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg">Talk to us</Button>
            </Link>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
