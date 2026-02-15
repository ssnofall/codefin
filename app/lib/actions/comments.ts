'use server'

import { cache } from 'react'
import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { Tables, TablesInsert } from '../supabase/types'
import { validateId, sanitizeComment } from '../utils/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimit'
import { COMMENTS_PER_PAGE } from '../utils/constants'

interface CommentWithProfile extends Tables<'comments'> {
  profiles: {
    username: string
    avatar_url: string
  } | null
}

// Cached data fetching with pagination
export const getComments = cache(async (
  postId: string, 
  page: number = 1
): Promise<{ comments: CommentWithProfile[]; hasMore: boolean; totalCount: number }> => {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const from = (page - 1) * COMMENTS_PER_PAGE
  const to = from + COMMENTS_PER_PAGE - 1
  
  const { data, error, count } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `, { count: 'exact' })
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .range(from, to)
  
  if (error) throw error
  
  return {
    comments: (data || []) as CommentWithProfile[],
    hasMore: count ? count > page * COMMENTS_PER_PAGE : false,
    totalCount: count || 0,
  }
})

export async function createComment(postId: string, body: string): Promise<void> {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check rate limit
  const rateLimitKey = getRateLimitKey(user.id, 'createComment')
  const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.createComment)
  
  if (rateLimitResult.limited) {
    throw new Error(`Rate limit exceeded. Please try again later.`)
  }
  
  if (!body || !body.trim()) {
    throw new Error('Comment cannot be empty')
  }
  
  // Sanitize comment body
  const sanitizedBody = sanitizeComment(body)
  
  if (!sanitizedBody) {
    throw new Error('Comment cannot be empty after sanitization')
  }
  
  const commentData: TablesInsert<'comments'> = {
    post_id: postId,
    user_id: user.id,
    body: sanitizedBody,
  }

  const { error } = await (supabase
    .from('comments') as any)
    .insert(commentData)
  
  if (error) throw error
  
  revalidatePath(`/post/${postId}`)
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  validateId(commentId, 'comment ID')
  validateId(postId, 'post ID')
  
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check rate limit
  const rateLimitKey = getRateLimitKey(user.id, 'deleteComment')
  const rateLimitResult = checkRateLimit(rateLimitKey, { windowMs: 60 * 1000, maxRequests: 10 })
  
  if (rateLimitResult.limited) {
    throw new Error(`Rate limit exceeded. Please try again later.`)
  }
  
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath(`/post/${postId}`)
}
