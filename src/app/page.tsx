import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllPosts, BlogPost } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';
import { Sidebar } from '@/components/Sidebar';
import { Pagination } from '@/components/Pagination';
import { ViewCounter } from '@/components/ViewCounter';

export const revalidate = 3600;

const POSTS_PER_PAGE = 10;

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    project?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, project, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  let allPosts: BlogPost[] = [];
  if (NOTION_DATA_SOURCE_ID) {
    try {
      allPosts = await getAllPosts(NOTION_DATA_SOURCE_ID);
    } catch (error) {
      console.error('Failed to fetch all posts:', error);
    }
  }

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = category ? post.category === category : true;
    const matchesProject = project ? post.project === project : true;
    return matchesCategory && matchesProject;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col-reverse md:flex-row gap-12">
        <div className="w-full md:w-64 flex-shrink-0">
          <Sidebar currentCategory={category} currentProject={project} posts={allPosts} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="space-y-12 flex-grow">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer">
                  <Link href={`/post/${post.id}`}>
                    <div className="flex items-center gap-2 text-sm text-text-sub tabular-nums mb-1">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <ViewCounter slug={post.id} increment={false} /> {/* 조회수 표시 */}
                    </div>
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

          <div className="mt-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
