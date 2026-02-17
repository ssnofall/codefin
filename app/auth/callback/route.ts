import { createClient } from '../../lib/supabase/server';
import { NextResponse } from 'next/server';
import { validateRedirectPath } from '../../lib/utils/validation';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/feed';
  
  // Validate the redirect path
  const next = validateRedirectPath(nextParam);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure profile exists (fallback in case database trigger doesn't work)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          // Create profile if missing
          const username = user.user_metadata?.user_name || 
                          user.user_metadata?.preferred_username || 
                          `user_${user.id.substring(0, 8)}`;
          const avatarUrl = user.user_metadata?.avatar_url || 
                           `https://github.com/identicons/${user.id}.png`;
          
          await supabase.from('profiles').insert({
            id: user.id,
            username: username,
            avatar_url: avatarUrl
          });
        }
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
