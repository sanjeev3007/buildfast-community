'use client';

import React, { useState, useCallback, useEffect, type ReactNode } from 'react';

type JoinCommunityDialogProps = {
  children: ReactNode;
  /** Called when the trigger is clicked (e.g. to close a mobile menu) */
  onTriggerClick?: () => void;
};

export function JoinCommunityDialog({ children, onTriggerClick }: JoinCommunityDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const close = useCallback(() => {
    setOpen(false);
    setStatus('idle');
    setMessage('');
    setEmail('');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setStatus('error');
      setMessage('Please enter your email.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/community-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus('success');
        setMessage("You're on the list! We'll be in touch.");
        setEmail('');
        setTimeout(close, 2000);
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const triggerClick = () => {
    onTriggerClick?.();
    setOpen(true);
  };

  return (
    <>
      <div className="inline-block" role="presentation" onClick={triggerClick}>
        {children}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-dialog-title"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div
            className="w-full max-w-[28rem] rounded-xl border border-neutral-800 bg-black p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id="join-dialog-title" className="m-0 text-xl font-bold tracking-[-0.02em] text-white">
                Join the community
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white -m-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-2">
                <p className="text-base text-neutral-400">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="join-email" className="mb-2 block text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-neutral-400">
                    Email
                  </label>
                  <input
                    id="join-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full rounded-lg border border-neutral-800 bg-[#0a0a0a] px-4 py-3 text-base text-white transition-colors placeholder:text-neutral-500 focus:border-neutral-400 focus:shadow-[0_0_0_1px_rgb(115,115,115)]"
                  />
                  {message && (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {message}
                    </p>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black min-h-[2.75rem] flex-1 rounded-lg border-2 border-white bg-white px-5 text-xs font-extrabold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Joining…' : 'Join'}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black min-h-[2.75rem] min-w-24 shrink-0 rounded-lg border border-neutral-800 bg-transparent px-5 text-xs font-bold uppercase tracking-[0.1em] text-neutral-400 transition-colors hover:border-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default JoinCommunityDialog;
