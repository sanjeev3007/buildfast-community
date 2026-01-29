'use client';

import React from 'react';
import { SearchIcon, XIcon } from './Icons';
import { PLATFORMS } from '@/types/community.types';

const SEARCH_ID = 'sidebar-index-search';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedPlatform,
  onPlatformChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-neutral-800 bg-black/80    px-4 py-6 transition-transform duration-300 ease-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-52 md:px-4 md:py-6
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      aria-label="Filter parameters"
    >
      <div className="mb-8  flex items-center justify-between md:hidden">
        <span className="block text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-white">Parameters</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full border border-neutral-800 p-2.5 text-white transition-all hover:border-white hover:bg-white hover:text-black"
        >
          <XIcon />
        </button>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <label htmlFor={SEARCH_ID} className="block text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-neutral-500">
            Index Search
          </label>
          <div className="group relative">
            <input
              id={SEARCH_ID}
              type="search"
              placeholder="KEYWORDS..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search posts by keywords"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full rounded-none border-b border-neutral-800 bg-transparent py-2.5 pl-7 pr-1 text-xs text-white placeholder:text-neutral-600 transition-colors focus:border-neutral-500"
            />
            <span
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors group-focus-within:text-white"
              aria-hidden
            >
              <SearchIcon />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="block text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-neutral-500">Source</span>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Platform filters"
          >
            {PLATFORMS.map((p) => {
              const value = p === 'All' ? 'all' : p.toLowerCase();
              const isSelected =
                selectedPlatform === 'all'
                  ? p === 'All'
                  : selectedPlatform === value || (value === 'twitter' && selectedPlatform === 'x');
              return (
                <button
                  key={p}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onPlatformChange(value)}
                  className={`
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-200
                    ${
                      isSelected
                        ? 'border-white bg-white text-black'
                        : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                    }
                  `}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
