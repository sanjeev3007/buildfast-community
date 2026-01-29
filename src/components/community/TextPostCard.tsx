'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Eye } from 'lucide-react';
import type { TextPost } from '@/types/text-posts.types';

interface TextPostCardProps {
  post: TextPost;
}

export default function TextPostCard({ post }: TextPostCardProps) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group border-b border-neutral-800 bg-black pb-12 transition-colors last:border-b-0">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
              Blog Post
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
            <time
              dateTime={post.publishedAt}
              className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-neutral-600"
            >
              {dateStr}
            </time>
            {post.views > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
                <div className="flex items-center gap-1.5 text-[0.625rem] font-medium text-neutral-600">
                  <Eye className="h-3 w-3" />
                  <span>{post.views}</span>
                </div>
              </>
            )}
          </div>
          <span className="font-bold uppercase tracking-widest text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100">
            Read Article
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-3xl font-bold leading-[0.95] tracking-tighter text-white transition-colors group-hover:text-neutral-200 md:text-4xl lg:text-5xl">
              <Link
                href={`/community/posts/${post.slug}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black block rounded-sm"
              >
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p className="max-w-xl font-light leading-relaxed text-neutral-400 line-clamp-3 text-sm md:text-base">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="w-full lg:col-span-5">
            <Link
              href={`/community/posts/${post.slug}`}
              className="group/img focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black relative block aspect-video overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900/80"
              aria-label={`Read article: ${post.title}`}
            >
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover opacity-70 grayscale transition-all duration-500 ease-out group-hover/img:scale-105 group-hover/img:opacity-100 group-hover/img:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-neutral-800 bg-neutral-950">
                  <span
                    className="select-none text-5xl font-black tracking-tighter text-neutral-800 md:text-6xl"
                    aria-hidden
                  >
                    BFA
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover/img:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
