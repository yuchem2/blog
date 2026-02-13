# 📔 Project: Yunio's Blog & Portfolio

This document is a development guide for the Gemini CLI agent to reference when continuing to develop this blog project.

## 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 + `next-themes` (Dark/Light mode)
- **CMS:** Notion API (`@notionhq/client`)
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Analytics:** Google Analytics 4 (`@next/third-parties`)
- **Deployment:** Vercel

## ✅ Initial Setup & Design (Completed)
- [x] **Identity:** Set project name to `yunios-blog` and user identity to `yunio`.
- [x] **Architecture:** Establish Server-First Component Architecture and document in `AGENTS.md`.
- [x] **Font:** Apply `Pretendard` font and optimize with `next/font`.
- [x] **Color Theme:** Update color palette based on the new logo (`#B79CFF`, `#F3B9FF`) and refine dark mode border colors.
- [x] **Layout & Header:**
  - [x] Create a global layout with a full-width header and centered main content.
  - [x] Implement a reusable `Button` component.
  - [x] Design the header with the logo, navigation (`Blog`, `About`, `Resume`), and theme toggle.
  - [x] Add active link styling to the navigation.
  - [x] Refactor `Header` into a Server Component, extracting `Navigation` as a Client Component.
- [x] **Favicon:** Apply new favicon set via `metadata`.
- [x] **404 Page:** Create a custom 404 page consistent with the site's theme.
- [x] **Linting & Formatting:**
  - [x] Set up Prettier with custom formatting rules.
  - [x] Configure ESLint to work with Prettier.
  - [x] Resolve initial linting errors.
  - [x] Establish and apply a consistent import order rule.

## 🎨 Design System
- **Font:** `Pretendard` (Variable)
- **Colors:**
  - **Primary:** `#B79CFF`
  - **Secondary:** `#F3B9FF`
  - **Background (Light/Dark):** `#fafafa` / `#1B1B1B`
  - **Sub Background (Light/Dark):** `#f3f4f6` / `#2D2D2D`
  - **Text (Light/Dark):** `#1B1B1B` / `#E0E0E0`
  - **Border (Light/Dark):** `#e5e7eb` / `#333333`

## 🛠️ Feature Roadmap (To-be Implemented)

### 1. Core Functionality: Notion API Integration (Completed)
- [x] Set up `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID` in `.env.local`.
- [x] Centralize environment variable access in `src/lib/env.ts`.
- [x] Implement functions to fetch posts and blocks using `@notionhq/client`.
- [x] Implement full SSR rendering for post content, removing `react-notion-x`.
- [x] Connect main and blog pages to the Notion API.
- [x] Implement ISR (Incremental Static Regeneration) for all pages with a 1-hour revalidation period.
- [x] Document Notion API integration details in `NOTION_INTEGRATION.md`.

### 2. UI/UX Enhancements
- [x] **Routing:** Set main page as blog index and update post route to `/post/[id]`.
- [x] **Layout & Theming:**
  - [x] Implement a sticky header.
  - [x] Implement a footer that remains at the bottom of the viewport.
  - [x] Adjust main content width to be responsive (`max-w-3xl` to `5xl`).
  - [x] Refine active navigation link style for better visibility.
  - [x] Soften the light mode background color for better eye comfort.
- [x] **Main Page / Blog Index UI:**
  - [x] Refine the layout by adding a sidebar for categories/tags.
  - [x] Implement multi-filter support for categories and projects.
  - [x] Implement simple cursor-based pagination.
- [x] **Post Detail UI:**
  - [x] Implement basic SSR block renderer (`NotionBlock.tsx`).
  - [x] Add syntax highlighting for code blocks (`CodeBlock.tsx`).
  - [x] Add Mermaid diagram rendering.
  - [x] Display category and project links in the post header.
  - [x] **Table of Contents (TOC):**
    - [x] Implement a sticky TOC sidebar on the right side.
    - [x] Auto-highlight active headings based on scroll position.
    - [x] Support smooth scrolling and two-way synchronization (TOC <-> Content).
    - [x] Ensure consistent behavior on both desktop and mobile.
- [ ] **About Page UI:** Design and implement the content and layout for the About page.
- [ ] **Resume Page UI:** Design and implement the Resume page, considering either a PDF embed or a custom-designed layout.

### 3. Advanced Features
- [ ] **Graph View (Obsidian Style):**
  - [ ] Add logic to analyze backlinks between Notion pages.
  - [ ] Implement a visualization component using `react-force-graph` or D3.js.
- [ ] **Analytics & SEO:**
  - [ ] Add `<GoogleAnalytics gaId="..." />` to `src/app/layout.tsx`.
  - [ ] Dynamically generate metadata for posts and set up `robots.txt`, `sitemap.xml`.
  - [ ] Implement real-time page views using Upstash/Vercel KV.
- [ ] **Interactive Elements:**
  - [ ] **Comments:** Add a Giscus (GitHub Discussions) component.

## 📝 User Notes
- Keep the design as simple as possible.
- The PDF resume/portfolio will be added manually later.
- Filter Notion posts to show only those with `Status` set to `Published`.
- **Identity:** The Korean name is 윤재현, but use the English name **yunio**. The blog name is **yunio's blog**.

---
**Last Updated:** 2026-02-13
**Agent Status:** TOC implementation complete. Ready for About/Resume pages or Graph View.
