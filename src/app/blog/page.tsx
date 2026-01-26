import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const DUMMY_POSTS = [
  { slug: 'example-post-1', title: 'Next.js 15와 Notion API 연동하기', date: '2026-01-26', tags: ['Next.js', 'Notion'] },
  { slug: 'example-post-2', title: '다크모드를 고려한 디자인 시스템 설계', date: '2026-01-20', tags: ['Design', 'CSS'] },
  { slug: 'example-post-3', title: 'Vercel로 블로그 배포하고 SEO 최적화하기', date: '2026-01-15', tags: ['DevOps', 'SEO'] },
];

export default function BlogListPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <Link href="/" className="inline-flex items-center text-sm text-text-sub hover:text-primary mb-12 transition-colors">
        <ArrowLeft className="mr-2 w-4 h-4" /> Home
      </Link>

      <h1 className="text-3xl font-extrabold mb-12 tracking-tight">Blog Posts</h1>

      <div className="space-y-12">
        {DUMMY_POSTS.map((post) => (
          <article key={post.slug} className="group cursor-pointer">
            <Link href={`/blog/${post.slug}`}>
              <span className="text-sm text-text-sub tabular-nums">{post.date}</span>
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
        ))}
      </div>
    </div>
  );
}
