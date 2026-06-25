import { NextRequest, NextResponse } from 'next/server';
import { isFullBlock } from '@notionhq/client';

import { notionClient } from '@/lib/notion-server';

// 프록시 응답을 CDN에 캐싱 (이미지 교체 시 호출부의 `v=last_edited_time`이 캐시 키를 무효화)
const CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate=604800';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blockId = searchParams.get('blockId');

  if (!blockId) {
    return NextResponse.json({ error: 'blockId is required' }, { status: 400 });
  }

  try {
    const block = await notionClient.blocks.retrieve({ block_id: blockId });

    if (!isFullBlock(block) || block.type !== 'image') {
      return NextResponse.json({ error: 'Block is not an image' }, { status: 404 });
    }

    // 요청 시점에 fresh presigned URL을 획득 (S3 URL 만료 회피)
    const sourceUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;

    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok || !imageResponse.body) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 });
    }

    const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';

    return new NextResponse(imageResponse.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error(`Error proxying notion image for block "${blockId}":`, error);
    return NextResponse.json({ error: 'Error fetching image' }, { status: 500 });
  }
}
