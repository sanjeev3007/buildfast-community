'use client';

import React from 'react';

interface SidebarOverlayProps {
  onClose: () => void;
}

/**
 * Backdrop when the sidebar is open on mobile. Clicking closes the sidebar.
 */
export default function SidebarOverlay({ onClose }: SidebarOverlayProps) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
      onClick={onClose}
      aria-hidden
    />
  );
}
