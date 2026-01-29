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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-dialog-title"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div
            className="w-full max-w-[22rem] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_48px_-12px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-neutral-700 via-white to-neutral-700" aria-hidden />

            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 id="join-dialog-title" className="m-0 text-lg font-bold tracking-tight text-white sm:text-xl">
                    Join the community
                  </h2>
                  <p className="mt-1.5 text-sm text-neutral-500">
                    Get updates, resources, and connect with builders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white -m-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {status === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white" aria-hidden>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-white">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="join-email" className="mb-2 block text-[0.625rem] font-extrabold uppercase tracking-[0.35em] text-neutral-500">
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
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black w-full rounded-lg border border-neutral-700 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-neutral-500 focus:bg-neutral-900"
                    />
                    {message && (
                      <p className="mt-2 text-sm text-red-400" role="alert">
                        {message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={close}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black order-2 min-h-[2.75rem] rounded-lg border border-neutral-700 bg-transparent px-5 text-xs font-bold uppercase tracking-wider text-neutral-400 transition-colors hover:border-neutral-500 hover:text-white sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black order-1 min-h-[2.75rem] rounded-lg border-2 border-white bg-white px-5 text-xs font-extrabold uppercase tracking-wider text-black transition-all hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:flex-1"
                    >
                      {status === 'loading' ? 'Joining…' : 'Join'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JoinCommunityDialog;
