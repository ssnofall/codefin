export default function ProfileLoading() {
  return (
    <div className="space-y-6 mt-6">
      {/* Profile Header Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="flex items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="w-24 h-24 bg-white/10 rounded-2xl" />

          {/* Info Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded" />
            
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white/10 rounded" />
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Languages Card Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-white/10 rounded" />
                  <div className="h-4 w-8 bg-white/10 rounded" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl border border-[var(--glass-border)] p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-20 bg-white/10 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-3 w-1/4 bg-white/10 rounded" />
                <div className="h-24 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
