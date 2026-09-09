import { Header } from '@/components/Header';

export default function RecoveryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />

      {/* Persistent Action Bar Skeleton */}
      <div className="bg-schoolYellow border-b-[3px] border-brutalBlack sticky top-0 z-40 shadow-brutal-sm h-12"></div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-pulse">
        
        {/* Title & Header Skeleton */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative h-48">
          <div className="absolute top-0 right-0 h-8 w-48 bg-paper-200 border-l-[3px] border-b-[3px] border-brutalBlack"></div>
        </section>

        {/* Progress Steps Ribbon Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 h-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-8 w-32 bg-white border-[2px] border-brutalBlack shadow-brutal-sm"></div>
              {i < 4 && <div className="h-6 w-6 bg-paper-200"></div>}
            </div>
          ))}
        </div>

        {/* Sections Skeleton */}
        {[...Array(4)].map((_, i) => (
          <section key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal h-64">
            <div className="bg-paper-200 border-b-[3px] border-brutalBlack px-5 py-3 h-14"></div>
            <div className="p-6 sm:p-8"></div>
          </section>
        ))}

      </main>
    </div>
  );
}
