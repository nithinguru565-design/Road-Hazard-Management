import { useState } from 'react';
import { Bell, Globe, Shield, Monitor, Moon, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({ statusChanges: true, newAlerts: true, weeklyDigest: false });
  const [privacy, setPrivacy] = useState({ shareLocation: true, publicProfile: false });
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your preferences and account configuration.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Notifications */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-400/25 text-brand-400">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <p className="text-sm text-ink-400">Choose what you want to be notified about.</p>
            </div>
          </div>
          <div className="space-y-4">
            <Toggle
              label="Status changes"
              desc="Get notified when your reports change status."
              checked={notifications.statusChanges}
              onChange={(v) => setNotifications({ ...notifications, statusChanges: v })}
            />
            <Toggle
              label="New road alerts"
              desc="Receive alerts about hazards near you."
              checked={notifications.newAlerts}
              onChange={(v) => setNotifications({ ...notifications, newAlerts: v })}
            />
            <Toggle
              label="Weekly digest"
              desc="A summary of your reports every Monday."
              checked={notifications.weeklyDigest}
              onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
            />
          </div>
        </GlassCard>

        {/* Privacy */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-400/25 text-accent-400">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Privacy</h2>
              <p className="text-sm text-ink-400">Control how your data is used.</p>
            </div>
          </div>
          <div className="space-y-4">
            <Toggle
              label="Share location"
              desc="Allow RoadGuard to use your location for nearby alerts."
              checked={privacy.shareLocation}
              onChange={(v) => setPrivacy({ ...privacy, shareLocation: v })}
            />
            <Toggle
              label="Public profile"
              desc="Make your name visible on reports you file."
              checked={privacy.publicProfile}
              onChange={(v) => setPrivacy({ ...privacy, publicProfile: v })}
            />
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-ink-200">
              <Monitor className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
              <p className="text-sm text-ink-400">Customize how RoadGuard looks.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
              { id: 'light', label: 'Light', icon: Globe },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition',
                  theme === t.id ? 'bg-brand-500/15 border-brand-400/40 text-white' : 'bg-white/5 border-white/10 text-ink-300 hover:bg-white/10',
                )}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{t.label}</span>
                {theme === t.id && <Check className="w-4 h-4 text-brand-400" />}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Language */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-ink-200">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">Language</h2>
              <p className="text-sm text-ink-400">Choose your preferred language.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'en', label: 'English' },
              { id: 'es', label: 'Español' },
              { id: 'fr', label: 'Français' },
              { id: 'de', label: 'Deutsch' },
              { id: 'pt', label: 'Português' },
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition',
                  language === l.id ? 'bg-brand-500/15 border-brand-400/40 text-white' : 'bg-white/5 border-white/10 text-ink-300 hover:bg-white/10',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save settings'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-brand-400">
              <CheckCircle2 className="w-4 h-4" /> Settings saved
            </span>
          )}
        </div>
      </form>
    </DashboardLayout>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition shrink-0',
          checked ? 'bg-brand-500' : 'bg-white/10',
        )}
      >
        <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform', checked && 'translate-x-5')} />
      </button>
    </label>
  );
}
