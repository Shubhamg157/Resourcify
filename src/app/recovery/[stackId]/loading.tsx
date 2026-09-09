import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function RecoveryLoading() {
  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header Skeleton ─── */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton variant="rounded" className="w-7 h-7 bg-crimson/20" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        {/* ─── Title Skeleton ─── */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-60" />
        </div>

        {/* ─── Progress Steps Skeleton ─── */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" className="w-6 h-6" />
                <Skeleton className="h-4 w-16" />
              </div>
              {i < 5 && <span className="text-pearl-dark text-xs">→</span>}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Explanation Card Skeleton ─── */}
        <div className="card-elevated p-6 mb-6 border border-border bg-white rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="p-4 rounded-lg bg-sand-50/60 border border-border/50 space-y-2">
            <Skeleton className="h-4 w-28" />
            <SkeletonText lines={3} />
          </div>
          <div className="p-4 rounded-lg bg-crimson-50/40 border border-crimson-100/50 space-y-2">
            <Skeleton className="h-4 w-36" />
            <SkeletonText lines={2} />
          </div>
        </div>

        {/* ─── Step 2: Formula Card Skeleton ─── */}
        <div className="card-elevated p-6 mb-6 border border-border bg-white rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="p-5 rounded-lg bg-obsidian-light/5 border border-border flex items-center justify-center">
            <Skeleton className="h-8 w-64 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        {/* ─── Step 3: Resource Card Skeleton ─── */}
        <div className="card-elevated p-6 mb-6 border border-border bg-white rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-44" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-sand-50/30">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-28 rounded-lg flex-shrink-0 ml-4" />
          </div>
        </div>

        {/* ─── Step 4: Practice Questions Skeleton ─── */}
        <div className="card-elevated p-6 mb-6 border border-border bg-white rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="space-y-3">
            <SkeletonText lines={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[1, 2, 3, 4].map((opt) => (
                <div key={opt} className="p-3.5 rounded-lg border border-border bg-sand-50/40 flex items-center gap-3">
                  <Skeleton variant="circular" className="w-5 h-5 flex-shrink-0" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Step 5: Recheck CTA Skeleton ─── */}
        <div className="card-elevated p-6 text-center border border-border bg-white rounded-xl space-y-3">
          <Skeleton className="h-5 w-48 mx-auto" />
          <Skeleton className="h-4 w-80 max-w-full mx-auto" />
          <Skeleton className="h-11 w-44 rounded-lg mx-auto mt-2" />
        </div>
      </main>
    </div>
  );
}
