import { Card } from '../../components/ui/Card';

export default function LoginLoading() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center space-y-6">
          {/* Logo skeleton - matching 200x50 (lg size) proportions */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[200px] h-[50px] bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Button skeleton */}
          <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse" />

          {/* Terms text skeleton */}
          <div className="flex justify-center gap-1">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
