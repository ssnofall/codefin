export default function CreateLoading() {
  return (
    <div className="space-y-6">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Form Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6 animate-pulse">
        <div className="space-y-6">
          {/* Title Input Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Language Select Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Code Textarea Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-64 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Tags Input Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Submit Button Skeleton */}
          <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
            <div className="h-10 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
