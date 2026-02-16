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
          // Use CSS variables instead of inline styles for CSP compliance
          transformers: [{
            pre(node) {
              // Add CSS classes instead of inline styles
              node.properties.class = 'shiki-pre';
              // Remove inline styles that violate CSP
              delete node.properties.style;
            },
            code(node) {
              node.properties.class = 'shiki-code';
              delete node.properties.style;
            },
            span(node) {
              // Keep the color class but remove inline style
              const style = node.properties.style;
              if (typeof style === 'string') {
                const color = style.match(/color:([^;]+)/)?.[1];
                if (color) {
                  // Map common colors to CSS classes
                  node.properties.class = `shiki-token ${getColorClass(color)}`;
                }
              }
              delete node.properties.style;
            },
          }],
        });

        if (isMounted) {
          // Sanitize Shiki HTML output to prevent XSS
          const sanitizedHtml = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['pre', 'code', 'span', 'div'],
            ALLOWED_ATTR: ['class'],
          });
          setHighlighted(sanitizedHtml);
          setIsLoading(false);
        }
      } catch (err) {
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
    <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117]">
      {/* IDE-style header - Responsive */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-[#161b22] border-b border-border">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono truncate max-w-[120px] sm:max-w-[200px]">
          {fileName || language}
        </span>
        <CopyButton code={code} />
      </div>
      
      {/* Code content - Responsive */}
      <div className="overflow-x-auto scrollbar-thin">
        {isLoading ? (
          // Loading state - show plain code
          <pre className="p-2 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed text-foreground bg-transparent m-0">
            <code>{code}</code>
          </pre>
        ) : error ? (
          // Error state - show plain code with error indicator
          <pre className="p-2 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed text-foreground bg-transparent m-0">
            <code>{code}</code>
          </pre>
        ) : (
          // Highlighted code
          <div
            className="p-2 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Maps color values to CSS classes for CSP compliance
 * This avoids inline styles which violate strict CSP
 */
function getColorClass(color: string): string {
  // Normalize color
  const normalized = color.toLowerCase().replace(/\s/g, '');
  
  // Map colors to semantic classes
  const colorMap: Record<string, string> = {
    '#ff7b72': 'shiki-red',
    '#79c0ff': 'shiki-blue',
    '#e3b341': 'shiki-yellow',
    '#7ee787': 'shiki-green',
    '#d2a8ff': 'shiki-purple',
    '#ffa198': 'shiki-pink',
    '#ff9bce': 'shiki-magenta',
    '#56d364': 'shiki-lime',
    '#ffdcd7': 'shiki-light-red',
    '#c9d1d9': 'shiki-white',
    '#8b949e': 'shiki-gray',
    '#f0883e': 'shiki-orange',
  };
  
  return colorMap[normalized] || 'shiki-default';
}
