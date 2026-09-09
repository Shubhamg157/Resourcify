import { Skeleton } from '@/components/ui/skeleton';

export default function TopicsLoading() {
  return (
    <div className="min-h-screen bg-pearl">
      {/* ─── Header Skeleton ─── */}
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

      {/* ─── Page Title Skeleton ─── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 animate-fade-in">
        <div className="mb-2">
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-9 w-64 mb-3" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* ─── Topic Selector Area Skeleton ─── */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="max-w-md">
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>

        {/* Subject Cards Skeleton (Physics, Chemistry, Mathematics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card-elevated p-6 border border-border bg-white rounded-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton variant="circular" className="w-11 h-11" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2 pt-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          ))}
        </div>

        {/* Chapters / Topics Preview Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="card p-5 border border-border bg-white rounded-lg flex items-center justify-between"
              >
                <div className="space-y-2 flex-1 pr-4">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
