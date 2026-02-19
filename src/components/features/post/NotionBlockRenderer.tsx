import { ReactNode } from 'react';
import { BlockWithChildren } from '@/lib/notion-server';
import { NotionBlock } from './NotionBlock';
import clsx from 'clsx';

interface NotionBlockRendererProps {
  blocks: BlockWithChildren[];
  level?: number;
}

export function NotionBlockRenderer({ blocks, level = 0 }: NotionBlockRendererProps) {
  const renderedBlocks: ReactNode[] = []; // 타입 명시
  let listGroup: BlockWithChildren[] = [];
  let listType: 'bulleted_list_item' | 'numbered_list_item' | null = null;

  const flushList = () => {
    if (listGroup.length === 0) return;

    const ListTag = listType === 'numbered_list_item' ? 'ol' : 'ul';

    // 레벨에 따른 리스트 스타일 적용
    let listStyle = '';
    if (listType === 'numbered_list_item') {
      const styles = ['list-decimal', 'list-[lower-alpha]', 'list-[lower-roman]'];
      listStyle = styles[level % styles.length];
    } else {
      const styles = ['list-disc', 'list-[circle]', 'list-[square]'];
      listStyle = styles[level % styles.length];
    }

    renderedBlocks.push(
      <ListTag key={`list-${listGroup[0].id}`} className={clsx(listStyle, 'ml-6 mb-4')}>
        {listGroup.map((block) => (
          <NotionBlock key={block.id} block={block} level={level} />
        ))}
      </ListTag>,
    );

    listGroup = [];
    listType = null;
  };

  blocks.forEach((block) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (listType && listType !== block.type) {
        flushList();
      }
      listType = block.type;
      listGroup.push(block);
    } else {
      flushList();
      renderedBlocks.push(<NotionBlock key={block.id} block={block} level={level} />);
    }
  });

  flushList();

  return <>{renderedBlocks}</>;
}
