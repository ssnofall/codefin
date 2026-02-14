'use server'

import { cache } from 'react'
import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { validateId } from '../utils/validation'

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
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.type || null
})

export async function vote(postId: string, type: 'up' | 'down' | null): Promise<void> {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id, type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const voteData = existingVote as any
  
  if (type === null) {
    // Remove vote
    if (existingVote) {
      await supabase
        .from('votes')
        .delete()
        .eq('id', voteData.id)
    }
  } else if (existingVote) {
    // Update vote
    if (voteData.type === type) {
      // Toggle off if same vote
      await supabase
        .from('votes')
        .delete()
        .eq('id', voteData.id)
    } else {
      await (supabase
        .from('votes') as any)
        .update({ type })
        .eq('id', voteData.id)
    }
  } else {
    // Create new vote
    await (supabase
      .from('votes') as any)
      .insert({
        post_id: postId,
        user_id: user.id,
        type,
      })
  }
  
  // Revalidate specific paths more efficiently
  revalidatePath(`/post/${postId}`)
  revalidatePath('/feed')
  revalidatePath('/new')
  revalidatePath('/top')
}
