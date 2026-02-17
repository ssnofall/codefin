export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Account Information Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
          <div className="space-y-6">
            {/* Avatar and Username */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-full" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-white/10 rounded" />
                <div className="h-4 w-48 bg-white/10 rounded" />
              </div>
            </div>

            <div className="h-px bg-[var(--glass-border)]" />

            {/* Account Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-white/10 rounded" />
                  <div className="h-4 w-32 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appearance Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-56 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-16 bg-white/10 rounded" />
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
            <div className="h-8 w-14 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
