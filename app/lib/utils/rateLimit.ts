/**
 * Simple in-memory rate limiter for server actions
 * For production with multiple instances, use Redis (e.g., Upstash)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
};

/**
 * Check if request is rate limited
 * Returns { limited: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): { limited: boolean; remaining: number; resetTime: number } {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / opts.windowMs)}`;

  const entry = rateLimitStore.get(key);

  if (!entry) {
    // First request in this window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + opts.windowMs,
    });

    // Cleanup old entries periodically
    cleanupOldEntries(now, opts.windowMs);

    return {
      limited: false,
      remaining: opts.maxRequests - 1,
      resetTime: now + opts.windowMs,
    };
  }

  if (entry.count >= opts.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  return {
    limited: false,
    remaining: opts.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Cleanup old rate limit entries to prevent memory leaks
 */
function cleanupOldEntries(now: number, windowMs: number): void {
  const cutoff = now - windowMs * 2; // Keep entries for 2 windows

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < cutoff) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get rate limit key for a user action
 */
export function getRateLimitKey(
  userId: string | null,
  action: string,
  resourceId?: string
): string {
  if (userId) {
    return resourceId 
      ? `user:${userId}:${action}:${resourceId}`
      : `user:${userId}:${action}`;
  }
  // For anonymous users, we'll need to use IP (passed from middleware)
  return `anon:${action}:${resourceId || 'global'}`;
}

/**
 * Rate limit configurations for different actions
 */
export const RATE_LIMITS = {
  // Posts: 5 per hour
  createPost: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  
  // Comments: 10 per hour  
  createComment: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  
  // Votes: 1 per 5 seconds per post
  vote: { windowMs: 5 * 1000, maxRequests: 1 },
  
  // Account deletion: 1 per hour
  deleteAccount: { windowMs: 60 * 60 * 1000, maxRequests: 1 },
  
  // General API calls: 60 per minute
  general: { windowMs: 60 * 1000, maxRequests: 60 },
} as const;
