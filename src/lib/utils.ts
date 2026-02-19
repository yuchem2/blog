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
        level: 1,
      });
    } else if (block.type === 'heading_3') {
      toc.push({
        id: block.id,
        text: block.heading_3.rich_text[0]?.plain_text || '',
        level: 2,
      });
    }
  });

  return toc;
}

export function formatDate(dateString: string | number, includeTime = false): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return `${year}-${month}-${day}`;
}
