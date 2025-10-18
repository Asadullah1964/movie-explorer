'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type BackdropSource =
  | { backdrop_path?: string | null; title?: string; name?: string }
  | string;

function getBackdropUrl(backdrop: BackdropSource) {
  const path = typeof backdrop === 'string' ? backdrop : backdrop?.backdrop_path;
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : null;
}

export default function Hero({
  backdrop,
  heading = 'Find your next favorite movie',
  subheading = 'Search across popular, top‑rated, and upcoming titles.',
}: {
  backdrop: BackdropSource;
  heading?: string;
  subheading?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const bg = getBackdropUrl(backdrop);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative w-full">
      {/* Backdrop */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{
          backgroundImage: bg
            ? `url('${bg}')`
            : "url('https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg')",
        }}
        aria-hidden
      />

      {/* Theme-aware scrims */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_20%,color-mix(in_oklab,transparent,transparent)_0%,color-mix(in_oklab,var(--foreground)_35%,transparent)_60%,color-mix(in_oklab,var(--foreground)_65%,transparent)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_0%,transparent),color-mix(in_oklab,var(--foreground)_28%,transparent),color-mix(in_oklab,var(--foreground)_50%,transparent))]" />

      {/* Content */}
      <div className="mx-auto flex min-h-[68vh] max-w-7xl flex-col items-center justify-center px-4 text-center md:px-6">
        {/* Title + subheading now use tokens */}
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
          {subheading}
        </p>

        {/* Search form fully tokenized */}
        <form onSubmit={onSubmit} role="search" className="mt-6 w-full max-w-2xl">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" strokeWidth="2" />
              </svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, TV shows, people..."
              className="w-full rounded-xl border border-token bg-surface/80 pl-10 pr-28 py-3 text-sm text-foreground placeholder:text-muted outline-none ring-0 backdrop-blur focus:border-token focus:ring-0"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-token bg-surface px-4 py-2 text-sm font-medium text-foreground shadow hover:bg-surface/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token"
            >
              Search
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">Try “Inception”, “Dune”, “Dark Knight”.</p>
        </form>
      </div>

      {/* Fade into the page background token */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
    </section>
  );
}
