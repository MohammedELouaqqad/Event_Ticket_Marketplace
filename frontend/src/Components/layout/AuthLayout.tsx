import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel — desktop */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-lg">
              T
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              TRICKER
            </span>
          </div>
        </div>
        <div className="relative z-10 animate-slide-up">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Your gateway to
            <br />
            <span className="text-brand-300">unforgettable events</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
            Discover concerts, festivals, sports and more. Book tickets in seconds
            and never miss the moment.
          </p>
          <div className="mt-10 flex gap-8">
            <div>
              <p className="font-display text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/50">Events listed</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-white">10k+</p>
              <p className="text-sm text-white/50">Tickets sold</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-white">4.9</p>
              <p className="text-sm text-white/50">User rating</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-sm text-white/30">
          © 2026 TRICKER. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-surface-muted px-4 py-12 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            T
          </div>
          <span className="font-display text-xl font-bold text-slate-900">TRICKER</span>
        </div>
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
