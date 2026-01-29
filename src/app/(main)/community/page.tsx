'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/community/Navbar';
import Sidebar from '@/components/community/Sidebar';
import PostCard from '@/components/community/PostCard';
import { fetchSocialPosts } from '@/actions/community.actions';
import type { SocialPost } from '@/types/community.types';
import Header from '@/components/community/Header';

export default function CommunityPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const supabasePosts = await fetchSocialPosts();
        if (supabasePosts?.length) setPosts(supabasePosts);
      } catch {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const plat = post.platform.toLowerCase();
      const matchesPlatform =
        selectedPlatform === 'all' ||
        plat === selectedPlatform ||
        (selectedPlatform === 'twitter' && plat === 'x');
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        post.content?.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q);
      return matchesPlatform && matchesSearch;
    });
  }, [posts, selectedPlatform, searchQuery]);

  const hasActiveFilters =
    selectedPlatform !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1400px] px-6 md:px-0">
        {isSidebarOpen && (
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
          />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="min-w-0 flex-1 border-l border-neutral-800 px-6 py-12 md:px-16 md:py-20 lg:border-l">
          <Header />

          <div className="relative">
            {isLoading ? (
              <div
                className="py-24 text-center sm:py-32"
                role="status"
                aria-live="polite"
              >
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-neutral-600 sm:text-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-600" aria-hidden />
                  Loading feed…
                </div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                {hasActiveFilters && (
                  <p className="mb-6 text-[0.625rem] font-extrabold uppercase tracking-[0.2em] text-neutral-500">
                    Showing {filteredPosts.length} of {posts.length}
                  </p>
                )}
                <div className="flex flex-col gap-4 sm:gap-8" role="feed" aria-busy={false}>
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div
                className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950/50 py-12 text-center"
                role="status"
              >
                <p className="font-mono text-xs uppercase tracking-tighter text-neutral-600 sm:text-sm">
                  {posts.length === 0
                    ? 'No posts in the archive yet.'
                    : 'No matches for the current filters.'}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlatform('all');
                      setSearchQuery('');
                    }}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black mt-6 rounded-sm border border-neutral-700 bg-transparent px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-black"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>

          <footer className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-neutral-800 py-12 sm:flex-row">
            <div className="text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-400">
              BuildFastWithAI &copy; {new Date().getFullYear()}
            </div>
            <div className="flex gap-8 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-neutral-500">
              <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
                Twitter
              </a>
              <a href="#" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white">
                GitHub
              </a>
              <a
                href="mailto:hello@buildfastwithai.com"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white"
              >
                Email
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
