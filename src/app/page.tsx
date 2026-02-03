import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getDatabasePosts, BlogPost } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export default async function Home() {
  let posts: BlogPost[] = [];

  if (NOTION_DATA_SOURCE_ID) {
    try {
      // getDatabasePosts는 이미 최신순으로 정렬되어 있으므로, 상위 3개만 가져옵니다.
      posts = (await getDatabasePosts(NOTION_DATA_SOURCE_ID)).slice(0, 3);
    } catch (error) {
      console.error('Failed to fetch posts for main page:', error);
    }
  }

  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Recent Posts</h2>
        </div>

        <div className="space-y-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <Link href={`/blog/${post.id}`}>
                  <span className="text-sm text-text-sub tabular-nums">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <h3 className="text-2xl font-bold mt-1 group-hover:text-primary transition-colors flex items-center">
                    {post.title}
                    <ArrowRight className="ml-2 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-bg-sub text-xs rounded-md border border-border-main text-text-sub">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-text-sub">게시글을 불러오는 중이거나, 게시글이 없습니다.</p>
          )}
        </div>

        <div className="mt-16 pt-8 border-t border-border-main">
          <Link href="/blog" className="text-primary font-bold hover:underline">
            모든 글 보기 →
          </Link>
        </div>
      </section>

      <footer className="mt-24 pt-8 text-text-sub text-xs border-t border-border-main/50">© 2026 yunio. Built with Next.js & Notion.</footer>
    </>
  );
}
