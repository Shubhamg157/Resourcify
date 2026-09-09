import { Header } from '@/components/Header';

export default function TopicsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow">
        <div className="mb-8 border-l-[6px] border-brutalBlack pl-4 py-1 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-32 bg-paper-200 border border-brutalBlack"></div>
            <div className="h-5 w-24 bg-paper-200"></div>
          </div>
          <div className="h-10 w-64 bg-paper-200 mt-2"></div>
          <div className="h-5 w-96 bg-paper-200 mt-3"></div>
        </div>

        <div className="pb-12 space-y-8 animate-pulse">
          {/* Search Bar Skeleton */}
          <div className="bg-white border-[3px] border-brutalBlack p-2 shadow-brutal h-14"></div>

          {/* Domain Cards Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-[2.5px] border-brutalBlack pb-2">
              <div className="h-6 w-8 bg-paper-200"></div>
              <div className="h-6 w-64 bg-paper-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border-[3px] border-brutalBlack shadow-brutal flex flex-col justify-between h-56">
                  <div className="p-4 border-b-[2.5px] border-brutalBlack bg-paper-200 h-14"></div>
                  <div className="p-6">
                    <div className="h-8 w-32 bg-paper-200"></div>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                    <div className="border-t-[2px] border-neutral-200 pt-3 h-10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
