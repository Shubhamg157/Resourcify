import { Header } from '@/components/Header';

export default function RecheckLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Header />

      <div className="bg-schoolYellow border-b-[3px] border-brutalBlack sticky top-0 z-40 shadow-brutal-sm h-12"></div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow animate-pulse">
        {/* Title Skeleton */}
        <section className="bg-white border-[3px] border-brutalBlack p-6 sm:p-8 shadow-brutal relative h-40">
          <div className="absolute top-0 right-0 h-8 w-40 bg-paper-200 border-l-[3px] border-b-[3px] border-brutalBlack"></div>
        </section>

        {/* Quiz UI Skeleton */}
        <div className="bg-white border-[3px] border-brutalBlack shadow-brutal p-4 sm:p-5 h-24 mb-6"></div>

        <div className="bg-white border-[3px] border-brutalBlack shadow-brutal h-96 mb-8"></div>

        <div className="flex justify-end">
          <div className="h-14 w-40 bg-white border-[3px] border-brutalBlack shadow-brutal"></div>
        </div>
      </main>
    </div>
  );
}
