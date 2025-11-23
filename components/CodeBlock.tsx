import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  code: string;
  copyLabel?: string;
  copiedLabel?: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  title, 
  code, 
  copyLabel = "Copy",
  copiedLabel = "Copied",
  language = 'powershell' 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-lg my-4" dir="ltr">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase">{title}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono text-emerald-400 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};