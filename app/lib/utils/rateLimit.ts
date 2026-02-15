import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

interface RateLimitRow {
  id: string
  identifier: string
  action: string
  count: number
  window_start: string
  created_at: string
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000,
  maxRequests: 10,
}

async function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {
        // No-op - service role client doesn't need cookies
      },
      remove() {
        // No-op - service role client doesn't need cookies
      },
    },
  })
}

function getWindowStart(windowMs: number): Date {
  const now = new Date()
  const windowSize = Math.floor(now.getTime() / windowMs)
  return new Date(windowSize * windowMs)
}

function extractActionFromKey(key: string): string {
  const parts = key.split(':')
  if (parts.length >= 3) {
    return parts.slice(2, -1).join(':') || parts[2]
  }
  return key
}

export async function checkRateLimit(
  key: string,
  optionsOrAction: string | Partial<RateLimitOptions>,
  options?: Partial<RateLimitOptions>
): Promise<{ limited: boolean; remaining: number; resetTime: number }> {
  let opts: RateLimitOptions
  let action: string

  if (typeof optionsOrAction === 'string') {
    action = optionsOrAction
    opts = { ...DEFAULT_OPTIONS, ...options }
  } else {
    action = extractActionFromKey(key)
    opts = { ...DEFAULT_OPTIONS, ...optionsOrAction }
  }

  const identifier = key
  const now = Date.now()
  const windowStart = getWindowStart(opts.windowMs)
  const windowEnd = new Date(windowStart.getTime() + opts.windowMs)

  try {
    const supabase = await getAdminClient()

    if (!supabase) {
      // Graceful fallback - allow request through if admin client unavailable
      return { limited: false, remaining: opts.maxRequests, resetTime: windowEnd.getTime() }
    }

    const { data: existing, error: fetchError } = await (supabase
      .from('rate_limits') as any)
      .select('count')
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('window_start', windowStart.toISOString())
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Rate limit fetch error:', fetchError)
      return { limited: false, remaining: opts.maxRequests, resetTime: windowEnd.getTime() }
    }

    if (existing) {
      if (existing.count >= opts.maxRequests) {
        return { limited: true, remaining: 0, resetTime: windowEnd.getTime() }
      }

      const { error: updateError } = await (supabase
        .from('rate_limits') as any)
        .update({ count: existing.count + 1 })
        .eq('identifier', identifier)
        .eq('action', action)
        .gte('window_start', windowStart.toISOString())

      if (updateError) {
        console.error('Rate limit update error:', updateError)
        return { limited: false, remaining: opts.maxRequests, resetTime: windowEnd.getTime() }
      }

      return {
        limited: false,
        remaining: opts.maxRequests - (existing.count + 1),
        resetTime: windowEnd.getTime(),
      }
    } else {
      const { error: insertError } = await (supabase
        .from('rate_limits') as any)
        .insert({
          identifier,
          action,
          count: 1,
          window_start: windowStart.toISOString(),
        })

      if (insertError) {
        console.error('Rate limit insert error:', insertError)
        return { limited: false, remaining: opts.maxRequests, resetTime: windowEnd.getTime() }
      }

      return {
        limited: false,
        remaining: opts.maxRequests - 1,
        resetTime: windowEnd.getTime(),
      }
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Graceful fallback - allow request through on any error
    return { limited: false, remaining: opts.maxRequests, resetTime: windowEnd.getTime() }
  }
}

export function getRateLimitKey(
  userId: string | null,
  action: string,
  resourceId?: string
): string {
  if (userId) {
    return resourceId
      ? `user:${userId}:${action}:${resourceId}`
      : `user:${userId}:${action}`
  }
  return `anon:${action}:${resourceId || 'global'}`
}

export const RATE_LIMITS = {
  createPost: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  createComment: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  vote: { windowMs: 10 * 1000, maxRequests: 1 },
  deleteAccount: { windowMs: 60 * 60 * 1000, maxRequests: 1 },
  general: { windowMs: 60 * 1000, maxRequests: 60 },
} as const
