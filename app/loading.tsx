export default function RootLoading() {
  return (
    <div className="max-w-[1320px] mx-auto px-4 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
        {/* Left Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="flex flex-col h-full py-6 space-y-6">
            <nav className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl">
                  <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="min-w-0 max-w-3xl mx-auto w-full space-y-6">
          {/* Page Title Skeleton */}
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
          
          {/* Sort Tabs Skeleton */}
          <div className="glass rounded-2xl border border-[var(--glass-border)] p-1.5 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Post Cards Skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-20 bg-white/10 rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 bg-white/10 rounded" />
                  <div className="h-3 w-1/4 bg-white/10 rounded" />
                  <div className="h-32 bg-white/10 rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-white/10 rounded" />
                    <div className="h-6 w-16 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="space-y-6 py-6">
            <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
              <div className="h-4 w-28 bg-white/10 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-4 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
