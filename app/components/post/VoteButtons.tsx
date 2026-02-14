'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { vote } from '../../lib/actions/votes';

interface VoteButtonsProps {
  postId: string;
  score: number;
  orientation?: 'vertical' | 'horizontal';
  initialUserVote?: 'up' | 'down' | null;
}

export function VoteButtons({ 
  postId, 
  score: initialScore, 
  orientation = 'vertical',
  initialUserVote = null 
}: VoteButtonsProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);
  const [isPending, startTransition] = useTransition();

  const handleVote = (type: 'up' | 'down') => {
    startTransition(async () => {
      const newVote = userVote === type ? null : type;
      
      // Optimistic update
      if (userVote === type) {
        // Remove vote
        setScore(type === 'up' ? score - 1 : score + 1);
      } else if (userVote === null) {
        // Add new vote
        setScore(type === 'up' ? score + 1 : score - 1);
      } else {
        // Change vote
        setScore(type === 'up' ? score + 2 : score - 2);
      }
      
      setUserVote(newVote);
      
      try {
        await vote(postId, newVote);
      } catch (error) {
        // Revert on error
        setScore(initialScore);
        setUserVote(initialUserVote);
      }
    });
  };

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-1 ${
        isVertical ? 'min-w-[48px]' : ''
      }`}
    >
      <button
        onClick={() => handleVote('up')}
        disabled={isPending}
        className={`p-1.5 rounded-lg transition-colors ${
          userVote === 'up'
            ? 'text-orange-500 bg-orange-500/10'
            : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      
      <span
        className={`font-bold text-sm ${
          userVote === 'up'
            ? 'text-orange-500'
            : userVote === 'down'
            ? 'text-red-500'
            : ''
        }`}
      >
        {score}
      </span>
      
      <button
        onClick={() => handleVote('down')}
        disabled={isPending}
        className={`p-1.5 rounded-lg transition-colors ${
          userVote === 'down'
            ? 'text-red-500 bg-red-500/10'
            : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
        }`}
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
