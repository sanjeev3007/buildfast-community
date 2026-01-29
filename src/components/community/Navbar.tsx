'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon } from './Icons';
import JoinCommunityDialog from './JoinCommunityDialog';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const isCommunity = pathname === '/community' || pathname?.startsWith('/community');
  const isAbout = pathname === '/about';
  const { user, loading, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    await signOut();
  }, [signOut]);

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black px-6 md:px-12" aria-label="Main navigation">
      <div className="flex items-center gap-6">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Open filter menu"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden -ml-1 rounded p-2.5 text-neutral-400 transition-colors hover:text-white"
          >
            <MenuIcon />
          </button>
        )}
        <Link
          href="/community"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center rounded text-sm font-black tracking-[0.3em] transition-opacity hover:opacity-90"
          aria-label="BuildFastWithAI home"
        >
          <span className="mr-2 bg-white px-1.5 py-0.5 text-black">BUILD</span>
          <span className="hidden sm:inline">FAST Community</span>
        </Link>
      </div>

      <div className="hidden items-center gap-12 text-[0.625rem] font-extrabold uppercase tracking-[0.3em] md:flex">
        <Link
          href="/community"
          aria-current={isCommunity ? 'page' : undefined}
          className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black border-b-2 border-transparent pb-0.5 transition-colors ${
            isCommunity ? 'border-white text-white' : 'text-neutral-500 hover:border-neutral-400 hover:text-white'
          }`}
        >
          Community
        </Link>
        <Link
          href="/about"
          aria-current={isAbout ? 'page' : undefined}
          className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black border-b-2 border-transparent pb-0.5 transition-colors ${
            isAbout ? 'border-white text-white' : 'text-neutral-500 hover:border-neutral-400 hover:text-white'
          }`}
        >
          About
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {!loading && user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-white transition-colors hover:border-neutral-600 hover:bg-neutral-700"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url as string}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                  width={36}
                  height={36}
                />
              ) : (
                <User className="h-4 w-4" aria-hidden />
              )}
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-lg border border-neutral-700 bg-neutral-900 py-1 shadow-lg"
                role="menu"
              >
                <div className="border-b border-neutral-700 px-3 py-2">
                  <p className="truncate text-xs font-medium text-white">
                    {user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? 'Signed in'}
                  </p>
                  {user.email && (
                    <p className="truncate text-[10px] text-neutral-500">{user.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <JoinCommunityDialog>
            <button
              type="button"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm border border-neutral-800 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:border-white"
            >
              Join Community
            </button>
          </JoinCommunityDialog>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
