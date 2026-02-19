import { ReactNode } from 'react';
import { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { CodeBlock } from './CodeBlock'; // 경로 수정

// RichText 렌더링 헬퍼 컴포넌트
function RichText({ text }: { text: RichTextItemResponse[] }) {
  if (!text) return null;

  return (
    <>
      {text.map((t, i) => {
        const { annotations } = t;
        let content: ReactNode = t.plain_text;

        if (annotations.bold) content = <strong key={i}>{content}</strong>;
        if (annotations.italic) content = <em key={i}>{content}</em>;
        if (annotations.strikethrough) content = <s key={i}>{content}</s>;
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

export function NotionBlock({ block }: { block: BlockObjectResponse }) {
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
        <li className="ml-4 list-disc mb-1 text-text-main">
          <RichText text={block.bulleted_list_item.rich_text} />
        </li>
      );
    case 'numbered_list_item':
      return (
        <li className="ml-4 list-decimal mb-1 text-text-main">
          <RichText text={block.numbered_list_item.rich_text} />
        </li>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-1 my-4 bg-bg-sub italic text-text-main">
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
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={caption} className="rounded-lg w-full h-auto object-cover" />
          {caption && <figcaption className="text-center text-sm text-text-sub mt-2">{caption}</figcaption>}
        </figure>
      );
    case 'divider':
      return <hr className="my-8 border-border-main" />;
    default:
      console.warn(`Unsupported block type: ${block.type}`);
      return null;
  }
}
