import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getDatabasePosts, BlogPost } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export const revalidate = 3600;

export default async function BlogListPage() {
  let posts: BlogPost[] = [];

  if (NOTION_DATA_SOURCE_ID) {
    try {
      posts = await getDatabasePosts(NOTION_DATA_SOURCE_ID);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="inline-flex items-center text-sm text-text-sub hover:text-primary mb-12 transition-colors">
        <ArrowLeft className="mr-2 w-4 h-4" /> Home
      </Link>

      <h1 className="text-3xl font-extrabold mb-12 tracking-tight">Blog Posts</h1>

      <div className="space-y-12">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/blog/${post.id}`}>
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
          <p className="text-text-sub">게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
