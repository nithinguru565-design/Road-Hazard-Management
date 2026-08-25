import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { count } = await supabase.from('hazards').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setReportCount(count ?? 0);
      const { count: r2 } = await supabase
        .from('hazards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['resolved', 'verified']);
      setResolvedCount(r2 ?? 0);
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    await supabase.from('users').update({ full_name: fullName, phone: phone || null }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-ink-400">Manage your personal information and public profile.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <GlassCard strong className="p-6 text-center">
            <span className="mx-auto grid place-items-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/40 to-accent-500/30 border border-white/10 text-2xl font-bold text-white">
              {initials}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-white">{profile?.full_name || 'User'}</h2>
            <p className="text-sm text-ink-400">{user?.email}</p>
            <Badge className="mt-3 border-brand-400/30 bg-brand-500/10 text-brand-300">
              <Shield className="w-3 h-3" /> {profile?.role ?? 'citizen'}
            </Badge>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-400">Reports filed</span>
                <span className="text-sm font-semibold text-white">{reportCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-400">Resolved</span>
                <span className="text-sm font-semibold text-brand-400">{resolvedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-400">Member since</span>
                <span className="text-sm font-semibold text-white">
                  {profile ? new Date(profile.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Personal information</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Full name" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} icon={<User className="w-4 h-4" />} />
                <Input label="Email" id="email" value={user?.email ?? ''} disabled icon={<Mail className="w-4 h-4" />} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} placeholder="+1 (555) 000-0000" />
                <Input label="Role" id="role" value={profile?.role ?? 'citizen'} disabled icon={<Shield className="w-4 h-4" />} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-brand-400">
                    <CheckCircle2 className="w-4 h-4" /> Saved
                  </span>
                )}
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
