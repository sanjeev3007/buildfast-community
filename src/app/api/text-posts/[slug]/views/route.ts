import { NextResponse } from "next/server";
import { incrementTextPostViews } from "@/actions/text-posts.actions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || slug.trim() === "") {
      return NextResponse.json(
        { error: "Invalid post slug" },
        { status: 400 }
      );
    }

    const result = await incrementTextPostViews(slug);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to increment views" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[text-posts views API] Error:", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}
