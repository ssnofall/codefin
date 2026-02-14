import { Card } from '../components/ui/Card';

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Account Information Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>

        <Card className="animate-pulse">
          <div className="p-6 space-y-6">
            {/* Avatar and Username */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Account Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Appearance Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-56 bg-muted rounded animate-pulse" />
        </div>

        <Card className="animate-pulse">
          <div className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>
            <div className="h-8 w-14 bg-muted rounded-full" />
          </div>
        </Card>
      </section>
    </div>
  );
}
