'use client';

import React from 'react';
import PostCard from '@/components/community/PostCard';
import TextPostCard from '@/components/community/TextPostCard';
import type { UnifiedPost } from '@/actions/posts.actions';

interface FeedItemProps {
  post: UnifiedPost;
}

/**
 * Renders a single post in the community feed (social link post or text/blog post).
 */
export default function FeedItem({ post }: FeedItemProps) {
  if (post.type === 'social') {
    return <PostCard post={post} />;
  }
  return <TextPostCard post={post} />;
}
