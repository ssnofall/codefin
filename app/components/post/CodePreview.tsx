'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { CopyButton } from './CopyButton';

interface CodePreviewProps {
  code: string;
  language: string;
  fileName?: string | null;
}

export function CodePreview({ code, language, fileName }: CodePreviewProps) {
  const [highlighted, setHighlighted] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function highlightCode() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Dynamically import shiki only on client
        const { codeToHtml } = await import('shiki');
        
        const html = await codeToHtml(code, {
          lang: language.toLowerCase() === 'other' ? 'text' : language.toLowerCase(),
          theme: 'github-dark',
        });

        if (isMounted) {
          // Sanitize Shiki HTML output to prevent XSS
          // Allow style attribute since we have 'unsafe-inline' for styles in CSP
          const sanitizedHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['pre', 'code', 'span', 'div'],
            ALLOWED_ATTR: ['class', 'style'],
          });
          setHighlighted(sanitizedHtml);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Shiki highlighting failed:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to highlight code');
          setIsLoading(false);
        }
      }
    }

    highlightCode();

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  return (
    <div className="terminal-window rounded-2xl overflow-hidden">
      {/* IDE-style header */}
      <div className="terminal-header flex items-center justify-between px-4 py-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        </div>
        <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
          {fileName || language}
        </span>
        <CopyButton code={code} />
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto scrollbar-thin">
        {isLoading ? (
          // Loading state - show plain code
          <pre className="p-4 text-sm font-mono leading-relaxed text-foreground bg-transparent m-0">
            <code>{code}</code>
          </pre>
        ) : error ? (
          // Error state - show plain code with error indicator
          <pre className="p-4 text-sm font-mono leading-relaxed text-foreground bg-transparent m-0">
            <code>{code}</code>
          </pre>
        ) : (
          // Highlighted code
          <div
            className="p-4 text-sm font-mono leading-relaxed [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
      </div>
    </div>
  );
}
