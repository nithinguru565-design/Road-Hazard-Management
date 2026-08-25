import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, User, Settings, MapPin, Bell, Activity, FileText,
  LogOut, Menu, X, Search,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Hazards', to: '/dashboard/hazards', icon: MapPin },
  { label: 'Alerts', to: '/dashboard/alerts', icon: Bell },
  { label: 'Activity', to: '/dashboard/activity', icon: Activity },
  { label: 'Reports', to: '/dashboard/reports', icon: FileText },
];

const accountItems = [
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-ink-950/50 backdrop-blur-xl sticky top-0 h-screen">
        <SidebarContent
          profile={profile}
          email={user?.email}
          initials={initials}
          isActive={isActive}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Sidebar (mobile drawer) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-white/10 flex flex-col animate-fade-in">
            <button className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-lg bg-white/5 text-white" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
            <SidebarContent
              profile={profile}
              email={user?.email}
              initials={initials}
              isActive={isActive}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopNav onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  profile, email, initials, isActive, onSignOut,
}: {
  profile: { full_name: string; role: string } | null;
  email: string | undefined;
  initials: string;
  isActive: (to: string) => boolean;
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="p-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-400/30">
            <Shield className="w-5 h-5 text-brand-400" />
          </span>
          <span className="font-display font-bold text-lg text-white">
            Road<span className="text-brand-400">Guard</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">Main</p>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
              isActive(item.to) ? 'bg-brand-500/15 text-white border border-brand-400/25' : 'text-ink-300 hover:text-white hover:bg-white/5',
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
        <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">Account</p>
        {accountItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
              isActive(item.to) ? 'bg-brand-500/15 text-white border border-brand-400/25' : 'text-ink-300 hover:text-white hover:bg-white/5',
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/30 border border-white/10 text-xs font-bold text-white shrink-0">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-ink-400 truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-300 hover:text-danger-300 hover:bg-danger-500/10 transition"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </>
  );
}

function TopNav({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/60 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16">
        <button className="lg:hidden grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white" onClick={onMenu} aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search hazards, reports..."
              className="input py-2.5 pl-11 text-sm"
            />
          </div>
        </div>
        <button className="relative grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-ink-300 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400" />
        </button>
      </div>
    </header>
  );
}
