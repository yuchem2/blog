import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const DUMMY_POSTS = [
  { slug: 'example-post-1', title: 'Next.js 15와 Notion API 연동하기', date: '2026-01-26', tags: ['Next.js', 'Notion'] },
  { slug: 'example-post-2', title: '다크모드를 고려한 디자인 시스템 설계', date: '2026-01-20', tags: ['Design', 'CSS'] },
  { slug: 'example-post-3', title: 'Vercel로 블로그 배포하고 SEO 최적화하기', date: '2026-01-15', tags: ['DevOps', 'SEO'] },
];

export default function Home() {
  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Recent Posts</h2>
        </div>

        <div className="space-y-10">
          {DUMMY_POSTS.map((post) => (
            <article key={post.slug} className="group cursor-pointer">
              <Link href={`/blog/${post.slug}`}>
                <span className="text-sm text-text-sub tabular-nums">{post.date}</span>
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
          ))}
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
