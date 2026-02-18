'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-[1320px] mx-auto px-3 sm:px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Legal Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by snofall</span>
          </div>

          {/* Brand */}
          <div className="text-sm text-muted-foreground">
            &copy; 2026 Codefin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
