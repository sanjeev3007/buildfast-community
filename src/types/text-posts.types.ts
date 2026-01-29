/**
 * Text Posts types (admin-created blog-style posts)
 */

/** Raw row shape from Supabase table `community_text_posts` */
export interface TextPostRow {
  id: number;
  created_at: string;
  title: string;
  excerpt: string | null;
  content: string; // HTML content
  image_url: string | null;
  image_path: string | null;
  published: boolean;
  views: number;
  slug: string | null;
}

/** App model for a text post */
export interface TextPost {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML content
  imageUrl?: string;
  imagePath?: string;
  published: boolean;
  views: number;
  publishedAt: string;
  slug: string;
}

/** Response from getTextPosts action */
export interface GetTextPostsResponse {
  success: boolean;
  data?: TextPost[];
  error?: unknown;
}

/** Response from getTextPostBySlug action */
export interface GetTextPostResponse {
  success: boolean;
  data?: TextPost;
  error?: unknown;
}
