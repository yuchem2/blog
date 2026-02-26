import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

import { getAllPosts, getPostById, getPageBlocks, getPostsByIds, BlogPost } from '@/lib/notion-server';
import { NotionBlockRenderer } from '@/components/features/post/NotionBlockRenderer';
import { TableOfContents } from '@/components/features/post/TableOfContents';
import { ViewCounter } from '@/components/features/post/ViewCounter';
import { Comments } from '@/components/features/post/Comments';
import { extractTocFromBlocks, formatDate } from '@/lib/utils';
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

  // 연관된 게시글과 역방향 게시글 정보 가져오기
  const [relatedPosts, backlinks] = await Promise.all([getPostsByIds(post.relatedPosts), getPostsByIds(post.backlinks)]);

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
              </span>
              <span>
                Updated: <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </span>
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
          <NotionBlockRenderer blocks={blocks} />
        </div>

        {/* 연관된 게시글 및 역방향 링크 섹션 */}
        <RelatedPosts backlinks={backlinks} relatedPosts={relatedPosts} />

        <Comments postId={post.id} />
      </article>

      <TableOfContents toc={toc} />
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/post/${post.id}`} className="block group">
      <div className="border border-border-main rounded-xl p-4 hover:border-primary transition-colors bg-bg-sub/50 hover:bg-bg-sub h-full flex flex-col">
        <div className="flex items-center gap-2 text-xs text-text-sub mb-2">
          {post.category && <span className="text-primary font-medium">{post.category}</span>}
          {post.category && <span>•</span>}
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
        {post.description && <p className="text-sm text-text-sub line-clamp-2 mb-3 flex-grow">{post.description}</p>}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-bg-main rounded border border-border-main text-text-sub">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function RelatedPosts({ backlinks, relatedPosts }: { backlinks: BlogPost[]; relatedPosts: BlogPost[] }) {
  const hasLinks = backlinks.length > 0 || relatedPosts.length > 0;
  if (!hasLinks) return null;

  return (
    <div className="mt-20 pt-10 border-t border-border-main space-y-12">
      {backlinks.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
            <LinkIcon className="w-5 h-5 text-primary" />
            <span>이 글을 참조하는 글</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {backlinks.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
            <ArrowRight className="w-5 h-5 text-primary" />
            <span>더 알아보기</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
