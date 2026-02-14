'use server';

import { createClient } from '../supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

/**
 * Sign out the current user
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/feed');
}

/**
 * Delete the current user's account and all associated data
 * This is a permanent action that cannot be undone
 */
export async function deleteAccount() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be logged in to delete your account');
  }
  
  // Create a service role client for admin operations
  // This requires SUPABASE_SERVICE_ROLE_KEY environment variable
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Service role key not configured. Cannot delete account.');
  }
  
  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  
  // Delete the user from auth.users
  // This will cascade delete the profile and all associated data due to foreign key constraints
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
  
  if (deleteError) {
    console.error('Error deleting user:', deleteError);
    throw new Error('Failed to delete account. Please try again later.');
  }
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Revalidate all paths to clear cached data
  revalidatePath('/', 'layout');
  
  // Redirect to feed
  redirect('/feed');
}
