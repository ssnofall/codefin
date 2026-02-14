import { Card } from '../components/ui/Card';

export default function CreateLoading() {
  return (
    <div className="space-y-6">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>

      {/* Form Skeleton */}
      <Card className="animate-pulse">
        <div className="p-6 space-y-6">
          {/* Title Input Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded-xl" />
          </div>

          {/* Language Select Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded-xl" />
          </div>

          {/* Code Textarea Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-64 w-full bg-muted rounded-xl" />
          </div>

          {/* Tags Input Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded-xl" />
          </div>

          {/* Submit Button Skeleton */}
          <div className="flex justify-end pt-4 border-t border-border">
            <div className="h-10 w-32 bg-muted rounded-lg" />
          </div>
        </div>
      </Card>
    </div>
  );
}
