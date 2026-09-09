import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      {/* ─── Navigation ─── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-crimson rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm font-[family-name:var(--font-serif)]">R</span>
          </div>
          <span className="text-lg font-bold text-obsidian font-[family-name:var(--font-serif)]">
            Resourcify
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-obsidian-subtle hover:text-obsidian transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/topics"
            className="btn-primary text-sm"
          >
            Start Diagnostic
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Ruled line accent */}
          <div className="flex justify-center mb-6">
            <span className="tag tag-sand text-xs uppercase tracking-widest">
              JEE Main &amp; Advanced
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-obsidian mb-6 leading-tight font-[family-name:var(--font-serif)]">
            Stop Studying{' '}
            <span className="crimson-underline text-crimson">Everything.</span>
            <br />
            Fix What&apos;s{' '}
            <span className="crimson-underline text-crimson">Broken.</span>
          </h1>

          <p className="text-lg text-obsidian-subtle max-w-xl mx-auto mb-10 leading-relaxed">
            Resourcify doesn&apos;t give you more resources — it finds the{' '}
            <strong className="text-obsidian">exact concept</strong> you don&apos;t
            understand and gives you the{' '}
            <strong className="text-obsidian">smallest possible fix</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/topics" className="btn-primary text-base px-8 py-3">
              Find My Gap →
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-3">
              View Dashboard
            </Link>
          </div>

          {/* ─── How It Works ─── */}
          <div className="border-t border-border pt-12">
            <p className="text-xs uppercase tracking-widest text-sand mb-8 font-semibold">
              The Resourcify Loop
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { step: '01', title: 'Diagnose', desc: '5 targeted questions find your gap' },
                { step: '02', title: 'Identify', desc: 'AI names the exact misconception' },
                { step: '03', title: 'Recover', desc: 'Minimum resources to fix it' },
                { step: '04', title: 'Recheck', desc: 'Verify the fix, update your profile' },
              ].map((item) => (
                <div key={item.step} className="text-left">
                  <span className="mono-number text-xs text-crimson font-semibold block mb-2">
                    {item.step}
                  </span>
                  <h3 className="text-base font-semibold text-obsidian mb-1 font-[family-name:var(--font-serif)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-obsidian-subtle leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border px-8 py-4">
        <div className="flex items-center justify-between text-xs text-obsidian-subtle">
          <span>© 2024 Resourcify</span>
          <span className="mono-number">Built for JEE aspirants</span>
        </div>
      </footer>
    </div>
  );
}
