import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

import { redis } from './client';
import { ADMIN_PASSWORD } from '@/lib/env';

export interface Comment {
  id: string;
  postId: string;
  username: string;
  password: string;
  content: string;
  createdAt: number;
}

export async function getComments(postId: string): Promise<Omit<Comment, 'password'>[]> {
  try {
    const commentsMap = await redis.hgetall<Record<string, Comment>>(`comments:${postId}`);

    if (!commentsMap) {
      return [];
    }

    const comments = Object.values(commentsMap).sort((a, b) => b.createdAt - a.createdAt);

    // 비밀번호 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return comments.map(({ password, ...rest }) => rest);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(postId: string, data: Pick<Comment, 'username' | 'password' | 'content'>): Promise<void> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const id = nanoid();

  const newComment: Comment = {
    id,
    postId,
    username: data.username,
    password: hashedPassword,
    content: data.content,
    createdAt: Date.now(),
  };

  await redis.hset(`comments:${postId}`, { [id]: newComment });
}

// 댓글 검증 및 조회 (내부용)
async function verifyComment(postId: string, commentId: string, password: string): Promise<{ comment?: Comment; error?: string; status?: number }> {
  const comment = await redis.hget<Comment>(`comments:${postId}`, commentId);

  if (!comment) {
    return { error: 'Comment not found', status: 404 };
  }

  // 1. 관리자 비밀번호 확인
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    return { comment };
  }

  // 2. 댓글 비밀번호 확인
  const isMatch = await bcrypt.compare(password, comment.password);

  if (!isMatch) {
    return { error: 'Incorrect password', status: 401 };
  }

  return { comment };
}

export async function deleteComment(
  postId: string,
  commentId: string,
  password: string,
): Promise<{ success: boolean; error?: string; status?: number }> {
  const verification = await verifyComment(postId, commentId, password);
  if (verification.error) {
    return { success: false, error: verification.error, status: verification.status };
  }

  await redis.hdel(`comments:${postId}`, commentId);
  return { success: true };
}

export async function updateComment(
  postId: string,
  commentId: string,
  password: string,
  content: string,
): Promise<{ success: boolean; error?: string; status?: number }> {
  const verification = await verifyComment(postId, commentId, password);
  if (verification.error) {
    return { success: false, error: verification.error, status: verification.status };
  }

  // verification.comment가 존재함이 보장됨
  const updatedComment = { ...verification.comment!, content };
  await redis.hset(`comments:${postId}`, { [commentId]: updatedComment });

  return { success: true };
}
