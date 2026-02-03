import { Client, isFullPage } from '@notionhq/client';
import { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
}

// Notion ID를 정규화하는 함수 (하이픈 추가)
function normalizeId(id: string): string {
  if (id.length === 32) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }
  return id;
}

function mapPageToBlogPost(page: PageObjectResponse): BlogPost {
  const { properties } = page;

  const title = properties.name?.type === 'title' ? (properties.name.title[0]?.plain_text ?? 'Untitled') : 'Untitled';
  const createdAt = properties.createdAt?.type === 'date' ? (properties.createdAt.date?.start ?? '') : '';
  const updatedAt = properties.updatedAt?.type === 'last_edited_time' ? properties.updatedAt.last_edited_time : '';
  const tags = properties.tags?.type === 'multi_select' ? properties.tags.multi_select.map((tag) => tag.name) : [];

  return {
    id: normalizeId(page.id),
    title,
    createdAt,
    updatedAt,
    tags,
  };
}

export async function getDatabasePosts(dataSourceId: string): Promise<BlogPost[]> {
  try {
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
    });

    return response.results.filter((page): page is PageObjectResponse => isFullPage(page)).map(mapPageToBlogPost);
  } catch (error) {
    console.error('Error fetching database posts:', error);
    return [];
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

// 페이지의 모든 블록을 가져오는 함수
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
