/**
 * Distributed rate limiting using Upstash Redis
 * For production with Vercel serverless functions, this ensures rate limits
 * are shared across all instances and persist across deployments.
 * 
 * Falls back to in-memory rate limiting in development if Redis is not configured.
 */

import { Redis } from '@upstash/redis';

// Redis client instance (singleton)
let redis: Redis | null = null;

// Initialize Redis client if environment variables are available
function getRedisClient(): Redis | null {
  if (redis) return redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn('Redis not configured. Using in-memory rate limiting (NOT for production).');
    return null;
  }
  
  redis = new Redis({
    url,
    token,
  });
  
  return redis;
}

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
};

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if request is rate limited using Redis
 * Returns { limited: boolean, remaining: number, resetTime: number }
 */
export async function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {}
): Promise<RateLimitResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const client = getRedisClient();
  
  // If Redis is not available, fall back to in-memory (development only)
  if (!client) {
    return checkRateLimitMemory(identifier, opts);
  }
  
  const now = Date.now();
  const windowStart = Math.floor(now / opts.windowMs) * opts.windowMs;
  const key = `ratelimit:${identifier}:${windowStart}`;
  const resetTime = windowStart + opts.windowMs;
  
  try {
    // Use Redis INCR for atomic increment
    const current = await client.incr(key);
    
    // Set expiration on first request
    if (current === 1) {
      await client.pexpire(key, opts.windowMs);
    }
    
    const remaining = Math.max(0, opts.maxRequests - current);
    
    return {
      limited: current > opts.maxRequests,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // Fail open in case of Redis error (don't block legitimate users)
    return {
      limited: false,
      remaining: opts.maxRequests,
      resetTime,
    };
  }
}

/**
 * In-memory rate limiter (fallback for development)
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimitMemory(
  identifier: string,
  opts: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / opts.windowMs)}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
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

function cleanupOldEntries(now: number, windowMs: number): void {
  const cutoff = now - windowMs * 2;
  
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
