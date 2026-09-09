import { Header } from '@/components/Header';

export default function ProgressLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* Top Context Ribbon Skeleton */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-pulse">
          <div className="h-7 w-32 bg-paper-200 border-[2px] border-brutalBlack"></div>
          <div className="h-4 w-40 bg-paper-200"></div>
        </section>

        {/* Title Skeleton */}
        <div className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-pulse h-40">
          <div className="absolute top-0 right-0 h-8 w-40 bg-paper-200 border-l-[3px] border-b-[3px] border-brutalBlack"></div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between h-32">
              <div className="h-5 w-24 bg-paper-200 mx-auto"></div>
              <div className="h-10 w-20 bg-paper-200 mx-auto mt-4"></div>
            </div>
          ))}
        </div>

        {/* Subject Breakdown Skeleton */}
        <div className="space-y-8 pt-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal">
              <div className="p-5 border-b-[3px] border-brutalBlack bg-paper-200 h-24"></div>
              <div className="p-6 space-y-6 h-64"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
