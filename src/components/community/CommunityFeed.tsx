'use client';

import React from 'react';
import FeedItem from '@/components/community/FeedItem';
import type { UnifiedPost } from '@/actions/posts.actions';

interface CommunityFeedProps {
  filteredPosts: UnifiedPost[];
  totalCount: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
  onResetFilters: () => void;
}

/**
 * Main feed area: loading state, filter summary, list of posts, or empty state.
 */
export default function CommunityFeed({
  filteredPosts,
  totalCount,
  hasActiveFilters,
  isLoading,
  onResetFilters,
}: CommunityFeedProps) {
  if (isLoading) {
    return (
      <div
        className="py-24 text-center sm:py-32"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-neutral-600 sm:text-sm">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-neutral-600"
            aria-hidden
          />
          Loading feed…
        </div>
      </div>
    );
  }

  if (filteredPosts.length > 0) {
    return (
      <>
        {hasActiveFilters && (
          <p className="mb-6 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-neutral-500">
            Showing {filteredPosts.length} of {totalCount}
          </p>
        )}
        <div
          className="flex flex-col gap-4 sm:gap-8"
          role="feed"
          aria-busy={false}
        >
          {filteredPosts.map((post) => (
            <FeedItem
              key={post.type === 'social' ? `social-${post.id}` : `text-${post.id}`}
              post={post}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div
      className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950/50 py-12 text-center"
      role="status"
    >
      <p className="font-mono text-xs uppercase tracking-tighter text-neutral-600 sm:text-sm">
        {totalCount === 0
          ? 'No posts in the archive yet.'
          : 'No matches for the current filters.'}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black mt-6 rounded-sm border border-neutral-700 bg-transparent px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-black"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
