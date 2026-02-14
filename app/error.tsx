'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card } from './components/ui/Card';
import { APP_NAME } from './lib/utils/constants';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="text-center space-y-6 py-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
          </div>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-left">
              <div className="rounded-lg bg-muted p-4 overflow-auto max-h-48">
                <p className="text-sm font-mono text-destructive">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Feed
            </Link>
          </div>

          {/* Footer */}
          <p className="text-sm text-muted-foreground">
            {APP_NAME} - Share Code. Get Seen.
          </p>
        </div>
      </Card>
    </div>
  );
}
