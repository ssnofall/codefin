export default function PostLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button Skeleton */}
      <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />

      {/* Post Card Skeleton - NO vote column, matches actual layout */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-3 sm:p-5 animate-pulse">
        <div className="space-y-4">
          {/* Header: Avatar + Username + Date + Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 rounded-full" />
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-4 w-20 bg-white/10 rounded" />
            </div>
            <div className="w-8 h-8 bg-white/10 rounded" />
          </div>

          {/* Title */}
          <div className="h-6 sm:h-8 w-3/4 bg-white/10 rounded" />

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 flex gap-2">
              <div className="h-6 w-16 bg-white/10 rounded" />
              <div className="h-6 w-16 bg-white/10 rounded" />
            </div>
            <div className="h-6 w-20 bg-white/10 rounded" />
          </div>

          {/* Code Preview */}
          <div className="h-48 bg-white/10 rounded-xl" />

          {/* Footer: Vote buttons + Comments */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-white/10 rounded" />
            <div className="h-8 w-20 bg-white/10 rounded" />
            <div className="h-8 w-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
        
        {/* Comment Form Skeleton - Wrapped in Card */}
        <div className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
          <div className="h-24 bg-white/10 rounded-xl mb-4" />
          <div className="flex justify-end">
            <div className="h-9 w-28 bg-white/10 rounded-lg" />
          </div>
        </div>

        {/* Comments List Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-4 w-full bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
