"use server";

import { supabase } from "@/lib/supabase";
import type { TextPost, TextPostRow, GetTextPostsResponse, GetTextPostResponse } from "@/types/text-posts.types";

/**
 * Maps database row to TextPost model
 */
function mapRowToTextPost(row: TextPostRow): TextPost | null {
  // Skip posts without slugs
  if (!row.slug) {
    console.warn(`[mapRowToTextPost] Post ${row.id} is missing a slug, skipping`);
    return null;
  }
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content,
    imageUrl: row.image_url || undefined,
    imagePath: row.image_path || undefined,
    published: row.published,
    views: row.views,
    publishedAt: row.created_at,
    slug: row.slug,
  };
}

/**
 * Fetches all published text posts from Supabase, ordered by created_at descending
 */
export async function getTextPosts(): Promise<GetTextPostsResponse> {
  try {
    const { data, error } = await supabase
      .from("community_text_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getTextPosts] Supabase error:", error);
      return { success: false, error };
    }

    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const posts = data
      .map(mapRowToTextPost)
      .filter((post): post is TextPost => post !== null);

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("[getTextPosts] Unexpected error:", error);
    return { success: false, error };
  }
}

/**
 * Fetches a single text post by slug
 * @param slug - Post slug
 */
export async function getTextPostBySlug(slug: string): Promise<GetTextPostResponse> {
  try {
    const { data, error } = await supabase
      .from("community_text_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("[getTextPostBySlug] Supabase error:", error);
      return { success: false, error };
    }

    if (!data) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    const post = mapRowToTextPost(data);

    if (!post) {
      return {
        success: false,
        error: "Post is missing required slug",
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("[getTextPostBySlug] Unexpected error:", error);
    return { success: false, error };
  }
}

/**
 * Increments the view count for a text post
 * @param slug - Post slug
 */
export async function incrementTextPostViews(slug: string): Promise<{ success: boolean }> {
  try {
    // First get the post by slug to get its ID
    const { data: post } = await supabase
      .from("community_text_posts")
      .select("id, views")
      .eq("slug", slug)
      .single();

    if (!post) {
      return { success: false };
    }

    const { error } = await supabase.rpc("increment_text_post_views", {
      post_id: post.id,
    });

    // If RPC function doesn't exist, use update instead
    if (error && error.code === "42883") {
      const { error: updateError } = await supabase
        .from("community_text_posts")
        .update({ views: (post.views || 0) + 1 })
        .eq("slug", slug);

      if (updateError) {
        console.error("[incrementTextPostViews] Update error:", updateError);
        return { success: false };
      }
    } else if (error) {
      console.error("[incrementTextPostViews] Error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("[incrementTextPostViews] Unexpected error:", error);
    return { success: false };
  }
}
