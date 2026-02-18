export default function RootLoading() {
  return (
    <div className="space-y-6">
      {/* Page Title Skeleton */}
      <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
      
      {/* Sort Tabs Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-1.5 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>

      {/* Post Cards Skeleton - NO vote column, matches actual layout */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="glass rounded-2xl border border-[var(--glass-border)] p-4 sm:p-6 animate-pulse">
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
            <div className="h-6 w-3/4 bg-white/10 rounded" />
            
            {/* Tags row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 flex gap-2">
                <div className="h-6 w-16 bg-white/10 rounded" />
                <div className="h-6 w-16 bg-white/10 rounded" />
              </div>
              <div className="h-6 w-20 bg-white/10 rounded" />
            </div>
            
            {/* Code preview */}
            <div className="h-32 sm:h-40 bg-white/10 rounded-xl" />
            
            {/* Footer: Vote buttons + Comments */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-white/10 rounded" />
              <div className="h-8 w-20 bg-white/10 rounded" />
              <div className="h-8 w-24 bg-white/10 rounded" />
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
    </div>
  );
}
