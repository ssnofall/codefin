'use server'

import { cache } from 'react'
import { createClient, createStaticClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { Tables, TablesInsert } from '../supabase/types'
import { validateId, validateTag, validateLanguage } from '../utils/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimit'
import {
  MAX_TITLE_LENGTH,
  MAX_CODE_LENGTH,
  MAX_FILE_NAME_LENGTH,
  MAX_TAGS,
} from '../utils/constants'

const POSTS_PER_PAGE = 20

// Type definitions
interface PostWithProfile extends Tables<'posts'> {
  profiles: {
    username: string
    avatar_url: string
  } | null
}

interface TrendingTag {
  tag: string
  count: number
}

// Input validation helper
function validatePostInputs(
  title: string,
  code: string,
  language: string,
  fileName: string | null,
  tagsString: string | null
): { title: string; code: string; language: string; fileName: string | null; tags: string[] } {
  // Validate title
  if (!title || title.trim().length === 0) {
    throw new Error('Title is required')
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Title must be less than ${MAX_TITLE_LENGTH} characters`)
  }

  // Validate code
  if (!code || code.trim().length === 0) {
    throw new Error('Code is required')
  }
  if (code.length > MAX_CODE_LENGTH) {
    throw new Error(`Code must be less than ${MAX_CODE_LENGTH} characters`)
  }

  // Validate and sanitize language
  const sanitizedLanguage = validateLanguage(language)

  // Validate file name
  if (fileName && fileName.length > MAX_FILE_NAME_LENGTH) {
    throw new Error(`File name must be less than ${MAX_FILE_NAME_LENGTH} characters`)
  }

  // Validate and sanitize tags
  const tags = tagsString
    ? tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, MAX_TAGS)
        .filter(validateTag)
    : []

  return {
    title: title.trim(),
    code: code.trim(),
    language: sanitizedLanguage,
    fileName: fileName?.trim() || null,
    tags,
  }
}

// Cached data fetching functions to prevent duplicate requests
export const getPosts = cache(async (
  sort: 'hot' | 'new' | 'top' = 'hot', 
  tag?: string,
  page: number = 1
) => {
  const supabase = await createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (username, avatar_url)
    `, { count: 'exact' })
  
  if (tag) {
    query = query.contains('tags', [tag])
  }
  
  if (sort === 'new') {
    query = query.order('created_at', { ascending: false })
  } else if (sort === 'top') {
    query = query.order('upvotes', { ascending: false })
  } else {
    // Hot: combination of votes and recency
    query = query.order('upvotes', { ascending: false })
  }
  
  // Add pagination
  const from = (page - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1
  query = query.range(from, to)
  
  const { data, error, count } = await query
  
  if (error) throw error
  
  return {
    posts: data || [],
    totalCount: count || 0,
    hasMore: count ? count > page * POSTS_PER_PAGE : false,
    currentPage: page,
  }
})

export const getPostById = cache(async (id: string) => {
  validateId(id, 'post ID')
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (username, avatar_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
})

export const getPostsByUser = cache(async (username: string) => {
  const supabase = await createClient()
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()
  
  if (profileError || !profile) return []
  
  const profileData = profile as Tables<'profiles'>
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (username, avatar_url)
    `)
    .eq('author_id', profileData.id)
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) throw error
  return (data || []) as PostWithProfile[]
})

export async function createPost(formData: FormData): Promise<void> {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Failed to create Supabase client in createPost:', clientError)
      throw new Error('Authentication service unavailable')
    }

    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error in createPost:', authError.message, authError)
        throw new Error(`Authentication failed: ${authError.message}`)
      }
      
      user = authUser
    } catch (authError) {
      console.error('Exception getting user in createPost:', authError)
      throw new Error('Failed to verify authentication')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }
    
    // Check rate limit
    const rateLimitKey = getRateLimitKey(user.id, 'createPost')
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.createPost)
    
    if (rateLimitResult.limited) {
      throw new Error(`Rate limit exceeded. Please try again later.`)
    }
    
    const title = formData.get('title') as string
    const code = formData.get('code') as string
    const language = formData.get('language') as string
    const fileName = formData.get('file_name') as string
    const tagsString = formData.get('tags') as string
    
    // Validate all inputs
    const validated = validatePostInputs(title, code, language, fileName, tagsString)
    
    const insertData: TablesInsert<'posts'> = {
      author_id: user.id,
      title: validated.title,
      code: validated.code,
      language: validated.language,
      file_name: validated.fileName,
      tags: validated.tags,
    }

    try {
      const { error } = await supabase
        .from('posts')
        // Type assertion required due to Supabase client inference limitation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(insertData as any)
      
      if (error) {
        console.error('Database error in createPost:', error)
        throw new Error(`Failed to create post: ${error.message}`)
      }
    } catch (dbError) {
      console.error('Database operation failed in createPost:', dbError)
      throw new Error('Failed to create post. Please try again.')
    }
    
    revalidatePath('/feed')
    revalidatePath('/new')
  } catch (error) {
    console.error('createPost action failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to create post. Please try again.')
  }
}

// Optimized trending tags using materialized view with auto-refresh trigger
// The materialized view 'trending_tags' is created in supabase/optimization.sql
// It pre-aggregates tag counts from posts in the last 30 days for fast queries
// Auto-refresh trigger ensures data stays current when posts are created/updated/deleted
// Falls back to JavaScript aggregation if view doesn't exist
export const getTrendingTags = cache(async () => {
  // Use static client since this doesn't require authentication
  const supabase = createStaticClient()
  
  // Try to use materialized view first (much faster - O(1) vs O(n) scanning)
  try {
    const { data: viewData, error: viewError } = await supabase
      .from('trending_tags')
      .select('tag, count')
      .limit(10)
    
    if (!viewError && viewData) {
      return viewData
    }
  } catch {
    // Materialized view doesn't exist, fall back to regular query
  }
  
  // Fallback: Only fetch posts from last 30 days for trending
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data, error } = await supabase
    .from('posts')
    .select('tags')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .limit(1000) // Limit to recent 1000 posts
  
  if (error) throw error
  
  const tagCounts: Record<string, number> = {}
  // Type-safe iteration over query results
  interface PostWithTags {
    tags: string[] | null
  }
  const posts = (data || []) as PostWithTags[]
  posts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

export const getPlatformStats = cache(async () => {
  // Use static client since this doesn't require authentication
  const supabase = createStaticClient()
  
  const [{ count: postCount }, { count: userCount }] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])
  
  return {
    posts: postCount || 0,
    users: userCount || 0,
  }
})

// Batch fetch user votes for multiple posts (prevents N+1 queries)
export const getUserVotesForPosts = cache(async (postIds: string[]) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || postIds.length === 0) return {}
  
  // Validate all post IDs
  postIds.forEach((id) => validateId(id, 'post ID'))
  
  const { data } = await supabase
    .from('votes')
    .select('post_id, type')
    .in('post_id', postIds)
    .eq('user_id', user.id)
  
  // Type-safe vote aggregation
  interface VoteResult {
    post_id: string
    type: 'up' | 'down'
  }
  return ((data || []) as VoteResult[]).reduce((acc, vote) => {
    acc[vote.post_id] = vote.type
    return acc
  }, {} as Record<string, 'up' | 'down'>)
})

// Get language distribution across all posts
export const getLanguageDistribution = cache(async () => {
  // Use static client since this doesn't require authentication
  const supabase = createStaticClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('language')
  
  if (error) throw error
  
  const languageCounts: Record<string, number> = {}
  // Type-safe iteration
  interface PostWithLanguage {
    language: string
  }
  const posts = (data || []) as PostWithLanguage[]
  posts.forEach((post) => {
    if (post.language) {
      languageCounts[post.language] = (languageCounts[post.language] || 0) + 1
    }
  })
  
  const total = posts.length || 1
  
  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
})

export async function updatePost(postId: string, formData: FormData): Promise<Tables<'posts'>> {
  try {
    validateId(postId, 'post ID')
    
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Failed to create Supabase client in updatePost:', clientError)
      throw new Error('Authentication service unavailable')
    }

    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error in updatePost:', authError.message, authError)
        throw new Error(`Authentication failed: ${authError.message}`)
      }
      
      user = authUser
    } catch (authError) {
      console.error('Exception getting user in updatePost:', authError)
      throw new Error('Failed to verify authentication')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }
    
    // Check rate limit
    const rateLimitKey = getRateLimitKey(user.id, 'updatePost', postId)
    const rateLimitResult = checkRateLimit(rateLimitKey, { windowMs: 60 * 1000, maxRequests: 5 })
    
    if (rateLimitResult.limited) {
      throw new Error(`Rate limit exceeded. Please try again later.`)
    }
    
    // Check ownership
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single()
    
    if (fetchError || !post) {
      throw new Error('Post not found')
    }
    
    // Type-safe author check
    interface PostWithAuthor {
      author_id: string
    }
    const postData = post as PostWithAuthor
    if (postData.author_id !== user.id) {
      throw new Error('Not authorized')
    }
    
    const title = formData.get('title') as string
    const code = formData.get('code') as string
    const language = formData.get('language') as string
    const fileName = formData.get('file_name') as string
    const tagsString = formData.get('tags') as string
    
    // Validate all inputs
    const validated = validatePostInputs(title, code, language, fileName, tagsString)
    
    // Define update payload with proper typing workaround for Supabase
    const updatePayload = {
      title: validated.title,
      code: validated.code,
      language: validated.language,
      file_name: validated.fileName,
      tags: validated.tags,
    }

    try {
      const { data, error } = await (supabase
        .from('posts') as any)
        .update(updatePayload)
        .eq('id', postId)
        .eq('author_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Database error in updatePost:', error)
        throw new Error(`Failed to update post: ${error.message}`)
      }

      if (!data) {
        throw new Error('Post update succeeded but no data returned')
      }

      revalidatePath('/feed')
      revalidatePath('/new')
      revalidatePath('/trending')
      revalidatePath('/top')
      revalidatePath(`/post/${postId}`)

      // Return typed post data
      return data as Tables<'posts'>
    } catch (dbError) {
      console.error('Database operation failed in updatePost:', dbError)
      throw new Error('Failed to update post. Please try again.')
    }
  } catch (error) {
    console.error('updatePost action failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update post. Please try again.')
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    validateId(postId, 'post ID')
    
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Failed to create Supabase client in deletePost:', clientError)
      throw new Error('Authentication service unavailable')
    }

    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error in deletePost:', authError.message, authError)
        throw new Error(`Authentication failed: ${authError.message}`)
      }
      
      user = authUser
    } catch (authError) {
      console.error('Exception getting user in deletePost:', authError)
      throw new Error('Failed to verify authentication')
    }
    
    if (!user) {
      throw new Error('Not authenticated')
    }
    
    // Check rate limit
    const rateLimitKey = getRateLimitKey(user.id, 'deletePost')
    const rateLimitResult = checkRateLimit(rateLimitKey, { windowMs: 60 * 1000, maxRequests: 10 })
    
    if (rateLimitResult.limited) {
      throw new Error(`Rate limit exceeded. Please try again later.`)
    }
    
    // Check ownership
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single()
    
    if (fetchError || !post) {
      throw new Error('Post not found')
    }
    
    // Type-safe author check
    if ((post as { author_id: string }).author_id !== user.id) {
      throw new Error('Not authorized')
    }
    
    try {
      // Delete comments first (foreign key constraint)
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId)
      
      if (commentsError) {
        console.error('Error deleting comments:', commentsError)
        throw new Error(`Failed to delete comments: ${commentsError.message}`)
      }
      
      // Delete votes
      const { error: votesError } = await supabase
        .from('votes')
        .delete()
        .eq('post_id', postId)
      
      if (votesError) {
        console.error('Error deleting votes:', votesError)
        throw new Error(`Failed to delete votes: ${votesError.message}`)
      }
      
      // Delete post
      const { error: postError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', user.id)
      
      if (postError) {
        console.error('Error deleting post:', postError)
        throw new Error(`Failed to delete post: ${postError.message}`)
      }
    } catch (dbError) {
      console.error('Database operation failed in deletePost:', dbError)
      throw new Error('Failed to delete post. Please try again.')
    }
    
    revalidatePath('/feed')
    revalidatePath('/new')
    revalidatePath('/trending')
    revalidatePath('/top')
    revalidatePath('/profile/[username]')
  } catch (error) {
    console.error('deletePost action failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete post. Please try again.')
  }
}
