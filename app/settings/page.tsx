import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';
import { SettingsClient } from './SettingsClient';

export const metadata = {
  title: 'Settings - Codefin',
  description: 'Manage your Codefin account settings',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/auth/login');
  }
  
  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (profileError || !profile) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching profile:', profileError);
    }
    redirect('/feed');
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <SettingsClient 
        user={{
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          created_at: user.created_at,
        }}
        profile={profile}
      />
    </div>
  );
}
