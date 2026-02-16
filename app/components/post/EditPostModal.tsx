'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Tables } from '../../lib/supabase/types';
import { updatePost } from '../../lib/actions/posts';
import { CodeEditor } from '../editor/CodeEditor';
import { LANGUAGES, MAX_TAGS } from '../../lib/utils/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditPostModalProps {
  post: Tables<'posts'> & {
    profiles: {
      username: string;
      avatar_url: string;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditPostModal({ post, isOpen, onClose }: EditPostModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [title, setTitle] = useState(post.title);
  const [code, setCode] = useState(post.code);
  const [language, setLanguage] = useState(post.language);
  const [fileName, setFileName] = useState(post.file_name || '');
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < MAX_TAGS) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    // Validation
    if (!title || !code || !language) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('title', title);
    formData.set('code', code);
    formData.set('language', language);
    formData.set('file_name', fileName);
    formData.set('tags', tags.join(','));

    try {
      await updatePost(post.id, formData);
      router.refresh();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
              className="w-full px-4 py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label htmlFor="edit-language" className="text-sm font-medium">
              Language <span className="text-destructive">*</span>
            </label>
            <select
              id="edit-language"
              name="language"
              required
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer text-foreground transition-colors"
            >
              <option value="" className="bg-card text-foreground">Select a language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-card text-foreground">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <label htmlFor="edit-file_name" className="text-sm font-medium">
              File Name <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              id="edit-file_name"
              name="file_name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., main.js, App.tsx, README.md"
              className="w-full px-4 py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label htmlFor="edit-code" className="text-sm font-medium">
              Code <span className="text-destructive">*</span>
            </label>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language || 'text'}
              fileName={fileName}
              placeholder="Paste your code here..."
              name="code"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="edit-tags" className="text-sm font-medium">
              Tags <span className="text-muted-foreground">(max {MAX_TAGS})</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary/70 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="edit-tags"
              name="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter (e.g., react, api, tutorial)"
              disabled={tags.length >= MAX_TAGS}
              className="w-full px-4 py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
