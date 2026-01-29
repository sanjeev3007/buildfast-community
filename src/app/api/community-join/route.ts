import { NextResponse } from 'next/server';
import { joinCommunity } from '@/actions/community.actions';
import type { JoinCommunityRequest, JoinCommunityResponse } from '@/types/community.types';

export async function POST(req: Request): Promise<NextResponse<JoinCommunityResponse>> {
  try {
    const body = (await req.json()) as JoinCommunityRequest;
    const result = await joinCommunity(body);

    if (!result.ok) {
      const status = result.error?.includes('already on the list') ? 409 : 
                     result.error?.includes('valid email') ? 400 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
