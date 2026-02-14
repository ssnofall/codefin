import { Card } from '../components/ui/Card';

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Profile Header Skeleton */}
      <Card className="animate-pulse">
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar Skeleton */}
            <div className="w-24 h-24 bg-muted rounded-2xl" />

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-8 w-48 bg-muted rounded" />
              
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Languages Card Skeleton */}
      <Card className="animate-pulse">
        <div className="p-6 space-y-4">
          <div className="h-6 w-40 bg-muted rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-muted rounded" />
                  <div className="h-4 w-8 bg-muted rounded" />
                </div>
                <div className="h-2 w-full bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Posts Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-4">
              <div className="flex gap-4">
                <div className="w-12 h-20 bg-muted rounded" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted rounded" />
                  <div className="h-24 bg-muted rounded" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
