'use server';

import { cache } from 'react';
import { createClient } from '../supabase/server';
import { Tables } from '../supabase/types';

// Cached data fetching
export const getProfileByUsername = cache(async (username: string): Promise<Tables<'profiles'> | null> => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) return null;
  return data as Tables<'profiles'>;
});

export const getUserLanguages = cache(async (userId: string) => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('language')
    .eq('author_id', userId);
  
  if (error) throw error;
  
  const languageCounts: Record<string, number> = {};
  ;(data as Tables<'posts'>[] | null)?.forEach((post) => {
    languageCounts[post.language] = (languageCounts[post.language] || 0) + 1;
  });
  
  const total = (data as Tables<'posts'>[] | null)?.length || 1;
  
  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
});
