'use client';

import React, { useEffect, useState } from 'react';
import { getUpcomingEvents } from '@/actions/events.actions';
import type { Event } from '@/types/events.types';
import EventCard from './event-card';

export default function EventsSidebar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const result = await getUpcomingEvents(5);
        if (result.success && result.data) {
          setEvents(result.data);
        } else {
          // Even if not successful, set empty array to hide loading
          setEvents([]);
        }
      } catch (error) {
        console.error('[EventsSidebar] Error loading events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <aside className="hidden lg:block w-80 shrink-0 border-l border-neutral-800 bg-black p-8">
      <div className="mb-6">
        <h3 className="mb-6 text-[0.625rem] font-extrabold uppercase tracking-[0.4em] text-neutral-500">
          Upcoming Events
        </h3>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg border border-neutral-800 bg-neutral-900/50"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-center">
            <p className="text-xs text-neutral-500">
              No upcoming events
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
