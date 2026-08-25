import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to: string) => location.pathname === to;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-3 glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-400/30">
              <Shield className="w-5 h-5 text-brand-400" />
              <span className="absolute inset-0 rounded-xl bg-brand-400/20 blur-md opacity-0 group-hover:opacity-100 transition" />
            </span>
            <span className="font-display font-bold text-lg text-white">
              Road<span className="text-brand-400">Guard</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  isActive(link.to)
                    ? 'text-white bg-white/10'
                    : 'text-ink-300 hover:text-white hover:bg-white/5',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary px-4 py-2 text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-ghost px-3 py-2 text-sm">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost px-4 py-2 text-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition',
                    isActive(link.to) ? 'text-white bg-white/10' : 'text-ink-300 hover:bg-white/5',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary px-4 py-2.5 text-sm">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleSignOut(); }}
                    className="btn-ghost px-4 py-2.5 text-sm justify-start"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost px-4 py-2.5 text-sm justify-start">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary px-4 py-2.5 text-sm">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
