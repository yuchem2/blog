import { ImageResponse } from 'next/og';
import { join } from 'path';
import { readFile } from 'fs/promises';

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';

// export const runtime = 'edge'; // Node.js 런타임 사용

export const alt = "Yunio's Blog";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Node.js의 fs/promises를 사용하여 파일 읽기
  const fontRegularData = readFile(join(process.cwd(), 'src/app/fonts/Pretendard-Regular.ttf'));
  const fontBoldData = readFile(join(process.cwd(), 'src/app/fonts/Pretendard-Bold.ttf'));

  const [fontRegular, fontBold] = await Promise.all([fontRegularData, fontBoldData]);

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: '"Pretendard"',
        position: 'relative',
      }}
    >
      {/* 배경 장식 */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          background: 'linear-gradient(135deg, #B79CFF 0%, #F3B9FF 100%)',
          borderRadius: '50%',
          opacity: 0.15,
          filter: 'blur(100px)',
          display: 'flex',
        }}
      />

      {/* 로고 (좌측) */}
      <div
        style={{
          display: 'flex',
          padding: '40px',
          borderRight: '2px solid #e5e7eb',
          marginRight: '60px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${baseUrl}/logo.png`} alt="Blog Logo" width="250" height="250" />
      </div>

      {/* 텍스트 (우측) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#1B1B1B',
            lineHeight: 1.1,
          }}
        >
          Yunio&apos;s Blog
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#4b5563',
            lineHeight: 1.5,
          }}
        >
          A development blog by Yunio
        </div>
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
}
