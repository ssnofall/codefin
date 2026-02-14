'use client';

import { useState, useTransition } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { vote } from '../../lib/actions/votes';

interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  initialUserVote?: 'up' | 'down' | null;
}

export function VoteButtons({ 
  postId, 
  upvotes: initialUpvotes, 
  downvotes: initialDownvotes,
  initialUserVote = null 
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (type: 'up' | 'down') => {
    startTransition(async () => {
      const newVote = userVote === type ? null : type;
      
      // Optimistic update
      if (userVote === type) {
        // Remove vote
        if (type === 'up') {
          setUpvotes(upvotes - 1);
        } else {
          setDownvotes(downvotes - 1);
        }
      } else if (userVote === null) {
        // Add new vote
        if (type === 'up') {
          setUpvotes(upvotes + 1);
        } else {
          setDownvotes(downvotes + 1);
        }
      } else {
        // Change vote - remove old, add new
        if (type === 'up') {
          setDownvotes(downvotes - 1);
          setUpvotes(upvotes + 1);
        } else {
          setUpvotes(upvotes - 1);
          setDownvotes(downvotes + 1);
        }
      }
      
      setUserVote(newVote);
      
      try {
        await vote(postId, newVote);
      } catch (error) {
        // Revert on error
        setUpvotes(initialUpvotes);
        setDownvotes(initialDownvotes);
        setUserVote(initialUserVote);
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('up')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          userVote === 'up'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-muted text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
        aria-label="Upvote"
      >
        <ArrowUp className="w-3 h-3" />
        <span>{upvotes}</span>
      </button>
      
      {/* Downvote Button */}
      <button
        onClick={() => handleVote('down')}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
          userVote === 'down'
            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
            : 'bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400'
        }`}
        aria-label="Downvote"
      >
        <ArrowDown className="w-3 h-3" />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
