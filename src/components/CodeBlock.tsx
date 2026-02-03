'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

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
    <div className="my-4 rounded-lg overflow-hidden text-sm border border-border-main">
      <SyntaxHighlighter
        language={language}
        style={isDark ? vscDarkPlus : prism}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          backgroundColor: isDark ? '#1E1E1E' : '#f4f4f5',
          padding: '1.5rem',
        }}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
