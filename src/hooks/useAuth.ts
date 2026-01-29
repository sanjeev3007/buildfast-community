'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const openLoginPopup = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const left = Math.round((window.screen.width - POPUP_WIDTH) / 2);
      const top = Math.round((window.screen.height - POPUP_HEIGHT) / 2);
      const popup = window.open(
        '/auth/popup',
        'auth-popup',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},scrollbars=yes`
      );
      if (!popup) {
        reject(new Error('Popup blocked'));
        return;
      }
      const onMessage = async (e: MessageEvent) => {
        if (e.origin !== window.location.origin) return;
        if (e.data?.type === 'AUTH_SUCCESS') {
          window.removeEventListener('message', onMessage);
          clearInterval(interval);
          // Refresh session in opener so UI updates without page reload
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
          resolve();
        }
        if (e.data?.type === 'AUTH_ERROR') {
          window.removeEventListener('message', onMessage);
          clearInterval(interval);
          reject(new Error(e.data?.error ?? 'Auth failed'));
        }
      };
      window.addEventListener('message', onMessage);
      const interval = setInterval(() => {
        if (popup.closed) {
          window.removeEventListener('message', onMessage);
          clearInterval(interval);
          reject(new Error('Popup closed'));
        }
      }, 300);
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase.auth]);

  return { user, loading, openLoginPopup, signOut };
}
