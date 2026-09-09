import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-pearl flex flex-col">
      {/* ─── Header Skeleton ─── */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="w-7 h-7" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </header>

      {/* ─── Main Content Skeleton ─── */}
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1 animate-fade-in">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-10 w-80 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
          <SkeletonCard className="h-48" />
        </div>
      </main>
    </div>
  );
}
