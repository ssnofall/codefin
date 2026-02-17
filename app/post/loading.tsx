export default function PostLoading() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton */}
      <div className="h-5 w-28 bg-white/10 rounded animate-pulse" />

      {/* Post Card Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="flex gap-4">
          {/* Vote Buttons Skeleton */}
          <div className="w-12 h-24 bg-white/10 rounded" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-4 w-20 bg-white/10 rounded" />
            </div>

            {/* Title Skeleton */}
            <div className="h-8 w-3/4 bg-white/10 rounded" />

            {/* Code Skeleton */}
            <div className="h-48 w-full bg-white/10 rounded-xl" />

            {/* Footer Skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-6 w-20 bg-white/10 rounded" />
              <div className="h-6 w-16 bg-white/10 rounded" />
              <div className="h-6 w-24 bg-white/10 rounded ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />

        {/* Comment Form Skeleton */}
        <div className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
          <div className="h-32 bg-white/10 rounded-xl" />
        </div>

        {/* Comments List Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
