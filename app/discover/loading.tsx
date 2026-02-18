export default function DiscoverLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Platform Stats Card */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-8 w-16 bg-white/10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-8 w-16 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Trending Topics Card */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="h-4 w-36 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="h-4 w-6 bg-white/10 rounded" />
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
              <div className="h-4 w-16 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Language Distribution Card */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="h-4 w-40 bg-white/10 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-3 w-8 bg-white/10 rounded" />
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="h-4 w-28 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
