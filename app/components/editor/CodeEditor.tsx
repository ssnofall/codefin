'use client';

import { useEffect, useState, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { CopyButton } from '../post/CopyButton';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  fileName?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export function CodeEditor({
  code,
  onChange,
  language,
  fileName,
  placeholder = 'Paste your code here...',
  name,
  required,
}: CodeEditorProps) {
  const [highlighted, setHighlighted] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function highlightCode() {
      try {
        setIsLoading(true);
        const { codeToHtml } = await import('shiki');
        
        const html = await codeToHtml(code || '', {
          lang: language.toLowerCase() === 'other' ? 'text' : language.toLowerCase(),
          theme: 'github-dark',
        });

        if (isMounted) {
          // Extract just the inner content from Shiki's output
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const codeElement = doc.querySelector('code');
          setHighlighted(codeElement?.innerHTML || '');
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setHighlighted('');
          setIsLoading(false);
        }
      }
    }

    highlightCode();

    return () => {
      isMounted = false;
    };
  }, [code, language]);

  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117]">
      {/* IDE-style header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {fileName || language}
        </span>
        <CopyButton code={code} />
      </div>

      {/* Editor with line numbers */}
      <div className="flex overflow-hidden">
        {/* Line numbers */}
        <div className="flex-shrink-0 py-4 px-3 bg-[#0d1117] border-r border-border/50 select-none">
          {lines.map((lineNum) => (
            <div
              key={lineNum}
              className="text-xs text-muted-foreground/50 font-mono leading-6 text-right"
              style={{ minWidth: '2ch' }}
            >
              {lineNum}
            </div>
          ))}
        </div>

        {/* Code editor */}
        <div ref={editorRef} className="flex-1 overflow-auto">
          <Editor
            value={code}
            onValueChange={onChange}
            highlight={(code) => {
              if (isLoading || !highlighted) {
                return code
                  .split('\n')
                  .map((line) => `<span>${line || ' '}</span>`)
                  .join('\n');
              }
              return highlighted;
            }}
            padding={16}
            placeholder={placeholder}
            name={name}
            required={required}
            className="font-mono text-sm"
            textareaClassName="focus:outline-none bg-transparent text-transparent caret-white"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
              fontSize: 14,
              lineHeight: '1.5rem',
              minHeight: '300px',
            }}
          />
        </div>
      </div>

      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={code}
          required={required}
        />
      )}
    </div>
  );
}
