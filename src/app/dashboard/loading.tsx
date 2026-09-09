import { Header } from '@/components/Header';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* Top Context Ribbon Skeleton */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-pulse">
          <div className="flex gap-2">
            <div className="h-7 w-32 bg-paper-200 border-[2px] border-brutalBlack"></div>
            <div className="h-7 w-24 bg-paper-200 border-[2px] border-brutalBlack"></div>
          </div>
          <div className="h-4 w-40 bg-paper-200"></div>
        </section>

        {/* Welcome Skeleton */}
        <div className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-pulse">
          <div className="absolute top-0 right-0 h-8 w-40 bg-paper-200 border-l-[3px] border-b-[3px] border-brutalBlack"></div>
          <div className="h-10 w-64 bg-paper-200 mb-4 mt-2"></div>
          <div className="h-6 w-96 bg-paper-200 max-w-full"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 text-center flex flex-col justify-between h-32">
              <div className="h-5 w-24 bg-paper-200 mx-auto"></div>
              <div className="h-10 w-20 bg-paper-200 mx-auto mt-4"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="h-8 w-48 bg-paper-200 mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between h-24"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal h-64"></div>
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal h-48"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
