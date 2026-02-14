import { Card } from './components/ui/Card';

export default function RootLoading() {
  return (
    <div className="max-w-[1320px] mx-auto px-4 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
        {/* Left Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="flex flex-col h-full py-4 space-y-6">
            <nav className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                  <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="min-w-0 max-w-3xl mx-auto w-full space-y-6">
          {/* Page Title Skeleton */}
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          
          {/* Sort Tabs Skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Post Cards Skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-20 bg-muted rounded" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-3 w-1/4 bg-muted rounded" />
                    <div className="h-32 bg-muted rounded" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded" />
                      <div className="h-6 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
          </div>
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="hidden lg:block">
          <div className="space-y-6 py-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="h-4 w-28 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-12 bg-muted rounded animate-pulse" />
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
