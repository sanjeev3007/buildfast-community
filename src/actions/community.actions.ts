"use server";

import { supabase } from "@/lib/supabase";
import {
  type CommunityPostRow,
  type SocialPost,
  type CommunityPostType,
  type JoinCommunityRequest,
  type JoinCommunityResponse,
} from "@/types/community.types";

// -----------------------------------------------------------------------------
// Community Posts Actions
// -----------------------------------------------------------------------------

function isCommunityPostType(value: unknown): value is CommunityPostType {
  return (
    typeof value === "string" &&
    (['linkedin', 'instagram', 'twitter', 'x'] as const).includes(value as CommunityPostType)
  );
}

function mapRowToSocialPost(row: CommunityPostRow): SocialPost {
  return {
    id: row.id,
    platform: row.post_type,
    author: {
      name: row.author_name,
      email: row.author_email || undefined,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.author_name)}&background=0f0f0f&color=fff`,
      role: 'Community Member',
    },
    content: undefined,
    image: undefined,
    tags: [],
    publishedAt: row.created_at,
    externalUrl: row.link,
    type: 'social', // Discriminator
  };
}

/**
 * Fetches community posts from Supabase table `community_posts`, ordered by
 * created_at descending. Title/description/image are not in the DB; the UI
 * resolves them per post via /api/link-preview using each post's link.
 */
export async function fetchSocialPosts(): Promise<SocialPost[]> {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, post_type, link, author_name, author_email, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[fetchSocialPosts]', error.message, error.code);
      return [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data
      .filter((row: unknown): row is CommunityPostRow => {
        if (!row || typeof row !== 'object') return false;
        const r = row as Record<string, unknown>;
        if (!r.link || typeof r.link !== 'string' || !r.link.startsWith('http')) return false;
        if (!r.author_name || typeof r.author_name !== 'string') return false;
        if (!isCommunityPostType(r.post_type)) return false;
        return true;
      })
      .map(mapRowToSocialPost);
  } catch (error) {
    console.error('[fetchSocialPosts] Unexpected error:', error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// Community Join Actions
// -----------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidJoinEmail(value: string): boolean {
  return (
    typeof value === "string" &&
    EMAIL_REGEX.test(value.trim()) &&
    value.trim().length <= 255
  );
}

/**
 * Server action to join the community by submitting an email
 * @param request - JoinCommunityRequest containing email
 * @returns JoinCommunityResponse with success or error
 */
export async function joinCommunity(
  request: JoinCommunityRequest
): Promise<JoinCommunityResponse> {
  try {
    const email = typeof request?.email === 'string' ? request.email.trim() : '';

    if (!isValidJoinEmail(email)) {
      return {
        ok: false,
        error: 'Please enter a valid email address.',
      };
    }

    const { error } = await supabase.from('community_join').insert({ email });

    if (error) {
      if (error.code === '23505') {
        return {
          ok: false,
          error: 'This email is already on the list.',
        };
      }
      console.error('[joinCommunity]', error.message, error.code);
      return {
        ok: false,
        error: 'Something went wrong. Please try again.',
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('[joinCommunity] Unexpected error:', error);
    return {
      ok: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
