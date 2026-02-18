import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const views = await kv.get<number>(`pageviews:${slug}`);
    return NextResponse.json({ views: views ?? 0 });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json({ error: 'Error fetching views' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const views = await kv.incr(`pageviews:${slug}`);
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Error incrementing views' }, { status: 500 });
  }
}
