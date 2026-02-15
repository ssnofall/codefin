'use server'

import { cache } from 'react'
import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { validateId } from '../utils/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimit'

// Cached data fetching
export const getUserVote = cache(async (postId: string): Promise<'up' | 'down' | null> => {
  try {
    validateId(postId, 'post ID')
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error in getUserVote:', authError.message)
      return null
    }
    
    if (!user) return null
    
    const { data, error } = await supabase
      .from('votes')
      .select('type')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error in getUserVote:', error.message)
    }
    
    // Type-safe vote type extraction
    return (data as { type: 'up' | 'down' } | null)?.type || null
  } catch (error) {
    console.error('Unexpected error in getUserVote:', error)
    return null
  }
})

export async function vote(postId: string, type: 'up' | 'down' | null): Promise<void> {
  try {
    validateId(postId, 'post ID')
    
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Failed to create Supabase client:', clientError)
      throw new Error('Authentication service unavailable')
    }

    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error in vote:', authError.message, authError)
        throw new Error(`Authentication failed: ${authError.message}`)
      }
      
      user = authUser
    } catch (authError) {
      console.error('Exception getting user:', authError)
      throw new Error('Failed to verify authentication')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Check rate limit - per post to prevent vote spamming
    const rateLimitKey = getRateLimitKey(user.id, 'vote', postId)
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.vote)

    if (rateLimitResult.limited) {
      throw new Error(`Please wait a moment before voting again.`)
    }

    try {
      if (type === null) {
        // Remove vote - use composite key for atomic deletion
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
        
        if (deleteError) {
          console.error('Error deleting vote:', deleteError)
          throw deleteError
        }
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
              ignoreDuplicates: false,
            }
          )

        if (upsertError) {
          console.error('Error upserting vote:', upsertError)
          throw upsertError
        }
      }

      // Revalidate specific paths more efficiently
      revalidatePath(`/post/${postId}`)
      revalidatePath('/feed')
      revalidatePath('/new')
      revalidatePath('/top')
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      throw new Error('Failed to save vote. Please try again.')
    }
  } catch (error) {
    // Log all errors for debugging
    console.error('Vote action failed:', error)
    
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to process vote. Please try again.')
  }
}
