import { notFound } from 'next/navigation';

import { getDatabasePosts, getPostById, getPageBlocks } from '@/lib/notion-server';
import { NotionBlock } from '@/components/NotionBlock';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!NOTION_DATA_SOURCE_ID) return [];

  const posts = await getDatabasePosts(NOTION_DATA_SOURCE_ID);
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  const blocks = await getPageBlocks(post.id);

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">{post.title}</h1>
        <div className="flex flex-col items-center gap-2 text-text-sub text-sm">
          <div className="flex gap-4">
            <span>
              Posted: <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
            </span>
            <span>
              Updated: <time dateTime={post.updatedAt}>{new Date(post.updatedAt).toLocaleDateString()}</time>
            </span>
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
    </article>
  );
}
