'use server';

import { createClient } from '@/utils/supabase/server';
import type { TextPostComment, LikesResult } from '@/types/comments.types';

export async function getLikes(textPostId: number): Promise<LikesResult> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('community_text_post_likes')
    .select('user_id')
    .eq('text_post_id', textPostId);
  const count = rows?.length ?? 0;
  const { data: { user } } = await supabase.auth.getUser();
  const liked = !!user && !!rows?.some((r) => r.user_id === user.id);
  return { count, liked };
}

export async function toggleLike(textPostId: number): Promise<{ ok: boolean; liked: boolean; count: number }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, liked: false, count: 0 };
  const { data: existing } = await supabase
    .from('community_text_post_likes')
    .select('id')
    .eq('text_post_id', textPostId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) {
    await supabase
      .from('community_text_post_likes')
      .delete()
      .eq('text_post_id', textPostId)
      .eq('user_id', user.id);
  } else {
    await supabase.from('community_text_post_likes').insert({
      text_post_id: textPostId,
      user_id: user.id,
    });
  }
  const { count } = await supabase
    .from('community_text_post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('text_post_id', textPostId);
  return { ok: true, liked: !existing, count: count ?? 0 };
}

function mapRowToComment(row: {
  id: number;
  text_post_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  author_name: string;
  created_at: string;
}): TextPostComment {
  return {
    id: row.id,
    textPostId: row.text_post_id,
    userId: row.user_id,
    parentId: row.parent_id,
    content: row.content,
    authorName: row.author_name,
    createdAt: row.created_at,
    replies: [],
  };
}

export async function getComments(textPostId: number): Promise<TextPostComment[]> {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('community_text_post_comments')
    .select('id, text_post_id, user_id, parent_id, content, author_name, created_at')
    .eq('text_post_id', textPostId)
    .order('created_at', { ascending: true });
  if (error || !rows) return [];
  const comments = rows.map((r) => mapRowToComment(r as Parameters<typeof mapRowToComment>[0]));
  const byId = new Map(comments.map((c) => [c.id, c]));
  const topLevel: TextPostComment[] = [];
  for (const c of comments) {
    if (c.parentId == null) topLevel.push(c);
    else {
      const parent = byId.get(c.parentId);
      if (parent) parent.replies.push(c);
    }
  }
  return topLevel;
}

export async function addComment(
  textPostId: number,
  content: string,
  parentId?: number | null
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not logged in' };
  const authorName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    user.email?.split('@')[0] ||
    'Anonymous';

  const { error } = await supabase.from('community_text_post_comments').insert({
    text_post_id: textPostId,
    user_id: user.id,
    parent_id: parentId ?? null,
    content: content.trim(),
    author_name: authorName,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Returns like count and comment count for a text post (for cards/listing). */
export async function getPostCounts(textPostId: number): Promise<{
  likeCount: number;
  commentCount: number;
}> {
  try {
    const supabase = await createClient();
    const [likesRes, commentsRes] = await Promise.all([
      supabase
        .from('community_text_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('text_post_id', textPostId),
      supabase
        .from('community_text_post_comments')
        .select('*', { count: 'exact', head: true })
        .eq('text_post_id', textPostId),
    ]);
    return {
      likeCount: likesRes.count ?? 0,
      commentCount: commentsRes.count ?? 0,
    };
  } catch {
    return { likeCount: 0, commentCount: 0 };
  }
}
