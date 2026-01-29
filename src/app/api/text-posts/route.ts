import { NextResponse } from "next/server";
import { getTextPosts } from "@/actions/text-posts.actions";

export async function GET() {
  try {
    const result = await getTextPosts();

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch text posts" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data || []);
  } catch (error) {
    console.error("[text-posts API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch text posts" },
      { status: 500 }
    );
  }
}
