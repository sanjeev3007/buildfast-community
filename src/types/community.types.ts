/**
 * Community-related types
 */

/** Display label for platform; filter value is lowercase or "all". */
export const PLATFORMS = [
  'All',
  'Blog',
  'Twitter',
  'Instagram',
  'Facebook',
  'LinkedIn',
] as const;

/** Category/segment options for filters. */
export const CATEGORIES = [
  'All',
  'AI',
  'SaaS',
  'Engineering',
  'AI Tools',
  'Startup',
  'Productivity',
  'Design',
  'No-Code',
  'Automation',
] as const;

/** Normalize platform for filter comparison (twitter ↔ x). */
export function normalizePlatformForFilter(p: string): string {
  const s = p.toLowerCase();
  return s === 'x' ? 'twitter' : s;
}

/** Allowed post_type values; must match DB constraint community_posts_post_type_check */
export const COMMUNITY_POST_TYPES = ['linkedin', 'instagram', 'twitter', 'x', 'blog'] as const;

export type CommunityPostType = (typeof COMMUNITY_POST_TYPES)[number];

/** Raw row shape from Supabase table `community_posts` */
export interface CommunityPostRow {
  id: number;
  post_type: CommunityPostType;
  link: string;
  author_name: string;
  author_email: string;
  created_at: string;
  updated_at: string;
}

/** App model for a community/social post. content/image come from link preview, not DB. */
export interface SocialPost {
  id: string | number;
  platform: CommunityPostType;
  author: {
    name: string;
    avatar?: string;
    role?: string;
    email?: string;
  };
  /** Filled by /api/link-preview from post URL (og:description, etc.). */
  content?: string;
  /** Filled by /api/link-preview from post URL (og:image, etc.). */
  image?: string;
  tags?: string[];
  publishedAt: string;
  likes?: number;
  comments?: number;
  externalUrl: string;
  type: 'social'; // Discriminator
}

// -----------------------------------------------------------------------------
// Community Join Types
// -----------------------------------------------------------------------------

export const COMMUNITY_JOIN_TABLE = 'community_join';

/** Row returned from Supabase community_join */
export interface CommunityJoinRow {
  id: number;
  email: string;
  created_at: string;
}

/** POST /api/community-join body */
export interface JoinCommunityRequest {
  email: string;
}

/** POST /api/community-join success response */
export interface JoinCommunitySuccess {
  ok: true;
}

/** POST /api/community-join error response */
export interface JoinCommunityError {
  ok: false;
  error: string;
}

export type JoinCommunityResponse = JoinCommunitySuccess | JoinCommunityError;

// -----------------------------------------------------------------------------
// Unified Post Types (for mixed feed)
// -----------------------------------------------------------------------------

/** Union type for all post types in the community feed */
export type CommunityPost = SocialPost | {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  views: number;
  type: 'text'; // Discriminator
};

// -----------------------------------------------------------------------------
// Other Community Types
// -----------------------------------------------------------------------------

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featuredImage: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  author: Author;
  content: string;
  company: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'tool' | 'guide' | 'template' | 'course';
  url: string;
  tags: string[];
  featured: boolean;
}

export const tagColors: Record<string, string> = {
  AI: 'cyan',
  SaaS: 'purple',
  Startup: 'blue',
  Tools: 'cyan',
  Productivity: 'green',
  Design: 'pink',
  'No-Code': 'orange',
  Development: 'blue',
  Tutorial: 'green',
  Guide: 'cyan',
  Growth: 'purple',
  Career: 'blue',
  Community: 'pink',
  Automation: 'cyan',
  MVP: 'orange',
};
