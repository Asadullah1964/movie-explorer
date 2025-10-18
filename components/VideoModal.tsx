'use client';

import { useEffect, useRef } from 'react';

export default function VideoModal({
  open,
  onClose,
  title = 'Trailer',
  videoKey, // YouTube key
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  videoKey?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Close on ESC and trap focus
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = (document.activeElement as HTMLElement) || null;
    const el = dialogRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const focusables = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        // Trap focus
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // Focus the close button on open
    const closeBtn = el?.querySelector<HTMLButtonElement>('[data-close]');
    closeBtn?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      lastActiveRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[100]"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--foreground)_65%,transparent)]"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        className="absolute inset-0 m-auto flex max-h-[90vh] w-[95vw] max-w-4xl flex-col rounded-xl border border-token bg-surface shadow outline-none"
      >
        <div className="flex items-center justify-between border-b border-token px-4 py-2">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <button
            data-close
            onClick={onClose}
            className="rounded-md border border-token bg-surface px-2 py-1 text-sm text-foreground hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
          >
            Close
          </button>
        </div>

        {/* Responsive 16:9 player */}
        <div className="relative w-full overflow-hidden rounded-b-xl">
          <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            {videoKey ? (
              <iframe
                title="YouTube trailer"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                No trailer available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
