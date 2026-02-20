import Link from "next/link";
import { WifiOff, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "You're Offline - Codefin",
  description: "No internet connection. Please check your network and try again.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-3xl border border-[var(--glass-border)] p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
        <p className="text-muted-foreground mb-6">
          It looks like you've lost your internet connection. 
          Some features may not be available until you're back online.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Don't worry, your code snippets are safe and will sync when you're back online.
        </p>
      </div>
    </div>
  );
}
