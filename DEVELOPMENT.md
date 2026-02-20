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
- [x] **Favicon & Metadata:**
  - [x] Apply new favicon set via `metadata`.
  - [x] Update `manifest.json` and `browserconfig.xml` with correct icons and theme colors.
- [x] **404 Page:** Create a custom 404 page consistent with the site's theme.
- [x] **Linting & Formatting:**
  - [x] Set up Prettier with custom formatting rules.
  - [x] Configure ESLint to work with Prettier.
  - [x] Resolve initial linting errors.
  - [x] Establish and apply a consistent import order rule.
- [x] **Refactoring:**
  - [x] Reorganize `src/components` into `ui`, `layout`, and `features` directories for better maintainability.
  - [x] Migrate from `@vercel/kv` to `@upstash/redis` and centralize DB logic in `src/lib/db`.

## 🎨 Design System
- **Font:** `Pretendard` (Variable)
- **Colors:**
  - **Primary (Light/Dark):** `#8B5CF6` / `#B79CFF`
  - **Secondary:** `#F3B9FF`
  - **Background (Light/Dark):** `#f5f5f5` / `#1B1B1B`
  - **Sub Background (Light/Dark):** `#e5e7eb` / `#2D2D2D`
  - **Text (Light/Dark):** `#1B1B1B` / `#E0E0E0`
  - **Border (Light/Dark):** `#d1d5db` / `#333333`

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
  - [x] **Responsive Typography:** Implement fluid typography by adjusting the root `font-size` based on breakpoints (Mobile: 12px, Tablet: 14px, Desktop: 16px).
  - [x] **Mobile Header:** Implement a responsive hamburger menu for mobile devices (< 768px).
    - [x] Full-screen dropdown menu with larger touch targets.
    - [x] Consistent styling for navigation links and theme toggle.
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
  - [x] **Block Rendering Improvements:**
    - [x] Recursive rendering for nested lists (`ul`, `ol`) with depth-based styling.
    - [x] Enhanced `CodeBlock` with language label and copy button.
    - [x] Support for `table`, `column_list`, `quote` (with styling), and `divider`.
    - [x] Improved light mode visibility (colors, borders).
- [ ] **About Page UI:** Design and implement the content and layout for the About page.
- [ ] **Resume Page UI:** Design and implement the Resume page, considering either a PDF embed or a custom-designed layout.

### 3. Advanced Features
- [x] **Graph View (Obsidian Style):**
  - [x] Implement a visualization component using `react-force-graph-2d`.
  - [x] Visualize posts as nodes, colored by category.
  - [x] Group posts by project using a central project node and invisible category links.
  - [x] Add interactivity: Click to navigate, Zoom/Pan support.
  - [x] Optimize performance with `React.memo` and responsive sizing.
  - [x] **Enhancements:**
    - [x] Visualize `related` posts as links.
    - [x] Theme-aware node colors (Pastel for Light, Neon for Dark).
    - [x] Optimized physics engine settings to prevent node overlap.
- [x] **Analytics & SEO:**
  - [x] Add `<GoogleAnalytics gaId="..." />` to `src/app/layout.tsx`.
  - [x] Dynamically generate metadata for posts and set up `robots.txt`, `sitemap.xml`.
  - [x] Implement real-time page views using Upstash/Vercel KV.
- [x] **Interactive Elements:**
  - [x] **Comments:** Implement a custom comment system using Vercel KV (Redis).
    - [x] Anonymous commenting with password protection for edit/delete.
    - [x] Secure password storage using `bcryptjs`.
    - [x] Admin deletion support via `ADMIN_PASSWORD`.
    - [x] User-friendly UI with inline forms and validation feedback.

## 📝 User Notes
- Keep the design as simple as possible.
- The PDF resume/portfolio will be added manually later.
- Filter Notion posts to show only those with `Status` set to `Published`.
- **Identity:** The Korean name is 윤재현, but use the English name **yunio**. The blog name is **yunio's blog**.

---
**Last Updated:** 2026-02-20
**Agent Status:** Metadata updated. Ready for About/Resume pages.
