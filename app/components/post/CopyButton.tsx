'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      <Copy className="w-3 h-3" />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
