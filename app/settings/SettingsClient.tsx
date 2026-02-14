'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteAccount, logout } from '../lib/actions/auth';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { AlertTriangle, Trash2, LogOut } from 'lucide-react';

interface SettingsClientProps {
  user: {
    id: string;
    email?: string;
    user_metadata: {
      user_name?: string;
      preferred_username?: string;
      avatar_url?: string;
      full_name?: string;
    };
    created_at: string;
  };
  profile: {
    username: string;
    avatar_url: string;
    joined_at: string;
    score: number;
  };
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Account Information Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Account Information</h2>
          <p className="text-sm text-muted-foreground">
            Your account information is tied to your GitHub account and cannot be edited here.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          {/* Avatar and Username */}
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-16 h-16 rounded-full border-2 border-border"
            />
            <div>
              <h3 className="font-semibold text-lg">{profile.username}</h3>
              <p className="text-sm text-muted-foreground">
                GitHub: @{user.user_metadata.user_name || user.user_metadata.preferred_username || profile.username}
              </p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Account Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <p className="mt-1 text-sm font-medium">{user.email || 'Not available'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Joined
              </label>
              <p className="mt-1 text-sm font-medium">{formatDate(profile.joined_at)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Reputation Score
              </label>
              <p className="mt-1 text-sm font-medium">{profile.score.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Account Type
              </label>
              <p className="mt-1 text-sm font-medium">GitHub OAuth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize how Stackd looks for you.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </p>
            </div>
            <ThemeToggle variant="switch" />
          </div>
        </div>
      </section>

      {/* Session Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session</h2>
          <p className="text-sm text-muted-foreground">
            Manage your active session
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-medium">Sign Out</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sign out from your account on this device
              </p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions.
          </p>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your Stackd account and all associated data including your posts, 
                comments, and votes. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Delete Account?</h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This action <strong className="text-destructive">cannot be undone</strong>. 
                This will permanently delete:
              </p>
              
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                <li>Your profile and account information</li>
                <li>All your code posts and snippets</li>
                <li>All your comments</li>
                <li>Your voting history</li>
              </ul>

              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm">
                  <strong>Type DELETE to confirm:</strong>
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2 rounded-lg bg-card border border-input focus:outline-none focus:border-destructive/50 focus:ring-1 focus:ring-destructive/50 transition-colors"
              />

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                    setError(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
