import { NextResponse } from "next/server";
import { getLinkPreview } from "@/actions/link-preview.actions";
import type { LinkPreviewRequest, LinkPreviewResponse } from "@/types/link-preview.types";

export async function POST(req: Request): Promise<NextResponse<LinkPreviewResponse>> {
  try {
    const body = (await req.json()) as LinkPreviewRequest;
    const result = await getLinkPreview(body);

    if ('error' in result) {
      const status = result.error?.includes('Invalid') || result.error?.includes('must start') ? 400 : 500;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[link-preview] Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
