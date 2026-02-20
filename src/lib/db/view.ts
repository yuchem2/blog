import { redis } from './client';

export async function getViews(slug: string): Promise<number> {
  try {
    const views = await redis.get<number>(`pageviews:${slug}`);
    return views ?? 0;
  } catch (error) {
    console.error('Error fetching views:', error);
    return 0;
  }
}

export async function incrementViews(slug: string): Promise<number> {
  try {
    const views = await redis.incr(`pageviews:${slug}`);
    return views;
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
}
