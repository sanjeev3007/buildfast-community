/**
 * Events-related types (Luma API)
 */

/** Luma API Event structure */
export interface LumaEvent {
  api_id: string;
  name: string;
  description?: string;
  start_at: string;
  end_at?: string;
  cover_url?: string;
  url: string;
  location?: {
    name?: string;
    address?: string;
  };
}

/** Luma API Response structure */
export interface LumaEventsResponse {
  entries: Array<{
    event: LumaEvent;
  }>;
}

/** App model for an event (simplified for sidebar) */
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  imageUrl?: string;
  eventLink: string;
  location?: string;
}

/** Response from getUpcomingEvents action */
export interface GetEventsResponse {
  success: boolean;
  data?: Event[];
  error?: unknown;
}
