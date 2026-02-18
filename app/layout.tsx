import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";
import { createClient } from "./lib/supabase/server";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isValidNonce } from "./lib/utils/security";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Codefin - Share Code. Get Seen.",
  description: "Share code snippets and get discovered by the community",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Async wrapper components for Suspense boundaries
async function HeaderWithUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <Header user={user} />;
}

async function LeftSidebarWithUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <LeftSidebar user={user} />;
}

async function BottomNavWithUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <BottomNav user={user} />;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get nonce from middleware-generated headers for CSP compliance
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  // Validate nonce for security
  const validNonce = nonce && isValidNonce(nonce) ? nonce : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          nonce={validNonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for stored theme preference
                const stored = localStorage.getItem('codefin-theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // No stored preference, use system preference
                  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          {/* Liquid flow background */}
          <div className="liquid-bg">
            <div className="liquid-blob liquid-blob-1" />
            <div className="liquid-blob liquid-blob-2" />
            <div className="liquid-blob liquid-blob-3" />
          </div>
          {/* Atmospheric radial gradient glow */}
          <div className="fixed inset-0 bg-atmospheric pointer-events-none" />
          {/* Subtle grid pattern overlay */}
          <div className="fixed inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          <Suspense fallback={<HeaderSkeleton />}>
            <HeaderWithUser />
          </Suspense>
          <div className="pt-20">
            <div className="max-w-[1320px] mx-auto px-3 sm:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-4 lg:gap-6">
                {/* Left Sidebar - Desktop Only */}
                <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
                  <Suspense fallback={<LeftSidebarSkeleton />}>
                    <LeftSidebarWithUser />
                  </Suspense>
                </aside>

                {/* Center Column */}
                <main className="min-w-0 max-w-3xl mx-auto w-full pb-24 lg:pb-6">
                  {children}
                </main>

                {/* Right Sidebar - Desktop Only */}
                <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
                  <Suspense fallback={<RightSidebarSkeleton />}>
                    <RightSidebar />
                  </Suspense>
                </aside>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <Suspense fallback={null}>
            <BottomNavWithUser />
          </Suspense>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-white/5 dark:border-white/5">
      <div className="px-3 sm:px-4 h-16 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
      </div>
    </header>
  );
}

function LeftSidebarSkeleton() {
  return (
    <div className="flex flex-col h-full py-6 space-y-6">
      <nav className="space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl">
            <div className="w-5 h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </nav>
    </div>
  );
}

function RightSidebarSkeleton() {
  return (
    <div className="space-y-6 py-6">
      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
        <div className="h-4 w-28 bg-white/10 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-4 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl border border-[var(--glass-border)] p-6">
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


