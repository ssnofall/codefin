'use server'

import { cache } from 'react'
import { createClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import { Tables, TablesInsert } from '../supabase/types'
import { validateId, validateTag, validateLanguage } from '../utils/validation'
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
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const title = formData.get('title') as string
  const code = formData.get('code') as string
  const language = formData.get('language') as string
  const fileName = formData.get('file_name') as string
  const tagsString = formData.get('tags') as string
  
  // Validate all inputs
  const validated = validatePostInputs(title, code, language, fileName, tagsString)
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: validated.title,
      code: validated.code,
      language: validated.language,
      file_name: validated.fileName,
      tags: validated.tags,
    } as any)
  
  if (error) throw error
  
  revalidatePath('/feed')
  revalidatePath('/new')
}

// Optimized trending tags using materialized view (falls back to query if view doesn't exist)
export const getTrendingTags = cache(async () => {
  const supabase = await createClient()
  
  // Try to use materialized view first (much faster)
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
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(data as any)?.forEach((post: any) => {
    post.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

export const getPlatformStats = cache(async () => {
  const supabase = await createClient()
  
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
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any) || []).reduce((acc: Record<string, 'up' | 'down'>, vote: any) => {
    acc[vote.post_id] = vote.type
    return acc
  }, {} as Record<string, 'up' | 'down'>)
})

// Get language distribution across all posts
export const getLanguageDistribution = cache(async () => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select('language')
  
  if (error) throw error
  
  const languageCounts: Record<string, number> = {}
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(data as any)?.forEach((post: any) => {
    languageCounts[post.language] = (languageCounts[post.language] || 0) + 1
  })
  
  const total = (data as any)?.length || 1
  
  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
})

export async function updatePost(postId: string, formData: FormData): Promise<Tables<'posts'>> {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
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
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postData = post as any
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
  
  const updateData = {
    title: validated.title,
    code: validated.code,
    language: validated.language,
    file_name: validated.fileName,
    tags: validated.tags,
  }
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase
    .from('posts') as any)
    .update(updateData)
    .eq('id', postId)
    .eq('author_id', user.id)
    .select()
    .single()
  
  if (error) {
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
  
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any
}

export async function deletePost(postId: string): Promise<void> {
  validateId(postId, 'post ID')
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  // Check ownership
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single()
  
  if (fetchError || !post) throw new Error('Post not found')
  // Type assertion needed due to Supabase TypeScript inference issue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((post as any).author_id !== user.id) throw new Error('Not authorized')
  
  // Delete comments first (foreign key constraint)
  const { error: commentsError } = await supabase
    .from('comments')
    .delete()
    .eq('post_id', postId)
  
  if (commentsError) throw commentsError
  
  // Delete votes
  const { error: votesError } = await supabase
    .from('votes')
    .delete()
    .eq('post_id', postId)
  
  if (votesError) throw votesError
  
  // Delete post
  const { error: postError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)
  
  if (postError) throw postError
  
  revalidatePath('/feed')
  revalidatePath('/new')
  revalidatePath('/trending')
  revalidatePath('/top')
  revalidatePath('/profile/[username]')
}
