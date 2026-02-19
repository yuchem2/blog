'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (language === 'mermaid' && mounted && mermaidRef.current) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: resolvedTheme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
          });

          const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
          const { svg } = await mermaid.render(id, code);

          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Mermaid rendering failed:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerText = 'Failed to render diagram';
          }
        }
      }
    };
    renderMermaid();
  }, [language, code, resolvedTheme, mounted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!mounted) {
    return (
      <pre className="p-4 rounded-lg bg-bg-sub overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  if (language === 'mermaid') {
    return (
      <div className="my-4 p-4 flex justify-center items-center bg-bg-sub rounded-lg border border-border-main overflow-x-auto">
        <div ref={mermaidRef} className="w-full flex justify-center" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border-main bg-bg-sub">
      <div className="flex justify-between items-center px-4 py-2 bg-bg-sub border-b border-border-main">
        <span className="text-xs font-mono text-text-sub">{language}</span>
        <button onClick={handleCopy} className="p-1 rounded-md hover:bg-bg-main transition-colors text-text-sub" aria-label="Copy code">
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="text-sm">
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : prism}
          customStyle={{
            margin: 0,
            borderRadius: 0, // 상단 헤더가 있으므로 둥근 모서리 제거
            backgroundColor: isDark ? '#1E1E1E' : '#f4f4f5',
            padding: '1.5rem',
          }}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
