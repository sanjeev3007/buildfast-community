'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/community/Navbar';
import Sidebar from '@/components/community/Sidebar';
import Header from '@/components/community/Header';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityFooter from '@/components/community/CommunityFooter';
import SidebarOverlay from '@/components/community/SidebarOverlay';
import EventsSidebar from '@/components/events/EventsSidebar';
import { getAllPosts } from '@/actions/posts.actions';
import type { UnifiedPost } from '@/actions/posts.actions';

export default function CommunityPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
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
      if (post.type === 'social') {
        const plat = post.platform.toLowerCase();
        const matchesPlatform =
          selectedPlatform === 'all' ||
          plat === selectedPlatform ||
          (selectedPlatform === 'twitter' && plat === 'x');
        if (!matchesPlatform) return false;
      } else {
        if (selectedPlatform !== 'all' && selectedPlatform !== 'blog') {
          return false;
        }
      }

      const q = searchQuery.toLowerCase();
      if (!q) return true;

      if (post.type === 'social') {
        return (
          post.content?.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q)
        );
      }
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    });
  }, [posts, selectedPlatform, searchQuery]);

  const hasActiveFilters =
    selectedPlatform !== 'all' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedPlatform('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="relative flex min-h-[calc(100vh-4rem)] w-full">
        {isSidebarOpen && (
          <SidebarOverlay onClose={() => setIsSidebarOpen(false)} />
        )}

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="min-w-0 flex-1 border-l border-neutral-800 px-6 py-12 md:px-16 md:py-20">
          <Header />

          <div className="relative">
            <CommunityFeed
              filteredPosts={filteredPosts}
              totalCount={posts.length}
              hasActiveFilters={hasActiveFilters}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
            />
          </div>

          <CommunityFooter />
        </main>

        {/* <EventsSidebar /> */}
      </div>
    </div>
  );
}
