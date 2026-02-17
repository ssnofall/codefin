'use client';

import { useState } from 'react';
import { createComment } from '../../lib/actions/comments';
import { Card } from '../ui/Card';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment(postId, body);
      setBody('');
    } catch (error) {
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-card border border-input resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!body.trim() || isSubmitting}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </Card>
  );
}
