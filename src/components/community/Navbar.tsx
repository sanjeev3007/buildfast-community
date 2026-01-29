'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon } from './Icons';
import JoinCommunityDialog from './JoinCommunityDialog';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const isCommunity = pathname === '/community' || pathname?.startsWith('/community');
  const isAbout = pathname === '/about';

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black px-6 md:px-12" aria-label="Main navigation">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open filter menu"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black md:hidden -ml-1 rounded p-2.5 text-neutral-400 transition-colors hover:text-white"
        >
          <MenuIcon />
        </button>
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
        <JoinCommunityDialog>
          <button
            type="button"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm border border-neutral-800 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:border-white"
          >
            Join Community
          </button>
        </JoinCommunityDialog>
      </div>
    </nav>
  );
};

export default Navbar;
