import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getAllPosts, getPostById, getPageBlocks } from '@/lib/notion-server';
import { NotionBlock } from '@/components/features/post/NotionBlock';
import { TableOfContents } from '@/components/features/post/TableOfContents';
import { ViewCounter } from '@/components/features/post/ViewCounter';
import { Comments } from '@/components/features/post/Comments';
import { extractTocFromBlocks, formatDate } from '@/lib/utils'; // formatDate import
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!NOTION_DATA_SOURCE_ID) return [];

  const allPosts = await getAllPosts(NOTION_DATA_SOURCE_ID);
  return allPosts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  const blocks = await getPageBlocks(post.id);
  const toc = extractTocFromBlocks(blocks);

  return (
    <div className="relative flex justify-center">
      <article className="w-full">
        <header className="mb-10 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-sm">
            {post.category && (
              <Link href={`/?category=${post.category}`} className="text-primary hover:underline">
                {post.category}
              </Link>
            )}
            {post.project && (
              <>
                <span className="text-text-sub">/</span>
                <Link href={`/?project=${post.project}`} className="text-primary hover:underline">
                  {post.project}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-col items-center gap-2 text-text-sub text-sm">
            <div className="flex gap-4 items-center">
              <span>
                Posted: <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </span>{' '}
              {/* formatDate 사용 */}
              <span>
                Updated: <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </span>{' '}
              {/* formatDate 사용 */}
              <ViewCounter slug={post.id} increment={true} />
            </div>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-bg-sub rounded-md border border-border-main">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          {blocks.map((block) => (
            <NotionBlock key={block.id} block={block} />
          ))}
        </div>

        <Comments postId={post.id} />
      </article>

      <TableOfContents toc={toc} />
    </div>
  );
}
