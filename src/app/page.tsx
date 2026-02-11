import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDatabasePosts, PaginatedPosts } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';
import { Sidebar } from '@/components/Sidebar';
import { Pagination } from '@/components/Pagination';

export const revalidate = 3600;

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    project?: string;
    cursor?: string; // cursor 추가
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, project, cursor } = await searchParams;
  const filter = { category, project };

  let pageData: PaginatedPosts = { posts: [], nextCursor: null, hasMore: false };

  if (NOTION_DATA_SOURCE_ID) {
    try {
      pageData = await getDatabasePosts(NOTION_DATA_SOURCE_ID, cursor, 10, filter);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-12">
      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar currentCategory={category} currentProject={project} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="space-y-12">
          {pageData.posts.length > 0 ? (
            pageData.posts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <Link href={`/post/${post.id}`}>
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
                  <p className="text-text-sub mt-3 line-clamp-2">{post.description}</p>
                </Link>
              </article>
            ))
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-text-sub">게시글이 없습니다.</p>
            </div>
          )}
        </div>

        <Pagination nextCursor={pageData.nextCursor} hasMore={pageData.hasMore} />
      </div>
    </div>
  );
}
