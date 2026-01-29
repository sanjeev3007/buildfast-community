'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AuthPopupPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
          redirectTo: `${window.location.origin}/auth/callback?popup=1`,
        },
      });
      if (error) {
        setStatus('error');
        window.opener?.postMessage({ type: 'AUTH_ERROR', error: error.message }, window.location.origin);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setStatus('error');
      }
    };
    run();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      {status === 'loading' && <p className="text-neutral-400">Opening Google sign-in…</p>}
      {status === 'error' && <p className="text-red-400">Something went wrong. You can close this window.</p>}
    </div>
  );
}
