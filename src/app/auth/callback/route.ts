import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const isPopup = searchParams.get('popup') === '1';
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    const redirect = isPopup ? '/auth/callback/close?error=1' : '/';
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    if (isPopup) {
      return NextResponse.redirect(new URL('/auth/callback/close?error=1', request.url));
    }
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  if (isPopup) {
    return NextResponse.redirect(new URL('/auth/callback/close', request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
