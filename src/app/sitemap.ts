import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/notion-server';
import { NOTION_DATA_SOURCE_ID } from '@/lib/env';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yunio.dev';

  // 정적 페이지
  const routes = ['', '/about', '/resume'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  if (!NOTION_DATA_SOURCE_ID) {
    return routes;
  }

  // 동적 페이지 (블로그 게시물)
  const posts = await getAllPosts(NOTION_DATA_SOURCE_ID);

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: new Date(post.updatedAt).toISOString().split('T')[0],
  }));

  return [...routes, ...postRoutes];
}
