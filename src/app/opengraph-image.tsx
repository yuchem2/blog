import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "Yunio's Blog";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  const fontRegularData = await fetch(new URL('./fonts/Pretendard-Regular.ttf', import.meta.url)).then((res) => res.arrayBuffer());
  const fontBoldData = await fetch(new URL('./fonts/Pretendard-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());
  const imageData = await fetch(new URL('../../public/logo.png', import.meta.url)).then((res) => res.arrayBuffer());
  const imageBase64 = Buffer.from(imageData).toString('base64');

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
        <img src={`data:image/png;base64,${imageBase64}`} alt="Blog Logo" width="250" height="250" />
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
          data: fontRegularData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Pretendard',
          data: fontBoldData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
