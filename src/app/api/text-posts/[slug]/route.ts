import { NextResponse } from "next/server";
import { getTextPostBySlug } from "@/actions/text-posts.actions";

export async function GET(
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

    const result = await getTextPostBySlug(slug);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[text-posts API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
