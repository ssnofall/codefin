import { Card } from '../components/ui/Card';

export default function PostLoading() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton */}
      <div className="h-5 w-28 bg-muted rounded animate-pulse" />

      {/* Post Card Skeleton */}
      <Card className="animate-pulse">
        <div className="p-6">
          <div className="flex gap-4">
            {/* Vote Buttons Skeleton */}
            <div className="w-12 h-24 bg-muted rounded" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-4">
              {/* Header Skeleton */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>

              {/* Title Skeleton */}
              <div className="h-8 w-3/4 bg-muted rounded" />

              {/* Code Skeleton */}
              <div className="h-48 w-full bg-muted rounded-xl" />

              {/* Footer Skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-6 w-20 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />

        {/* Comment Form Skeleton */}
        <Card className="animate-pulse">
          <div className="p-4 h-32 bg-muted rounded-xl" />
        </Card>

        {/* Comments List Skeleton */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-4 flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
