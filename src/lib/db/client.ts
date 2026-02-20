import { Redis } from '@upstash/redis';

// Vercel KV 환경 변수(KV_REST_API_URL, KV_REST_API_TOKEN)를 자동으로 감지하여 초기화
export const redis = Redis.fromEnv();
