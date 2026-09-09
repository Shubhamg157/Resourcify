export default function DiagnosticLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Quiz Header Skeleton */}
      <header className="w-full bg-white border-b-[3px] border-brutalBlack sticky top-0 z-50 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-paper-200 border-[2.5px] border-brutalBlack"></div>
            <div className="h-8 w-32 bg-paper-200"></div>
          </div>
          <div className="h-8 w-48 bg-paper-200 hidden md:block border-[2px] border-brutalBlack"></div>
        </div>
      </header>

      <main className="w-full flex-grow py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Control & Progress Strip Skeleton */}
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-24"></div>

          {/* Main Question Workspace Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column */}
            <div className="lg:col-span-7 bg-white border-[3px] border-brutalBlack shadow-brutal p-6 sm:p-8 h-96"></div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-paper-200 border-[2.5px] border-brutalBlack h-14"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border-[2.5px] border-brutalBlack h-20"></div>
              ))}
            </div>
          </div>

          {/* Bottom Control Bar Skeleton */}
          <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 h-20 mt-6"></div>
        </div>
      </main>
    </div>
  );
}
