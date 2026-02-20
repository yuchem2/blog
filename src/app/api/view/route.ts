import { NextRequest, NextResponse } from 'next/server';

import { getViews, incrementViews } from '@/lib/db/view';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const views = await getViews(slug);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error fetching views:', error); // 에러 로깅 추가
    return NextResponse.json({ error: 'Error fetching views' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const views = await incrementViews(slug);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error incrementing views:', error); // 에러 로깅 추가
    return NextResponse.json({ error: 'Error incrementing views' }, { status: 500 });
  }
}
