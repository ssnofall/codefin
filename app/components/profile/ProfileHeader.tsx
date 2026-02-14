import Image from 'next/image';
import Link from 'next/link';
import { Calendar, FileText, Award, Github } from 'lucide-react';
import { Card } from '../ui/Card';
import { SCORE_LABEL, APP_NAME } from '../../lib/utils/constants';
import { formatDate } from '../../lib/utils/formatters';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  joined_at: string;
  score: number;
}

interface ProfileHeaderProps {
  profile: Profile;
  postsCount: number;
  githubUsername?: string;
}

export function ProfileHeader({ profile, postsCount, githubUsername }: ProfileHeaderProps) {
  return (
    <Card>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <Image
          src={profile.avatar_url}
          alt={profile.username}
          width={96}
          height={96}
          className="rounded-2xl border-2 border-border"
          priority
        />

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          
          {githubUsername && (
            <p className="text-sm text-muted-foreground mt-1">
              <Github className="w-4 h-4 inline mr-1" />
              @{githubUsername}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(profile.joined_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{postsCount} posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{SCORE_LABEL}: {profile.score}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
