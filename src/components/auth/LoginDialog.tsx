'use client';

import React, { useCallback, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from './AuthDialog';

type LoginDialogProps = {
  children: ReactNode;
  onTrigger: () => void | Promise<void>;
  /** If provided, called when user is not logged in; return a promise that resolves after login so we can retry onTrigger */
  requireLogin?: () => Promise<void>;
};

/**
 * Wraps an action (e.g. Like, Comment). If user is logged in, runs onTrigger.
 * If not, opens sign-in dialog (Google enabled; LinkedIn, GitHub disabled). User clicks Google → OAuth popup → after success, runs requireLogin then onTrigger.
 */
export function LoginDialog({ children, onTrigger, requireLogin }: LoginDialogProps) {
  const { user, loading, openLoginPopup } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    if (user) {
      await Promise.resolve(onTrigger());
      return;
    }
    setShowAuthDialog(true);
  }, [user, loading, onTrigger]);

  const handleGoogleClick = useCallback(async () => {
    await openLoginPopup();
    if (requireLogin) await requireLogin();
    await Promise.resolve(onTrigger());
  }, [openLoginPopup, requireLogin, onTrigger]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children}
      </button>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onGoogleClick={handleGoogleClick}
      />
    </>
  );
}
