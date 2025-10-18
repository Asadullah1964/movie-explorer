'use client';

import { useState } from 'react';
import VideoModal from './VideoModal';

export default function TrailerButton({
  videoKey,
  label = '▶ Watch Trailer',
}: { videoKey?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-lg border border-token bg-surface px-4 py-2 text-sm font-medium hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
      >
        {label}
      </button>
      <VideoModal open={open} onClose={() => setOpen(false)} videoKey={videoKey} title="Trailer" />
    </>
  );
}
