'use client';

import Link from 'next/link';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { Card } from './components/ui/Card';
import { APP_NAME } from './lib/utils/constants';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="text-center space-y-6 py-8">
          {/* 404 Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>

          {/* 404 Title */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Suggestions */}
          <div className="text-left max-w-sm mx-auto space-y-2">
            <p className="text-sm font-medium text-foreground">You might want to:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Check the URL for typos</li>
              <li>Go back to the previous page</li>
              <li>Browse the feed for code snippets</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Feed
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
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
