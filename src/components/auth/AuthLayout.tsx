import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  altLink: { text: string; to: string; label: string };
}

export function AuthLayout({ children, title, subtitle, altLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col p-6 sm:p-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white transition w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30">
              <Shield className="w-5 h-5 text-brand-400" />
            </span>
            <span className="font-display font-bold text-xl text-white">
              Road<span className="text-brand-400">Guard</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-ink-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-ink-400 text-center">
            {altLink.text}{' '}
            <Link to={altLink.to} className="text-brand-400 hover:underline font-medium">
              {altLink.label}
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex relative overflow-hidden bg-ink-900 border-l border-white/10">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative flex flex-col justify-center p-16">
          <blockquote className="text-2xl font-display text-white leading-snug max-w-md">
            "RoadGuard turned our pothole backlog from a political liability into a measurable success story."
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-brand-500/40 to-accent-500/30 border border-white/10 text-sm font-bold text-white">
              MC
            </span>
            <div>
              <p className="text-white font-semibold text-sm">Maria Chen</p>
              <p className="text-xs text-ink-400">City Engineer, Portland</p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {[
              { v: '48k+', l: 'Reports' },
              { v: '92%', l: 'Resolved' },
              { v: '3.2h', l: 'Avg. response' },
            ].map((s) => (
              <div key={s.l} className="glass rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-gradient">{s.v}</p>
                <p className="text-xs text-ink-400 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
