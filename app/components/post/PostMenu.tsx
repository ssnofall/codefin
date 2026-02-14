'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Tables } from '../../lib/supabase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditPostModal } from './EditPostModal';
import { DeletePostDialog } from './DeletePostDialog';

interface PostMenuProps {
  post: Tables<'posts'> & {
    profiles: {
      username: string;
      avatar_url: string;
    } | null;
  };
  isOwner: boolean;
}

export function PostMenu({ post, isOwner }: PostMenuProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!isOwner) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Post options"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setShowEditModal(true)}
            className="cursor-pointer"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPostModal
        post={post}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <DeletePostDialog
        postId={post.id}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
