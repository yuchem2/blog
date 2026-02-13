import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocFromBlocks(blocks: BlockObjectResponse[]): TocItem[] {
  const toc: TocItem[] = [];

  blocks.forEach((block) => {
    // h1은 제목으로 간주하여 TOC에서 제외할 수도 있지만,
    // 만약 본문 내에 h1을 쓴다면 level 1로 처리합니다.
    // 사용자의 요청에 따라 h2부터 시작하는 구조로 변경합니다.

    if (block.type === 'heading_1') {
      toc.push({
        id: block.id,
        text: block.heading_1.rich_text[0]?.plain_text || '',
        level: 1,
      });
    } else if (block.type === 'heading_2') {
      toc.push({
        id: block.id,
        text: block.heading_2.rich_text[0]?.plain_text || '',
        level: 1, // h2를 level 1로 변경
      });
    } else if (block.type === 'heading_3') {
      toc.push({
        id: block.id,
        text: block.heading_3.rich_text[0]?.plain_text || '',
        level: 2, // h3를 level 2로 변경
      });
    }
  });

  return toc;
}
