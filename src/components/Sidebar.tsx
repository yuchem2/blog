import Link from 'next/link';
import clsx from 'clsx';
import { getDatabaseProperties } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

interface SidebarProps {
  currentCategory?: string;
  currentProject?: string;
}

export async function Sidebar({ currentCategory, currentProject }: SidebarProps) {
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
    <aside className="lg:sticky lg:top-32 space-y-10">
      {' '}
      {/* top-28 -> top-32 */}
      <div className="space-y-4">
        <h4 className="font-bold text-lg px-2">Graph View</h4>
        <div className="rounded-2xl p-6 border border-border-main text-center text-sm text-text-sub">Graph visualization coming soon...</div>
      </div>
      {categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg px-2">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={createQueryString({ project: currentProject })}
              className={clsx(
                'block text-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
                !currentCategory ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'bg-bg-sub text-text-sub hover:text-text-main',
              )}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={createQueryString({ project: currentProject, category })}
                className={clsx(
                  'block text-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  currentCategory === category
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'bg-bg-sub text-text-sub hover:text-text-main',
                )}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg px-2">Projects</h4>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={createQueryString({ category: currentCategory })}
              className={clsx(
                'block text-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
                !currentProject ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'bg-bg-sub text-text-sub hover:text-text-main',
              )}
            >
              All
            </Link>
            {projects.map((project) => (
              <Link
                key={project}
                href={createQueryString({ category: currentCategory, project })}
                className={clsx(
                  'block text-center px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  currentProject === project
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'bg-bg-sub text-text-sub hover:text-text-main',
                )}
              >
                {project}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
