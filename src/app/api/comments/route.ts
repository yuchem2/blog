import { NextRequest, NextResponse } from 'next/server';

import { getComments, createComment, deleteComment, updateComment } from '@/lib/db/comment';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    const comments = await getComments(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error); // 에러 로깅 추가
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

    await createComment(postId, { username, password, content });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error); // 에러 로깅 추가
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

    const result = await deleteComment(postId, commentId, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error); // 에러 로깅 추가
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

    const result = await updateComment(postId, commentId, password, content);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating comment:', error); // 에러 로깅 추가
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
