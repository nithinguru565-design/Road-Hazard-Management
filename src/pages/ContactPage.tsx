import { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@roadguard.app' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 010-2023' },
  { icon: MapPin, label: 'Office', value: '440 Civic Plaza, Suite 12, Portland, OR' },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-3">Contact</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Let's talk</h1>
          <p className="mt-6 text-lg text-ink-300 max-w-2xl mx-auto">
            Questions about RoadGuard, civic partnerships, or integrations? We usually reply within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {contactInfo.map((c) => (
              <GlassCard key={c.label} className="p-5 flex items-center gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400 shrink-0">
                  <c.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-ink-400 uppercase tracking-wide">{c.label}</p>
                  <p className="text-sm text-white font-medium mt-0.5">{c.value}</p>
                </div>
              </GlassCard>
            ))}
            <GlassCard className="p-5">
              <MessageSquare className="w-5 h-5 text-brand-400" />
              <p className="mt-3 text-sm text-ink-300">Prefer live chat? Our support team is online weekdays 9am–6pm PT.</p>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard strong className="p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-12">
                  <span className="grid place-items-center w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-400/30">
                    <CheckCircle2 className="w-8 h-8 text-brand-400" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-white">Message sent</h3>
                  <p className="mt-2 text-sm text-ink-400 max-w-sm">
                    Thanks, {form.name || 'there'} — we've received your message and will get back to you shortly.
                  </p>
                  <Button variant="secondary" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: 'general', message: '' }); }}>
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full name"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                    <Input
                      label="Email"
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </div>
                  <Select
                    label="Topic"
                    id="topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  >
                    <option value="general">General inquiry</option>
                    <option value="civic">Civic partnership</option>
                    <option value="support">Support</option>
                    <option value="integration">Integration / API</option>
                  </Select>
                  <Textarea
                    label="Message"
                    id="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you need..."
                  />
                  <Button type="submit" size="lg" className="w-full">
                    Send message <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
