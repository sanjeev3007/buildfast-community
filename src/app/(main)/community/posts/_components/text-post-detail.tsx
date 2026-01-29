'use client';

import React, { useEffect } from 'react';
import { Calendar, Eye } from 'lucide-react';
import type { TextPost } from '@/types/text-posts.types';
import TextPostEngagement from './text-post-engagement';

interface TextPostDetailProps {
  post: TextPost;
}

export default function TextPostDetail({ post }: TextPostDetailProps) {
  // Increment views when component mounts
  useEffect(() => {
    fetch(`/api/text-posts/${post.slug}/views`, {
      method: 'POST',
    }).catch(() => {
      // Silently fail if view increment fails
    });
  }, [post.slug]);

  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      {/* Left: Post content */}
      <article className="min-w-0 max-w-4xl">
        <header className="mb-12">
          <div className="mb-6 flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.3em]">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
              Blog Post
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
            <time dateTime={post.publishedAt} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {dateStr}
            </time>
            {post.views > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </>
            )}
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl leading-relaxed text-neutral-400">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.imageUrl && (
          <div className="mb-12 overflow-hidden rounded-lg">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Right: Comments section */}
      <aside
        className="lg:sticky lg:top-24 lg:self-start"
        aria-label="Comments"
      >
        <TextPostEngagement textPostId={post.id} />
      </aside>
    </div>
  );
}
