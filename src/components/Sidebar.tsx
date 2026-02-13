import Link from 'next/link';
import clsx from 'clsx';
import { getDatabaseProperties, BlogPost } from '@/lib/notion-server'; // BlogPost import
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';
import { GraphView } from './GraphView';

interface SidebarProps {
  currentCategory?: string;
  currentProject?: string;
  posts?: BlogPost[]; // posts prop 추가
}

function FilterLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        'block text-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90'
          : 'bg-bg-sub text-text-sub hover:text-text-main hover:bg-bg-sub/80',
      )}
    >
      {label}
    </Link>
  );
}

export async function Sidebar({ currentCategory, currentProject, posts = [] }: SidebarProps) {
  // posts 기본값 설정
  let categories: string[] = [];
  let projects: string[] = [];

  if (NOTION_DATA_SOURCE_ID) {
    const properties = await getDatabaseProperties(NOTION_DATA_SOURCE_ID);
    categories = properties.categories;
    projects = properties.projects;
  }

  const createQueryString = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return (
    <aside className="md:sticky md:top-32 space-y-10">
      <div className="space-y-4">
        <h4 className="font-bold text-lg px-2">Graph View</h4>
        {/* GraphView에 posts 전달 */}
        <GraphView posts={posts} />
      </div>

      {categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg px-2">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            <FilterLink href={createQueryString({ project: currentProject })} label="All" isActive={!currentCategory} />
            {categories.map((category) => (
              <FilterLink
                key={category}
                href={createQueryString({ project: currentProject, category })}
                label={category}
                isActive={currentCategory === category}
              />
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg px-2">Projects</h4>
          <div className="grid grid-cols-2 gap-2">
            <FilterLink href={createQueryString({ category: currentCategory })} label="All" isActive={!currentProject} />
            {projects.map((project) => (
              <FilterLink
                key={project}
                href={createQueryString({ category: currentCategory, project })}
                label={project}
                isActive={currentProject === project}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
