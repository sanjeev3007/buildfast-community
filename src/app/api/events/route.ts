import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lumaApiKey = process.env.LUMA_API_KEY;

    if (!lumaApiKey) {
      console.error("[events API] LUMA_API_KEY not configured");
      return NextResponse.json(
        { error: "Events API not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.lu.ma/public/v1/calendar/list-events?after=${new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString()}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-luma-api-key": lumaApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events from Luma API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[events API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
