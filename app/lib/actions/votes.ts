'use server'

import { cache } from 'react'
import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { validateId } from '../utils/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimit'

// Cached data fetching
export const getUserVote = cache(async (postId: string): Promise<'up' | 'down' | null> => {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('votes')
    .select('type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()
  
  if (error) return null
  // Type-safe vote type extraction
  return (data as { type: 'up' | 'down' })?.type || null
})

export async function vote(postId: string, type: 'up' | 'down' | null): Promise<void> {
  validateId(postId, 'post ID')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check rate limit - per post to prevent vote spamming
  const rateLimitKey = getRateLimitKey(user.id, 'vote', postId)
  const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.vote)

  if (rateLimitResult.limited) {
    throw new Error(`Please wait a moment before voting again.`)
  }

  try {
    if (type === null) {
      // Remove vote - use composite key for atomic deletion
      await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
    } else {
      // Use upsert with onConflict to handle race conditions atomically
      // The unique constraint on (user_id, post_id) ensures atomicity
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: upsertError } = await (supabase
        .from('votes') as any)
        .upsert(
          {
            post_id: postId,
            user_id: user.id,
            type,
          },
          {
            onConflict: 'user_id,post_id',
            ignoreDuplicates: false, // Update if conflict exists
          }
        )

      if (upsertError) {
        throw upsertError
      }
    }

    // Revalidate specific paths more efficiently
    revalidatePath(`/post/${postId}`)
    revalidatePath('/feed')
    revalidatePath('/new')
    revalidatePath('/top')
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Vote operation failed:', error instanceof Error ? error.message : 'Unknown error')
    }
    throw new Error('Failed to process vote. Please try again.')
  }
}
