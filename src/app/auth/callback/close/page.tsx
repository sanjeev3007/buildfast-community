'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthCallbackClosePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const origin = window.location.origin;
    if (window.opener) {
      if (error) {
        window.opener.postMessage({ type: 'AUTH_ERROR' }, origin);
      } else {
        window.opener.postMessage({ type: 'AUTH_SUCCESS' }, origin);
      }
    }
    window.close();
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <p className="text-neutral-400">Sign-in complete. Closing…</p>
    </div>
  );
}
