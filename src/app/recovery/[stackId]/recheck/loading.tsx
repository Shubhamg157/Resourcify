import { Skeleton } from '@/components/ui/skeleton';

export default function RecheckLoading() {
  return (
    <div className="min-h-screen bg-pearl">
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton variant="rounded" className="w-7 h-7 bg-crimson/20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Progress bar skeleton */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
          ))}
        </div>

        {/* Question card skeleton */}
        <div className="card-elevated p-6 border border-border bg-white rounded-xl space-y-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2, 3].map((opt) => (
              <div key={opt} className="flex items-center gap-3 p-3.5 rounded-lg border border-border bg-sand-50/30">
                <Skeleton variant="circular" className="w-6 h-6 flex-shrink-0" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
