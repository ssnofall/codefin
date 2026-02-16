import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

export async function createClient() {
  try {
    const cookieStore = await cookies()

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              const cookie = cookieStore.get(name)
              return cookie?.value
            } catch (error) {
              console.error(`Error getting cookie ${name}:`, error)
              return undefined
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
              console.error(`Error setting cookie ${name}:`, error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
              console.error(`Error removing cookie ${name}:`, error)
            }
          },
        },
      }
    )
  } catch (error) {
    // During static generation, cookies() will throw an error
    // Return a client that will return null for auth operations
    console.warn('Creating fallback Supabase client (static generation or cookie unavailable)')
    
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() {
            return undefined
          },
          set() {
            // No-op during static generation
          },
          remove() {
            // No-op during static generation
          },
        },
      }
    )
  }
}

// Client for static generation (doesn't use cookies)
export function createStaticClient() {
  // Use service role key during build time to bypass RLS policies
  // Falls back to anon key if service role key is not available
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  // If using service role key, disable auth features since service role
  // doesn't have refresh tokens and shouldn't auto-refresh
  const authConfig = hasServiceKey ? {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  } : undefined
  
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    authConfig ? { auth: authConfig } : undefined
  )
}
