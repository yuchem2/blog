'use client';

import { ReactNode, useState, useCallback } from 'react';
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlockWithChildren } from '@/lib/notion-server';
import clsx from 'clsx';

import { CodeBlock } from './CodeBlock';
import { NotionBlockRenderer } from './NotionBlockRenderer';

function RichText({ text }: { text: RichTextItemResponse[] }) {
  if (!text) return null;

  return (
    <>
      {text.map((t, i) => {
        const { annotations } = t;
        let content: ReactNode = t.plain_text;

        if (annotations.bold) content = <strong key={i}>{content}</strong>;
        if (annotations.italic) content = <em key={i}>{content}</em>;
        if (annotations.strikethrough)
          content = (
            <span key={i} className="line-through">
              {content}
            </span>
          );
        if (annotations.underline) content = <u key={i}>{content}</u>;
        if (annotations.code)
          content = (
            <code key={i} className="bg-bg-sub px-1.5 py-0.5 rounded text-sm font-mono text-primary">
              {content}
            </code>
          );

        if (t.href) {
          return (
            <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {content}
            </a>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function ImageBlock({ imageUrl, caption }: { imageUrl: string; caption: string }) {
  const [isLoading, setIsLoading] = useState(true);

  // ref 콜백을 사용하여 DOM 노드가 생성될 때 이미 로드되었는지 확인
  const imageRef = useCallback((node: HTMLImageElement) => {
    if (node !== null) {
      if (node.complete) {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <figure className="my-8 flex flex-col items-center w-full">
      <div className={clsx('relative w-full flex justify-center', isLoading && 'min-h-[200px]')}>
        {isLoading && <div className="absolute inset-0 bg-bg-sub animate-pulse rounded-lg w-full h-full" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt={caption}
          className={clsx('rounded-lg max-w-full h-auto object-contain transition-opacity duration-500', isLoading ? 'opacity-0' : 'opacity-100')}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>
      {caption && <figcaption className="text-center text-base text-text-sub mt-3">{caption}</figcaption>}
    </figure>
  );
}

export function NotionBlock({ block, level = 0 }: { block: BlockWithChildren; level?: number }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-4 leading-relaxed text-text-main">
          <RichText text={block.paragraph.rich_text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1 id={block.id} className="text-3xl font-bold mt-10 mb-4 text-text-main scroll-mt-24 group">
          <a href={`#${block.id}`} className="hover:underline decoration-primary decoration-2">
            <RichText text={block.heading_1.rich_text} />
          </a>
        </h1>
      );
    case 'heading_2':
      return (
        <h2 id={block.id} className="text-2xl font-bold mt-8 mb-3 text-text-main scroll-mt-24 group">
          <a href={`#${block.id}`} className="hover:underline decoration-primary decoration-2">
            <RichText text={block.heading_2.rich_text} />
          </a>
        </h2>
      );
    case 'heading_3':
      return (
        <h3 id={block.id} className="text-xl font-bold mt-6 mb-2 text-text-main scroll-mt-24 group">
          <a href={`#${block.id}`} className="hover:underline decoration-primary decoration-2">
            <RichText text={block.heading_3.rich_text} />
          </a>
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li className="mb-1 text-text-main">
          <RichText text={block.bulleted_list_item.rich_text} />
          {block.children && block.children.length > 0 && <NotionBlockRenderer blocks={block.children} level={level + 1} />}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li className="mb-1 text-text-main">
          <RichText text={block.numbered_list_item.rich_text} />
          {block.children && block.children.length > 0 && <NotionBlockRenderer blocks={block.children} level={level + 1} />}
        </li>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 pr-4 py-1 my-4 bg-bg-sub italic text-text-main">
          <RichText text={block.quote.rich_text} />
        </blockquote>
      );
    case 'code':
      const codeContent = block.code.rich_text.map((t) => t.plain_text).join('');
      const language = block.code.language;
      return <CodeBlock language={language} code={codeContent} />;
    case 'image':
      const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      const caption = block.image.caption.length > 0 ? block.image.caption[0].plain_text : '';
      return <ImageBlock imageUrl={imageUrl} caption={caption} />;
    case 'divider':
      return <hr className="my-8 border-t border-border-main" />;
    case 'table':
      return (
        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border-collapse border border-border-main">
            <tbody>
              {block.children?.map((child) => (
                <NotionBlock key={child.id} block={child} level={level} />
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'table_row':
      return (
        <tr className="border-b border-border-main last:border-none">
          {block.table_row.cells.map((cell, i) => (
            <td key={i} className="p-2 border-r border-border-main last:border-none text-sm text-text-main">
              <RichText text={cell} />
            </td>
          ))}
        </tr>
      );
    case 'column_list':
      return (
        <div className="flex flex-row gap-4 my-4 w-full">
          {block.children?.map((child) => (
            <NotionBlock key={child.id} block={child} level={level} />
          ))}
        </div>
      );
    case 'column':
      return <div className="flex-1 min-w-0">{block.children && <NotionBlockRenderer blocks={block.children} level={level} />}</div>;
    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return null;
  }
}
