"use server";

import { fetchSocialPosts } from "./community.actions";
import { getTextPosts } from "./text-posts.actions";
import type { SocialPost } from "@/types/community.types";
import type { TextPost } from "@/types/text-posts.types";

/** Unified post type for mixed feed */
export type UnifiedPost = 
  | SocialPost 
  | (TextPost & { type: 'text' });

/**
 * Fetches all posts (social + text) and merges them into a unified feed
 * Sorted by publishedAt descending
 */
export async function getAllPosts(): Promise<UnifiedPost[]> {
  try {
    // Fetch both types in parallel
    const [socialPostsResult, textPostsResult] = await Promise.all([
      fetchSocialPosts(),
      getTextPosts(),
    ]);

    const socialPosts: SocialPost[] = socialPostsResult || [];
    const textPosts: TextPost[] = textPostsResult.success && textPostsResult.data 
      ? textPostsResult.data.map(post => ({ ...post, type: 'text' as const }))
      : [];

    // Merge and sort by publishedAt descending
    const allPosts: UnifiedPost[] = [...socialPosts, ...textPosts];
    
    allPosts.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA; // Descending (newest first)
    });

    return allPosts;
  } catch (error) {
    console.error("[getAllPosts] Error:", error);
    return [];
  }
}
