<div align="center">

# Yunio's Blog & Portfolio

[**[ Visit the Blog at yunio.dev ]**](https://yunio.dev)

</div>

---

A personal blog and portfolio website for Yunio (윤재현), built with Next.js 15 (App Router). Focused on sharing knowledge, showcasing projects, and growing as a developer.

## Features

- **Server-First Architecture:** Optimized for performance and SEO using Next.js Server Components by default.
- **Notion API Integration:** Content is managed and fetched from Notion databases.
- **Modern UI/UX:** Built with Tailwind CSS v4, `next-themes` for dark/light mode, and `Pretendard` font.
- **Interactive Elements:** Graph View (Obsidian style), comment system, and real-time page view counter.
- **SEO & Analytics:** Dynamic Open Graph image generation, XML sitemap, and Google Analytics integration.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4, `next-themes`
- **CMS:** Notion API
- **Database:** Upstash Redis (comments & view counts)
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Deployment:** Vercel

## Getting Started

Clone the repository and install dependencies:

```bash
git clone [YOUR_REPOSITORY_URL]
cd yunios-blog
pnpm install
```

Set up environment variables by creating a `.env.local` file:

```env
NOTION_TOKEN=secret_...
NOTION_DATA_SOURCE_ID=...
NEXT_PUBLIC_GA_ID=G-...
ADMIN_PASSWORD=...

# Upstash Redis
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Deployed on [Vercel](https://vercel.com/) and accessible via the custom domain `yunio.dev`.