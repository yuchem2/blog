'use client';

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../../ui/Button'; // 경로 수정
import clsx from 'clsx';

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: number;
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string; content?: string }>({});

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof fieldErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const content = formData.get('content') as string;

    const errors: { username?: string; password?: string; content?: string } = {};
    if (!username.trim()) errors.username = '닉네임을 입력해주세요.';
    if (!password.trim()) errors.password = '비밀번호를 입력해주세요.';
    if (!content.trim()) errors.content = '내용을 입력해주세요.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username, password, content }),
      });

      if (res.ok) {
        setFormMessage({ type: 'success', text: '댓글이 성공적으로 작성되었습니다.' });
        (e.target as HTMLFormElement).reset();
        fetchComments();
        setTimeout(() => setFormMessage(null), 3000);
      } else {
        const errorData = await res.json();
        setFormMessage({ type: 'error', text: `댓글 작성 실패: ${errorData.error}` });
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      setFormMessage({ type: 'error', text: '댓글 작성 중 오류가 발생했습니다.' });
    }
  };

  return (
    <div className="mt-16 border-t border-border-main pt-8">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-bg-sub rounded-lg border border-border-main" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="닉네임"
              onChange={handleInputChange}
              className={clsx(
                'w-full px-3 py-2 bg-bg-main border rounded-md focus:outline-none focus:ring-2',
                fieldErrors.username ? 'border-destructive focus:ring-destructive' : 'border-border-main focus:ring-primary',
              )}
            />
            {fieldErrors.username && <p className="text-xs text-destructive mt-1">{fieldErrors.username}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={handleInputChange}
              className={clsx(
                'w-full px-3 py-2 bg-bg-main border rounded-md focus:outline-none focus:ring-2',
                fieldErrors.password ? 'border-destructive focus:ring-destructive' : 'border-border-main focus:ring-primary',
              )}
            />
            {fieldErrors.password && <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>}
          </div>
        </div>
        <div className="mb-4">
          <textarea
            name="content"
            placeholder="댓글을 입력하세요..."
            rows={3}
            onChange={handleInputChange}
            className={clsx(
              'w-full px-3 py-2 bg-bg-main border rounded-md focus:outline-none focus:ring-2',
              fieldErrors.content ? 'border-destructive focus:ring-destructive' : 'border-border-main focus:ring-primary',
            )}
          />
          {fieldErrors.content && <p className="text-xs text-destructive mt-1">{fieldErrors.content}</p>}
        </div>
        <div className="flex justify-between items-center">
          {formMessage && <p className={clsx('text-sm', formMessage.type === 'error' ? 'text-destructive' : 'text-primary')}>{formMessage.text}</p>}
          <Button type="submit" className="ml-auto">
            댓글 작성
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {isLoading ? (
          <p>댓글을 불러오는 중...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} postId={postId} onRefresh={fetchComments} />)
        ) : (
          <p className="text-text-sub">아직 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment, postId, onRefresh }: { comment: Comment; postId: string; onRefresh: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const getErrorMessage = (errCode: string) => {
    if (errCode === 'Incorrect password') return '비밀번호가 일치하지 않습니다.';
    if (errCode === 'Comment not found') return '댓글을 찾을 수 없습니다.';
    return '오류가 발생했습니다.';
  };

  const handleDelete = async () => {
    clearError();
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, commentId: comment.id, password }),
      });

      if (res.ok) {
        onRefresh();
      } else {
        const errorData = await res.json();
        setError(getErrorMessage(errorData.error));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleUpdate = async () => {
    clearError();
    if (!editContent.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, commentId: comment.id, password, content: editContent }),
      });

      if (res.ok) {
        setIsEditing(false);
        setPassword('');
        onRefresh();
      } else {
        const errorData = await res.json();
        setError(getErrorMessage(errorData.error));
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b border-border-main pb-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">{comment.username}</span>
        <div className="flex items-center gap-2 text-sm text-text-sub">
          <span>{new Date(comment.createdAt).toLocaleString()}</span>
          {!isEditing && !isDeleting && (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsDeleting(false);
                  setPassword('');
                  clearError();
                }}
                className="hover:text-primary"
              >
                수정
              </button>
              <button
                onClick={() => {
                  setIsDeleting(true);
                  setIsEditing(false);
                  setPassword('');
                  clearError();
                }}
                className="hover:text-destructive"
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-2 p-4 bg-bg-sub rounded-lg border border-border-main">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 bg-bg-main border border-border-main rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <div className="flex items-center gap-2 mb-2">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className={clsx(
                'flex-1 px-3 py-2 bg-bg-main border rounded-md focus:outline-none focus:ring-2',
                error ? 'border-destructive focus:ring-destructive' : 'border-border-main focus:ring-primary',
              )}
            />
          </div>
          {error && <p className="text-sm text-destructive mb-2">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditing(false)} variant="outline">
              취소
            </Button>
            <Button onClick={handleUpdate}>저장</Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-4">
          <p className="text-text-main whitespace-pre-wrap flex-1 break-all">{comment.content}</p>

          {isDeleting && (
            <div className="flex items-center gap-2 shrink-0">
              {error && <span className="text-xs text-destructive whitespace-nowrap">{error}</span>}
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className={clsx(
                  'px-2 py-1 text-sm bg-bg-main border rounded-md focus:outline-none focus:ring-2 w-32 h-9',
                  error ? 'border-destructive focus:ring-destructive' : 'border-border-main focus:ring-primary',
                )}
              />
              <Button onClick={handleDelete} variant="destructive" size="sm">
                확인
              </Button>
              <Button onClick={() => setIsDeleting(false)} variant="outline" size="sm">
                취소
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
