export const NOTION_TOKEN = process.env.NOTION_TOKEN;
export const NOTION_DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID;

if (!NOTION_TOKEN) {
  throw new Error('Missing NOTION_TOKEN environment variable');
}

if (!NOTION_DATA_SOURCE_ID) {
  console.warn('Missing NOTION_DATA_SOURCE_ID environment variable');
}
