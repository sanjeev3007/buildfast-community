'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLinkIcon, PlatformIcon } from '@/components/community/icons';
import type { SocialPost } from '@/types/community.types';

interface PostCardProps {
  post: SocialPost;
}

/** True if string is mostly hashtags (e.g. LinkedIn og:title "#tag #tag | Brand") */
function isHashtagHeavy(text: string): boolean {
  if (!text || text.length > 500) return false;
  const trimmed = text.trim();
  const hashTokens = trimmed.match(/#\w+/g);
  const wordTokens = trimmed.split(/\s+/).filter(Boolean);
  if (!hashTokens?.length || !wordTokens.length) return false;
  return hashTokens.length >= 2 && hashTokens.length >= wordTokens.length * 0.4;
}

/** Split "main content" and trailing "hashtags" so content is first, hashtags last and smaller */
function splitMainAndHashtags(title: string, description: string): {
  lead: string;
  body: string;
  hashtags: string;
} {
  const desc = (description || '').trim();
  const tit = (title || '').trim();

  if (isHashtagHeavy(tit)) {
    const firstSentence = desc.match(/^[^.!?]+[.!?]?/)?.[0]?.trim() || desc.slice(0, 120).trim();
    const lead = firstSentence || 'Post';
    const body = desc.slice(firstSentence.length).trim();
    return { lead, body, hashtags: tit };
  }

  const hashMatch = desc.match(/\s+((?:#\w+\s*)+)$/);
  if (hashMatch) {
    const hashtags = hashMatch[1].trim();
    const main = desc.slice(0, desc.length - hashMatch[0].length).trim();
    const firstSentence = main.match(/^[^.!?]+[.!?]?/)?.[0]?.trim() || main.slice(0, 120).trim();
    return {
      lead: tit || firstSentence || 'Post',
      body: main.slice(firstSentence.length).trim(),
      hashtags,
    };
  }

  return {
    lead: tit || desc.slice(0, 100).trim() || 'New update',
    body: tit ? desc : desc.slice(100).trim(),
    hashtags: '',
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [previewData, setPreviewData] = useState<{
    image?: string;
    description?: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    if (post.externalUrl && !(post.image && post.content)) {
      fetch('/api/link-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: post.externalUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.image || data?.description || data?.title) {
            setPreviewData({
              image: data.image,
              description: data.description,
              title: data.title,
            });
          }
        })
        .catch(() => {});
    }
  }, [post.externalUrl, post.image, post.content]);

  const displayImage = post.image || previewData?.image;

  const { lead, body, hashtags } = useMemo(() => {
    const title = previewData?.title ?? '';
    const desc = post.content || previewData?.description || '';
    if (previewData || post.content) {
      return splitMainAndHashtags(title, desc);
    }
    return { lead: 'New update', body: '', hashtags: '' };
  }, [previewData, post.content]);

  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const platformLabel = post.platform === 'x' ? 'X' : post.platform;

  return (
    <article className="group border-b border-neutral-800 bg-black pb-12 transition-colors last:border-b-0">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-500">
              <PlatformIcon type={post.platform} />
              {platformLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
            <time
              dateTime={post.publishedAt}
              className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-neutral-600"
            >
              {dateStr}
            </time>
          </div>
          <span className="font-bold uppercase tracking-widest text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100">
            Read Thread
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-3xl font-bold leading-[0.95] tracking-tighter text-white transition-colors group-hover:text-neutral-200 md:text-4xl lg:text-5xl">
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black block rounded-sm"
              >
                {lead}
              </a>
            </h2>
            {body && (
              <p className="max-w-xl font-light leading-relaxed text-neutral-400 line-clamp-3 text-sm md:text-base">
                {body}
              </p>
            )}
            {hashtags && (
              <p className="pt-6 text-xs font-medium tracking-wide text-blue-500">
                {hashtags}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4" role="list">
                {post.tags.map((cat) => (
                  <span key={cat} className="cursor-default border border-neutral-800 px-3 py-1 text-[0.5625rem] font-bold uppercase text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-400">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:col-span-5">
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/img focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black relative block aspect-video overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900/80"
              aria-label={`Open link: ${lead}`}
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt=""
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
              <span className="absolute bottom-4 right-4 translate-y-2 bg-white p-2 text-black opacity-0 transition-all duration-300 group-hover/img:translate-y-0 group-hover/img:opacity-100">
                <ExternalLinkIcon />
              </span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="text-[9px] font-bold text-white"
                  aria-hidden
                >
                  {post.author.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="truncate text-[0.625rem] font-medium uppercase tracking-widest text-neutral-500">
              {post.author.name}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
