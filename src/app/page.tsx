import Link from 'next/link';

import { getDatabasePosts, BlogPost } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export const revalidate = 3600;

export default async function HomePage() {
  let posts: BlogPost[] = [];

  if (NOTION_DATA_SOURCE_ID) {
    try {
      posts = await getDatabasePosts(NOTION_DATA_SOURCE_ID);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }

  return (
    <div className="py-12 flex-grow flex flex-col">
      <h1 className="text-4xl font-extrabold mb-12 tracking-tighter text-center">Recent Posts</h1>

      <div className="space-y-12">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/post/${post.id}`}>
                <span className="text-sm text-text-sub tabular-nums">{new Date(post.createdAt).toLocaleDateString()}</span>
                <h2 className="text-2xl font-bold mt-1 group-hover:text-primary transition-colors">{post.title}</h2>
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-bg-sub text-xs rounded-md border border-border-main text-text-sub">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-text-sub">게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
