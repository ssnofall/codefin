import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'standalone' for standard Vercel deployment
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://*.githubusercontent.com data:; connect-src 'self' https://*.supabase.co; font-src 'self';"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
