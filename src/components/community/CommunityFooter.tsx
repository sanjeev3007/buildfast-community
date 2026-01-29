import React from 'react';

/**
 * Footer for the community section (main column).
 */
export default function CommunityFooter() {
  return (
    <footer className="mt-32 flex flex-col items-center justify-between gap-8 border-t border-neutral-800 py-12 sm:flex-row">
      <div className="text-[0.625rem] font-extrabold uppercase tracking-[0.3em] text-neutral-400">
        BuildFastWithAI &copy; {new Date().getFullYear()}
      </div>
      <div className="flex gap-8 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-neutral-500">
        <a
          href="#"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white"
        >
          Twitter
        </a>
        <a
          href="#"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm transition-colors hover:text-white"
        >
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
  );
}
