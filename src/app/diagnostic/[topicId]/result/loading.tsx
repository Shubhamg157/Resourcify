import { Header } from '@/components/Header';

export default function ResultLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
        {/* Top Context & Metadata Ribbon Skeleton */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-[2.5px] border-brutalBlack pb-4 animate-pulse">
          <div className="flex gap-2">
            <div className="h-7 w-32 bg-paper-200 border-[2px] border-brutalBlack"></div>
            <div className="h-7 w-40 bg-paper-200 border-[2px] border-brutalBlack"></div>
          </div>
          <div className="h-4 w-48 bg-paper-200"></div>
        </section>

        {/* Main Title Card Skeleton */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative overflow-hidden animate-pulse h-48">
          <div className="absolute top-0 right-0 h-8 w-48 bg-paper-200 border-l-[3px] border-b-[3px] border-brutalBlack"></div>
        </section>

        {/* Asymmetric Dual Pane Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
          
          {/* Left Panel Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border-[3px] border-brutalBlack shadow-brutal h-96"></div>
          </div>

          {/* Right Panel Skeleton */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal h-64"></div>
            <div className="bg-white border-[3px] border-brutalBlack p-5 shadow-brutal h-40"></div>
          </aside>
        </div>

        {/* Bottom Action Dock Skeleton */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 shadow-brutal h-28 mt-8 animate-pulse"></section>
      </main>
    </div>
  );
}
