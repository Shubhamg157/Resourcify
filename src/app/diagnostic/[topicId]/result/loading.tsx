import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function ResultLoading() {
  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header Skeleton ─── */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton variant="rounded" className="w-7 h-7 bg-crimson/20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        {/* ─── Title Skeleton ─── */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-4 w-60" />
        </div>

        {/* ─── Score + Confidence + Error Type Grid Skeleton ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card-elevated p-6 text-center border border-border bg-white rounded-xl space-y-3"
            >
              <Skeleton className="h-3.5 w-20 mx-auto" />
              <Skeleton className="h-10 w-24 mx-auto rounded-md" />
              <Skeleton className="h-3 w-28 mx-auto" />
            </div>
          ))}
        </div>

        {/* ─── Question Breakdown Skeleton ─── */}
        <div className="card-elevated p-6 mb-8 border border-border bg-white rounded-xl space-y-4">
          <Skeleton className="h-6 w-44 mb-2" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg bg-sand-50/50 border border-border/50"
              >
                <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Conceptual Gap Analysis (Weak vs Mastered) Skeleton ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weak Concepts */}
          <div className="card-elevated p-6 border border-border bg-white rounded-xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton variant="circular" className="w-2.5 h-2.5 bg-crimson/40" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          {/* Mastered Concepts */}
          <div className="card-elevated p-6 border border-border bg-white rounded-xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton variant="circular" className="w-2.5 h-2.5 bg-green-500/40" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/6" />
            </div>
          </div>
        </div>

        {/* ─── Root Cause Skeleton ─── */}
        <div className="card-elevated p-6 mb-8 border-l-4 border-l-crimson border border-border bg-white rounded-xl space-y-3">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>

        {/* ─── CTA Skeleton ─── */}
        <div className="text-center py-6 flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-64 rounded-lg" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
      </main>
    </div>
  );
}
