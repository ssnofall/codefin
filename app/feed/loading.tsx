export default function FeedLoading() {
  return (
    <div className="space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />

      {/* Sort Tabs Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-1.5 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>

      {/* Post Cards Skeleton */}
      <div className="space-y-4">
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
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
        <div className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
