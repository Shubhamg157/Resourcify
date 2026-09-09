import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressLoading() {
  return (
    <div className="min-h-screen bg-pearl">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="w-7 h-7 bg-crimson/20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 animate-fade-in space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Overall Mastery Gauge / Card */}
        <div className="card-elevated p-6 bg-white rounded-xl flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton variant="circular" className="w-20 h-20" />
        </div>

        {/* Subject Mastery Breakdown Skeletons */}
        <div className="space-y-6">
          {[1, 2, 3].map((sub) => (
            <div key={sub} className="card-elevated p-6 bg-white rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-8 h-8" />
                  <Skeleton className="h-6 w-36" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              {/* Mastery bar */}
              <Skeleton className="h-3 w-full rounded-full" />

              {/* Concepts list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[1, 2, 3, 4].map((c) => (
                  <div key={c} className="p-3 bg-sand-50/40 rounded-lg flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
