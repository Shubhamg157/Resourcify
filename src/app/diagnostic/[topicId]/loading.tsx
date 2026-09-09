import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function DiagnosticLoading() {
  return (
    <div className="min-h-screen bg-pearl flex flex-col">
      {/* ─── Top Bar Skeleton ─── */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <div className="text-center hidden sm:flex flex-col items-center gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </header>

      {/* ─── Progress Bar Skeleton ─── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* ─── Quiz Body Skeleton ─── */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full flex flex-col justify-center animate-fade-in">
        <div className="card-elevated p-8 border border-border bg-white rounded-xl mb-6 shadow-sm">
          {/* Concept Badge & Type Tag */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          {/* Question Prompt */}
          <div className="mb-8 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-2/3" />
          </div>

          {/* 4 Option Skeletons */}
          <div className="space-y-3 mb-8">
            {[0, 1, 2, 3].map((opt) => (
              <div
                key={opt}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-sand-50/40"
              >
                <Skeleton variant="circular" className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Button Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
