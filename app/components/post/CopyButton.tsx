'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 btn-press"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />          
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />          
        </>
      )}
    </button>
  );
}
