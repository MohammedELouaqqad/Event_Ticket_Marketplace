export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            T
          </div>
          <span className="font-display text-sm font-semibold text-slate-900">TRICKER</span>
        </div>
        <p className="text-sm text-slate-500">
          Discover & book tickets for amazing events
        </p>
        <p className="text-xs text-slate-400">© 2026 TRICKER. All rights reserved.</p>
      </div>
    </footer>
  );
}
