import { ImageResponse } from 'next/og';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { getPostById } from '@/lib/notion-server';

// export const runtime = 'edge';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

export const alt = "Yunio's Blog Post";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const fontRegularData = readFile(join(process.cwd(), 'src/app/fonts/Pretendard-Regular.ttf'));
    const fontBoldData = readFile(join(process.cwd(), 'src/app/fonts/Pretendard-Bold.ttf'));

    const [fontRegular, fontBold] = await Promise.all([fontRegularData, fontBoldData]);

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          padding: '60px',
          fontFamily: '"Pretendard"',
          position: 'relative',
          gap: '40px',
        }}
      >
        {/* 배경 장식 (그라데이션 원) */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'linear-gradient(135deg, #B79CFF 0%, #F3B9FF 100%)',
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(100px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #B79CFF 100%)',
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        {/* 로고 (우측 상단) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${baseUrl}/logo.png`} alt="Blog Logo" width="100" height="100" style={{ position: 'absolute', top: 60, right: 60 }} />

        {/* 상단: 블로그 이름 */}
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, color: '#8B5CF6', marginBottom: '10px' }}>Yunio&apos;s Blog</div>

        {/* 중앙: 카테고리, 날짜, 제목, 설명 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', zIndex: 10 }}>
          {/* 카테고리 & 날짜 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: 24, color: '#4b5563' }}>
            {post.category && (
              <div
                style={{
                  padding: '8px 20px',
                  background: '#e5e7eb',
                  borderRadius: '50px',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {post.category}
              </div>
            )}
            <div style={{ display: 'flex' }}>{post.createdAt.split('T')[0]}</div>
          </div>

          {/* 제목 & 설명 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#1B1B1B',
                lineHeight: 1.2,
                display: 'flex',
                maxWidth: '85%',
              }}
            >
              {post.title}
            </div>
            {post.description && (
              <div
                style={{
                  fontSize: 32,
                  color: '#4b5563',
                  lineHeight: 1.5,
                  display: 'flex',
                  maxWidth: '90%',
                }}
              >
                {post.description}
              </div>
            )}
          </div>
        </div>

        {/* 하단: 태그 */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '100%', marginTop: '20px' }}>
          {post.tags.slice(0, 5).map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 20,
                color: '#4b5563',
                background: '#e5e7eb',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>,
      {
        ...size,
        fonts: [
          {
            name: 'Pretendard',
            data: fontRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Pretendard',
            data: fontBold,
            style: 'normal',
            weight: 700,
          },
        ],
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
