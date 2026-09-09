import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full bg-white border-b-[3px] border-brutalBlack sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Brutalist Pill Badge */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-schoolYellow border-[2.5px] border-brutalBlack shadow-brutal-sm flex items-center justify-center text-xl transform group-hover:-rotate-6 transition-transform">
              📢
            </div>
            <span className="text-2xl font-black tracking-tight text-brutalBlack ml-1">GapZero</span>
          </Link>
          {/* Campus Voice Badge */}
          <span className="bg-schoolYellow text-brutalBlack font-bold text-xs sm:text-sm px-2.5 py-0.5 border-[2.5px] border-brutalBlack shadow-brutal-sm uppercase tracking-wide hidden sm:inline-block">
            JEE COHORT '27
          </span>
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3 font-bold text-sm">
          <Link
            href="/topics"
            className="bg-brutalBlack text-white px-4 py-2 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal hover:bg-neutral-800 transition-colors uppercase tracking-wider text-xs sm:text-sm"
          >
            Diagnostic Hub
          </Link>
          <Link
            href="/dashboard"
            className="hidden md:inline-block bg-white text-brutalBlack px-4 py-2 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal hover:bg-paper-100 uppercase tracking-wider text-xs sm:text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/progress"
            className="hidden sm:inline-block bg-white text-brutalBlack px-4 py-2 border-[2.5px] border-brutalBlack shadow-brutal-sm btn-brutal hover:bg-paper-100 uppercase tracking-wider text-xs sm:text-sm"
          >
            Progress
          </Link>

          {/* User ID / Session Status Badge */}
          <div className="flex items-center gap-1.5 pl-2">
            <span className="hidden lg:inline text-xs font-mono text-neutral-600 font-semibold uppercase">SESSION:</span>
            <div className="bg-paper-200 text-brutalBlack px-3 py-1.5 border-[2.5px] border-brutalBlack shadow-brutal-sm flex items-center gap-1.5 font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-retroTeal inline-block animate-pulse"></span>
              ACTIVE
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
