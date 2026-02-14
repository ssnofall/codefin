import { Card } from '../ui/Card';
import { FileText, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils/formatters';
import { SCORE_LABEL } from '../../lib/utils/constants';

interface ProfileStatsProps {
  postsCount: number;
  score: number;
  commentsCount?: number;
  joinedAt: string;
}

export function ProfileStats({ postsCount, score, commentsCount = 0, joinedAt }: ProfileStatsProps) {
  const stats = [
    {
      label: 'Posts',
      value: postsCount,
      icon: FileText,
    },
    {
      label: SCORE_LABEL,
      value: score,
      icon: ThumbsUp,
    },
    {
      label: 'Comments',
      value: commentsCount,
      icon: MessageSquare,
    },
  ];

  return (
    <Card>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Member since {formatDate(joinedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
