export const NOTION_TOKEN = process.env.NOTION_TOKEN;
export const NOTION_DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID;
export const NEXT_PUBLIC_GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const KV_REST_API_URL = process.env.KV_REST_API_URL;
export const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

if (!NOTION_TOKEN) {
  throw new Error('Missing NOTION_TOKEN environment variable');
}

if (!NOTION_DATA_SOURCE_ID) {
  console.warn('Missing NOTION_DATA_SOURCE_ID environment variable');
}

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  console.warn('Missing Vercel KV environment variables. View counting will not work.');
}
