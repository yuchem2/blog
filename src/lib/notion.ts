import { NotionAPI } from 'notion-client';

export const notion = new NotionAPI();

export async function getPageData(pageId: string) {
  return await notion.getPage(pageId);
}

// 나중에 데이터베이스에서 글 목록을 가져오는 로직도 여기에 추가할 수 있습니다.
