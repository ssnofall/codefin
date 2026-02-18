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

      {/* Appearance Skeleton - NOW WITH TWO ITEMS */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-56 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-16 bg-white/10 rounded" />
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
            <div className="h-8 w-14 bg-white/10 rounded-full" />
          </div>
          
          {/* Divider */}
          <div className="h-px bg-[var(--glass-border)]" />
          
          {/* Accent Color */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-24 bg-white/10 rounded" />
              <div className="h-4 w-40 bg-white/10 rounded" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 bg-white/10 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session Section - NEW */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-white/10 rounded" />
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
            <div className="h-10 w-28 bg-white/10 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Danger Zone Section - NEW */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-28 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="glass rounded-2xl border border-destructive/20 bg-destructive/5 p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-destructive/10 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-32 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-10 w-36 bg-white/10 rounded-lg mt-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
