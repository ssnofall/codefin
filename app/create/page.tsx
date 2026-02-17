'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '../lib/actions/posts';
import { Card } from '../components/ui/Card';
import { CodeEditor } from '../components/editor/CodeEditor';
import { LANGUAGES, MAX_TAGS } from '../lib/utils/constants';

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [fileName, setFileName] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('tags', tags.join(','));
    formData.set('code', code);
    formData.set('language', language);

    try {
      await createPost(formData);
      router.push('/feed');
      router.refresh();
    } catch (error) {
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Create Post</h1>
        <p className="text-sm text-muted-foreground">Share your code with the community</p>
      </div>

      <Card className="p-3 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Give your post a title"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-h-[44px]"
            />
          </div>

          {/* Language & File Name - Side by side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
            {/* Language */}
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language <span className="text-destructive">*</span>
              </label>
              <select
                id="language"
                name="language"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer text-foreground transition-colors min-h-[44px]"
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
            <div className="space-y-1.5 sm:space-y-2">
              <label htmlFor="file_name" className="text-sm font-medium">
                File Name <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                type="text"
                id="file_name"
                name="file_name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g., main.js"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          {/* Code */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Code <span className="text-destructive">*</span>
            </label>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language || 'text'}
              fileName={fileName}
              placeholder="Paste your code here..."
              name="code"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags <span className="text-muted-foreground text-xs">(max {MAX_TAGS})</span>
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary/70 transition-colors touch-target min-w-[20px] min-h-[20px] flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              disabled={tags.length >= MAX_TAGS}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-input focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-colors min-h-[44px]"
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag
            </p>
          </div>

          {/* Submit - Responsive layout */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 sm:py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
