import { Client, isFullPage, type PageObjectResponse, type BlockObjectResponse, type GetDataSourceResponse } from '@notionhq/client';
import { NOTION_TOKEN } from './env';

export const notionClient = new Client({
  auth: NOTION_TOKEN,
});

export interface BlogPost {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  project: string;
  description: string;
}

// API 호출 사이에 지연을 주기 위한 헬퍼 함수
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllPosts(dataSourceId: string): Promise<BlogPost[]> {
  let allPosts: BlogPost[] = [];
  let cursor: string | undefined;

  try {
    while (true) {
      const response = await notionClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: 'status',
          status: {
            equals: 'Published',
          },
        },
        sorts: [
          {
            property: 'createdAt',
            direction: 'descending',
          },
        ],
        start_cursor: cursor,
      });

      const posts = response.results.filter((page): page is PageObjectResponse => isFullPage(page)).map(mapPageToBlogPost);

      allPosts = [...allPosts, ...posts];

      if (!response.has_more) break;

      cursor = response.next_cursor ?? undefined;

      // API Rate Limit을 피하기 위해 1초 대기
      await sleep(1000);
    }
    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

function mapPageToBlogPost(page: PageObjectResponse): BlogPost {
  const { properties } = page;

  const title = properties.name?.type === 'title' ? (properties.name.title[0]?.plain_text ?? 'Untitled') : 'Untitled';
  const createdAt = properties.createdAt?.type === 'date' ? (properties.createdAt.date?.start ?? '') : '';
  const updatedAt = properties.updatedAt?.type === 'last_edited_time' ? properties.updatedAt.last_edited_time : '';
  const tags = properties.tags?.type === 'multi_select' ? properties.tags.multi_select.map((tag) => tag.name) : [];
  const category = properties.category?.type === 'select' ? (properties.category.select?.name ?? '') : '';
  const project = properties.project?.type === 'select' ? (properties.project.select?.name ?? '') : '';
  const description = properties.description?.type === 'rich_text' ? (properties.description.rich_text[0]?.plain_text ?? '') : '';

  return {
    id: normalizeId(page.id),
    title,
    createdAt,
    updatedAt,
    tags,
    category,
    project,
    description,
  };
}

export async function getDatabaseProperties(dataSourceId: string): Promise<{ categories: string[]; projects: string[] }> {
  try {
    const response = await notionClient.dataSources.retrieve({ data_source_id: dataSourceId });

    const categories: string[] = [];
    const projects: string[] = [];

    if ('properties' in response) {
      const properties = response.properties as GetDataSourceResponse['properties'];

      const categoryProperty = properties.category;
      if (categoryProperty?.type === 'select') {
        categories.push(...categoryProperty.select.options.map((option) => option.name));
      }

      const projectProperty = properties.project;
      if (projectProperty?.type === 'select') {
        projects.push(...projectProperty.select.options.map((option) => option.name));
      }
    }

    return { categories, projects };
  } catch (error) {
    console.error('Error fetching database properties:', error);
    return { categories: [], projects: [] };
  }
}

export async function getPostById(pageId: string): Promise<BlogPost | undefined> {
  try {
    const page = await notionClient.pages.retrieve({ page_id: pageId });
    if (isFullPage(page)) {
      return mapPageToBlogPost(page);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching page by id "${pageId}":`, error);
    return undefined;
  }
}

export async function getPageBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  let blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  while (true) {
    const { results, next_cursor, has_more } = await notionClient.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    const fullBlocks = results.filter((block): block is BlockObjectResponse => 'type' in block);
    blocks = [...blocks, ...fullBlocks];

    if (!has_more) {
      break;
    }
    cursor = next_cursor ?? undefined;
  }

  return blocks;
}

function normalizeId(id: string): string {
  if (id.length === 32) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }
  return id;
}
