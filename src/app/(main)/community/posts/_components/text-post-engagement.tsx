'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Heart, Send } from 'lucide-react';
import { LoginDialog } from '@/components/auth/LoginDialog';
import {
  getLikes,
  toggleLike,
  getComments,
  addComment,
} from '@/actions/likes-comments.actions';
import type { TextPostComment } from '@/types/comments.types';
import { useAuth } from '@/hooks/useAuth';

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover bg-neutral-700"
        width={32}
        height={32}
      />
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-sm font-medium text-white">
      {name[0]?.toUpperCase() || '?'}
    </div>
  );
}

export default function TextPostEngagement({ textPostId }: { textPostId: number }) {
  const { user } = useAuth();
  const currentUserAvatarUrl = (user?.user_metadata?.avatar_url as string) || null;
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<TextPostComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const refresh = useCallback(async () => {
    const likeRes = await getLikes(textPostId);
    setLikes(likeRes.count);
    setLiked(likeRes.liked);
    setCommentsLoading(true);
    try {
      const c = await getComments(textPostId);
      setComments(c);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [textPostId]);

  useEffect(() => {
    const t = setTimeout(() => {
      refresh();
    }, 0);
    return () => clearTimeout(t);
  }, [refresh]);

  const handleLike = useCallback(async () => {
    const r = await toggleLike(textPostId);
    if (r.ok) {
      setLikes(r.count);
      setLiked(r.liked);
    }
  }, [textPostId]);

  const handleComment = useCallback(async () => {
    if (!commentText.trim()) return;
    const r = await addComment(textPostId, commentText, null);
    if (r.ok) {
      setCommentText('');
      refresh();
    }
  }, [textPostId, commentText, refresh]);

  const handleReply = useCallback(
    async (parentId: number) => {
      if (!replyText[parentId]?.trim()) return;
      const r = await addComment(textPostId, replyText[parentId], parentId);
      if (r.ok) {
        setReplyText((p) => ({ ...p, [parentId]: '' }));
        setReplyTo(null);
        refresh();
      }
    },
    [textPostId, replyText, refresh]
  );

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950/50 p-6">
      <h3 className="text-base font-semibold text-white">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      <LoginDialog onTrigger={handleLike} requireLogin={refresh}>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
        >
          <Heart className={liked ? 'fill-red-500 text-red-500' : ''} size={20} />
          <span>{likes} likes</span>
        </button>
      </LoginDialog>

      <div className="flex items-center gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <LoginDialog onTrigger={handleComment} requireLogin={refresh}>
          <button
            type="button"
            className="rounded-lg bg-white p-2 hover:bg-neutral-200"
            aria-label="Send comment"
          >
            <Send size={16} className="text-black" />
          </button>
        </LoginDialog>
      </div>
      <p className="text-xs text-neutral-500">Sign in with Google to comment.</p>

      <div className="min-h-[120px] space-y-4 max-h-[60vh] overflow-y-auto">
        {commentsLoading ? (
          <p className="text-sm text-neutral-500">Loading comments…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-neutral-500">No comments yet. Be the first to comment.</p>
        ) : (
          comments.map((c) => (
          <div key={c.id}>
            <div className="flex gap-3">
              <Avatar
                name={c.authorName}
                imageUrl={c.userId === user?.id ? currentUserAvatarUrl : undefined}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-white">{c.authorName}</span>
                  <span className="text-xs text-neutral-500">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-neutral-300">
                  {c.content}
                </p>
                <button
                  type="button"
                  onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  className="mt-1 text-xs text-neutral-400 hover:text-white"
                >
                  Reply
                </button>
                {replyTo === c.id && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={replyText[c.id] ?? ''}
                      onChange={(e) =>
                        setReplyText((p) => ({ ...p, [c.id]: e.target.value }))
                      }
                      placeholder="Reply…"
                      className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-white placeholder:text-neutral-500"
                    />
                    <LoginDialog onTrigger={() => handleReply(c.id)} requireLogin={refresh}>
                      <button
                        type="button"
                        className="rounded-lg bg-white px-3 py-1 text-sm text-black hover:bg-neutral-200"
                      >
                        Send
                      </button>
                    </LoginDialog>
                  </div>
                )}
              </div>
            </div>
            {c.replies.length > 0 && (
              <div className="mt-3 ml-11 border-l-2 border-neutral-700 pl-4 space-y-3">
                {c.replies.map((r) => (
                  <div key={r.id} className="flex gap-3">
                    <Avatar
                      name={r.authorName}
                      imageUrl={r.userId === user?.id ? currentUserAvatarUrl : undefined}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white">
                          {r.authorName}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {formatRelativeTime(r.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm text-neutral-400">
                        {r.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
        )}
      </div>
    </div>
  );
}
