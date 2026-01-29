'use client';

import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import type { Event } from '@/types/events.types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = event.date ? new Date(event.date) : null;
  const dateStr = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';

  return (
    <div className="group rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="mb-1 text-sm font-bold leading-tight text-white line-clamp-2 group-hover:text-neutral-200 transition-colors">
            {event.title}
          </h4>
          {event.description && (
            <p className="text-xs leading-relaxed text-neutral-400 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>{dateStr}</span>
        </div>

        {event.eventLink && (
          <a
            href={event.eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black flex h-6 w-6 shrink-0 items-center justify-center rounded border border-neutral-800 bg-transparent text-neutral-400 transition-all hover:border-neutral-600 hover:text-white"
            aria-label={`View event: ${event.title}`}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
