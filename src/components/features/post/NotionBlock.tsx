'use client';

import { ReactNode, useState, useCallback } from 'react';
import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlockWithChildren } from '@/lib/notion-server';
import clsx from 'clsx';
import { Info, Link as LinkIcon } from 'lucide-react';

import { CodeBlock } from './CodeBlock';
import { Equation } from './Equation';
import { NotionBlockRenderer } from './NotionBlockRenderer';

function RichText({ text }: { text: RichTextItemResponse[] }) {
  if (!text) return null;

  return (
    <>
      {text.map((t, i) => {
        const { annotations } = t;
        // 인라인 수식의 plain_text는 LaTeX 원문이므로 그대로 쓰면 수식이 아닌 소스가 노출된다.
        let content: ReactNode = t.type === 'equation' ? <Equation expression={t.equation.expression} /> : t.plain_text;

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

// Notion API는 북마크의 og 메타데이터를 주지 않으므로 URL에서 표시용 도메인만 뽑아 쓴다.
function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
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
          {/* 인용문 아래 들여쓴 블록(수식·리스트 등). 기울임은 인용 본문에만 적용한다. */}
          {block.children && block.children.length > 0 && (
            <div className="mt-2 not-italic [&>*:last-child]:mb-0">
              <NotionBlockRenderer blocks={block.children} level={level} />
            </div>
          )}
        </blockquote>
      );
    case 'code':
      const codeContent = block.code.rich_text.map((t) => t.plain_text).join('');
      const language = block.code.language;
      return <CodeBlock language={language} code={codeContent} />;
    case 'image':
      // Notion 호스팅 파일(file)은 presigned URL이 ~1시간 후 만료되므로 프록시 경유.
      // last_edited_time을 버전으로 붙여 이미지 교체 시 CDN 캐시를 무효화한다.
      const imageUrl =
        block.image.type === 'external'
          ? block.image.external.url
          : `/api/notion-image?blockId=${block.id}&v=${encodeURIComponent(block.last_edited_time)}`;
      const caption = block.image.caption.length > 0 ? block.image.caption[0].plain_text : '';
      return <ImageBlock imageUrl={imageUrl} caption={caption} />;
    case 'equation':
      return <Equation expression={block.equation.expression} displayMode />;
    case 'callout':
      return (
        <div className="my-4 p-4 flex gap-3 bg-bg-sub border border-border-main rounded-lg">
          <div className="shrink-0 text-xl leading-7">
            {block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : <Info className="w-5 h-5 mt-0.5 text-primary" />}
          </div>
          <div className="min-w-0 flex-1 [&>*:last-child]:mb-0">
            {block.callout.rich_text.length > 0 && (
              <p className="mb-2 leading-relaxed text-text-main">
                <RichText text={block.callout.rich_text} />
              </p>
            )}
            {block.children && block.children.length > 0 && <NotionBlockRenderer blocks={block.children} level={level} />}
          </div>
        </div>
      );
    case 'bookmark':
      return (
        <a
          href={block.bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-4 flex items-center gap-3 p-4 bg-bg-sub border border-border-main rounded-lg hover:border-primary transition-colors"
        >
          <LinkIcon className="w-4 h-4 shrink-0 text-text-sub" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-text-main">
              {block.bookmark.caption.length > 0 ? <RichText text={block.bookmark.caption} /> : getHostname(block.bookmark.url)}
            </span>
            <span className="block truncate text-sm text-text-sub">{block.bookmark.url}</span>
          </span>
        </a>
      );
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
      // 미지원 블록이라도 자식까지 버리지는 않는다. 부모 하나를 놓치면 그 아래 본문이 통째로 아무 흔적 없이 사라지기 때문이다.
      console.warn(`Unsupported block type: ${block.type}`);
      return block.children && block.children.length > 0 ? <NotionBlockRenderer blocks={block.children} level={level} /> : null;
  }
}
