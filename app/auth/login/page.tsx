import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '../../components/ui/Card';
import { APP_NAME } from '../../lib/utils/constants';
import { Github } from 'lucide-react';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/feed');
  }

  async function signInWithGithub() {
    'use server';
    
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      redirect(data.url);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-2">
              Share code. Get seen.
            </p>
          </div>

          <form action={signInWithGithub}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </form>

          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
}
