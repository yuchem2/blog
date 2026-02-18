import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { ADMIN_PASSWORD } from '@/lib/env';

// 댓글 데이터 인터페이스
interface Comment {
  id: string;
  postId: string;
  username: string;
  password: string;
  content: string;
  createdAt: number;
}

// 헬퍼 함수: 댓글 조회 및 비밀번호 검증
async function verifyComment(postId: string, commentId: string, password: string) {
  const comment = await kv.hget<Comment>(`comments:${postId}`, commentId);

  if (!comment) {
    return { error: 'Comment not found', status: 404 };
  }

  // 1. 관리자 비밀번호 확인 (환경 변수에 설정된 경우)
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    return { comment }; // 관리자 권한으로 통과
  }

  // 2. 댓글 비밀번호 확인
  const isMatch = await bcrypt.compare(password, comment.password);

  if (!isMatch) {
    return { error: 'Incorrect password', status: 401 };
  }

  return { comment };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const commentsMap = await kv.hgetall<Record<string, Comment>>(`comments:${postId}`);

    if (!commentsMap) {
      return NextResponse.json([]);
    }

    const comments = Object.values(commentsMap).sort((a, b) => b.createdAt - a.createdAt);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitizedComments = comments.map(({ password, ...rest }) => rest);

    return NextResponse.json(sanitizedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, username, password, content } = body;

    if (!postId || !username || !password || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = nanoid();
    const newComment: Comment = {
      id,
      postId,
      username,
      password: hashedPassword,
      content,
      createdAt: Date.now(),
    };

    await kv.hset(`comments:${postId}`, { [id]: newComment });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, commentId, password } = body;

    if (!postId || !commentId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const verification = await verifyComment(postId, commentId, password);
    if (verification.error) {
      return NextResponse.json({ error: verification.error }, { status: verification.status });
    }

    await kv.hdel(`comments:${postId}`, commentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, commentId, password, content } = body;

    if (!postId || !commentId || !password || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const verification = await verifyComment(postId, commentId, password);
    if (verification.error) {
      return NextResponse.json({ error: verification.error }, { status: verification.status });
    }

    // verification.comment가 존재함이 보장됨
    const updatedComment = { ...verification.comment!, content };
    await kv.hset(`comments:${postId}`, { [commentId]: updatedComment });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
