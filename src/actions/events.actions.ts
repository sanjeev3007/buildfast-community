"use server";

import type { LumaEvent, Event, GetEventsResponse } from "@/types/events.types";

/**
 * Maps Luma API event to simplified Event model
 */
function mapLumaEventToEvent(lumaEvent: LumaEvent): Event {
  const eventDate = new Date(lumaEvent.start_at);
  
  return {
    id: lumaEvent.api_id,
    title: lumaEvent.name,
    description: lumaEvent.description,
    date: lumaEvent.start_at,
    time: eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    imageUrl: lumaEvent.cover_url,
    eventLink: lumaEvent.url,
    location: lumaEvent.location?.name || 'Online',
  };
}

/**
 * Fetches upcoming events from Luma API
 * @param limit - Maximum number of events to return (default: 5)
 */
export async function getUpcomingEvents(limit: number = 5): Promise<GetEventsResponse> {
  try {
    const lumaApiKey = process.env.LUMA_API_KEY;

    if (!lumaApiKey) {
      console.warn("[getUpcomingEvents] LUMA_API_KEY not configured - returning empty events");
      // Return empty array instead of error - graceful degradation
      return {
        success: true,
        data: [],
      };
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
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error("[getUpcomingEvents] Luma API error:", response.status, errorText);
      // Return empty array instead of throwing - graceful degradation
      return {
        success: true,
        data: [],
      };
    }

    const data = await response.json();
    
    if (!data?.entries || !Array.isArray(data.entries)) {
      return {
        success: true,
        data: [],
      };
    }

    const events = data.entries
      .map((entry: { event: LumaEvent }) => mapLumaEventToEvent(entry.event))
      .slice(0, limit);

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    console.error("[getUpcomingEvents] Error:", error);
    // Return empty array on error - graceful degradation
    return {
      success: true,
      data: [],
    };
  }
}
