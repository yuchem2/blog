# 📚 Notion API Integration Guide

This document outlines how this project integrates with the Notion API to fetch and render blog content.

## 1. Notion Database Schema

To ensure the blog functions correctly, the connected Notion database must have the following properties:

| Property Name | Type | Description |
| :--- | :--- | :--- |
| **Name** | `Title` | The title of the blog post. |
| **Status** | `Status` | Must be set to **"Published"** for the post to appear on the blog. |
| **Date** | `Date` | The publication date (`createdAt`). |
| **Tags** | `Multi-select` | Tags associated with the post. |
| **Category** | `Select` | The main category of the post (used for filtering). |
| **Project** | `Select` | The project associated with the post (used for filtering). |
| **Description** | `Text` | A short summary of the post (used for SEO and list view). |
| **Cover** | `Files & media` | (Optional) The cover image of the page is used as the post thumbnail. |

> **Note:** The `Updated` time is automatically retrieved from the page's `last_edited_time` system property.

## 2. API Implementation (`src/lib/notion-server.ts`)

We use the official `@notionhq/client` library. All API calls are handled on the server side.

### 2.1. Fetching All Posts (`getAllPosts`)
- **Purpose:** Retrieves **all** published posts for the main page list and static path generation. It fetches only the page metadata (properties), not the full content blocks.
- **Method:** Iterates through Notion's pagination (`has_more`, `next_cursor`) until all data is fetched.
- **Rate Limiting:** Includes a **1-second delay (`sleep(1000)`)** between pagination requests to avoid hitting Notion's rate limit (average 3 requests/second).
- **Filtering:** Only fetches posts where `Status` is "Published".
- **Sorting:** Sorts by `Date` in descending order.

### 2.2. Fetching Post Details (`getPostById`)
- **Purpose:** Retrieves metadata for a single post (title, date, tags, etc.).
- **Method:** Uses `notionClient.pages.retrieve`.

### 2.3. Fetching Content Blocks (`getPageBlocks`)
- **Purpose:** Retrieves the actual content (blocks) of a post. This is only called when a user visits a specific post page.
- **Method:** Uses `notionClient.blocks.children.list`.
- **Pagination:** Automatically handles pagination to fetch all blocks if the content is long.

### 2.4. Fetching Filter Options (`getDatabaseProperties`)
- **Purpose:** Retrieves the available options for `Category` and `Project` filters to populate the Sidebar.
- **Method:** Uses `notionClient.dataSources.retrieve` to inspect the database schema.
- **Efficiency:** This avoids iterating through all posts just to find unique categories/projects.

## 3. Rendering Strategy: ISR (Incremental Static Regeneration)

This project uses **ISR** to combine the performance of static sites with the flexibility of dynamic data.

- **Revalidation Time:** `3600` seconds (1 hour). This value is directly set in `page.tsx` and `post/[id]/page.tsx` as a static literal.
- **Behavior:**
  1.  **Build Time:** All posts are fetched, and pages are pre-rendered as static HTML.
  2.  **Runtime:**
      - Users receive the cached static HTML instantly.
      - If a request comes after the revalidation time (1 hour), Next.js triggers a background regeneration.
      - Regeneration is triggered by the first request after the `revalidate` period. The user receives the stale content, and the cache is updated in the background for subsequent requests.
- **Pagination:** Since all data is fetched at build/revalidation time, we implement **client-side pagination** (or server-side slicing of the full dataset) on the main page. This allows for a complete "Previous/Next" navigation experience, which is difficult with Notion's native cursor-based pagination.

## 4. Image Handling

- **Source:** Images are served directly from Notion's S3 URLs.
- **Component:** Uses standard `<img>` tags instead of `next/image` to avoid issues with dynamic/changing S3 hostnames.
- **Styling:** Images in the post list are styled with `object-cover` to maintain aspect ratio within the card layout. (Note: This feature was reverted to a non-card list view).

## 5. Environment Variables

- `NOTION_TOKEN`: The integration token created in Notion Developers.
- `NOTION_DATA_SOURCE_ID`: The ID of the Notion database used as the source.
