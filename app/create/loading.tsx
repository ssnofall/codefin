export default function CreateLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-7 sm:h-8 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Form Skeleton */}
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-4 sm:p-5 animate-pulse">
        <div className="space-y-4 sm:space-y-6">
          {/* Title Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-4 w-16 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Language & File Name - Side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/10 rounded-xl" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-12 w-full bg-white/10 rounded-xl" />
            </div>
          </div>

          {/* Code Textarea */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-64 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Tags Input */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[var(--glass-border)]">
            <div className="h-10 sm:h-11 w-full sm:w-24 bg-white/10 rounded-lg" />
            <div className="h-10 sm:h-11 w-full sm:w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
