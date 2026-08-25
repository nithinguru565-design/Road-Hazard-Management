import { useEffect, useState, useCallback } from 'react';
import {
  MapPin, TrendingUp, CheckCircle2, Clock, Plus, AlertTriangle,
  Activity as ActivityIcon, ArrowRight, Loader2, X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import {
  HAZARD_CATEGORIES, HAZARD_SEVERITIES, HAZARD_STATUSES,
  type Hazard, type HazardCategory, type HazardSeverity,
} from '@/lib/types';
import { cn } from '@/lib/utils';

const statusMeta = (status: string) =>
  HAZARD_STATUSES.find((s) => s.value === status) ?? HAZARD_STATUSES[0];
const severityMeta = (sev: string) =>
  HAZARD_SEVERITIES.find((s) => s.value === sev) ?? HAZARD_SEVERITIES[1];

export function DashboardPage() {
  const { user } = useAuth();
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, active: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadHazards = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('hazards')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    const rows = (data ?? []) as Hazard[];
    setHazards(rows);
    setStats({
      total: rows.length,
      resolved: rows.filter((h) => h.status === 'resolved' || h.status === 'verified').length,
      active: rows.filter((h) => !['resolved', 'verified', 'rejected'].includes(h.status)).length,
      critical: rows.filter((h) => h.severity === 'critical').length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHazards();
  }, [loadHazards]);

  const recent = hazards.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back{user?.email ? '' : ''}</h1>
          <p className="mt-1 text-sm text-ink-400">Here's what's happening with road hazards in your area.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Report a hazard
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={MapPin} label="Total reports" value={stats.total} tone="brand" />
        <StatCard icon={ActivityIcon} label="Active" value={stats.active} tone="accent" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} tone="success" />
        <StatCard icon={AlertTriangle} label="Critical" value={stats.critical} tone="danger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Recent hazards</h2>
              <Link to="/dashboard/hazards" className="text-sm text-brand-400 hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 text-ink-400 animate-spin" /></div>
            ) : recent.length === 0 ? (
              <EmptyState onReport={() => setShowForm(true)} />
            ) : (
              <div className="space-y-3">
                {recent.map((h) => (
                  <HazardRow key={h.id} hazard={h} />
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent activity</h2>
            <div className="space-y-4">
              {recent.length === 0 ? (
                <p className="text-sm text-ink-400">No recent activity.</p>
              ) : (
                recent.slice(0, 4).map((h) => {
                  const sm = statusMeta(h.status);
                  return (
                    <div key={h.id} className="flex gap-3">
                      <span className="mt-0.5 w-2 h-2 rounded-full bg-brand-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{h.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">
                          marked <span className={sm.color.split(' ')[0]}>{sm.label}</span> · {timeAgo(h.updated_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick actions</h2>
            <div className="space-y-2">
              <Link to="/dashboard/hazards" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <span className="text-sm text-white">View all hazards</span>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </Link>
              <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <span className="text-sm text-white">Edit profile</span>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </Link>
              <Link to="/settings" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <span className="text-sm text-white">Account settings</span>
                <ArrowRight className="w-4 h-4 text-ink-400" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {showForm && <ReportHazardModal onClose={() => setShowForm(false)} onCreated={loadHazards} />}
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof MapPin; label: string; value: number; tone: string }) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-500/15 border-brand-400/25 text-brand-400',
    accent: 'bg-accent-500/15 border-accent-400/25 text-accent-400',
    success: 'bg-brand-500/15 border-brand-400/25 text-brand-400',
    danger: 'bg-danger-500/15 border-danger-400/25 text-danger-400',
  };
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <span className={cn('grid place-items-center w-11 h-11 rounded-xl border', tones[tone])}>
          <Icon className="w-5 h-5" />
        </span>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="mt-3 text-sm text-ink-400">{label}</p>
    </GlassCard>
  );
}

function HazardRow({ hazard }: { hazard: Hazard }) {
  const sm = statusMeta(hazard.status);
  const svm = severityMeta(hazard.severity);
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition">
      <span className={cn('grid place-items-center w-10 h-10 rounded-lg border shrink-0', svm.color)}>
        <MapPin className="w-5 h-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white font-medium truncate">{hazard.title}</p>
        <p className="text-xs text-ink-400 mt-0.5 truncate">
          {hazard.category} · {hazard.address ?? `${hazard.latitude.toFixed(4)}, ${hazard.longitude.toFixed(4)}`} · {timeAgo(hazard.created_at)}
        </p>
      </div>
      <Badge className={cn('shrink-0', sm.color)}>{sm.label}</Badge>
    </div>
  );
}

function EmptyState({ onReport }: { onReport: () => void }) {
  return (
    <div className="py-12 text-center">
      <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-ink-400">
        <MapPin className="w-7 h-7" />
      </span>
      <p className="mt-4 text-sm text-ink-300">No hazards reported yet.</p>
      <p className="text-xs text-ink-500 mt-1">Be the first to report one in your area.</p>
      <Button className="mt-5" onClick={onReport}>
        <Plus className="w-4 h-4" /> Report a hazard
      </Button>
    </div>
  );
}

function ReportHazardModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HazardCategory>('pothole');
  const [severity, setSeverity] = useState<HazardSeverity>('medium');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      () => setError('Could not get your location. Please enter coordinates manually.'),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please provide valid coordinates (use "Use my location").');
      return;
    }
    if (!user) {
      setError('You must be signed in to report a hazard.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('hazards').insert({
      title,
      description: description || null,
      category,
      severity,
      latitude,
      longitude,
      address: address || null,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <GlassCard strong className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Report a hazard</h2>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-lg bg-white/5 text-ink-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 text-sm text-danger-300">
              {error}
            </div>
          )}
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Large pothole on Maple Ave" />
          <Textarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the hazard..." />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as HazardCategory)}>
              {HAZARD_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
            <Select label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value as HazardSeverity)}>
              {HAZARD_SEVERITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </div>
          <Input label="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, City" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude" type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.7128" />
            <Input label="Longitude" type="text" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.0060" />
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={useMyLocation}>
            <MapPin className="w-4 h-4" /> Use my location
          </Button>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit report'}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
