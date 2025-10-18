'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type HeroProps = {
  backdrop?: string; // optional, defaults to hero_pic.jpg
  heading?: string;
  subheading?: string;
};

export default function Hero({ backdrop, heading, subheading }: HeroProps) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Use provided backdrop or default image
  const bg = backdrop || '/hero_pic.jpg';

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[68vh]">
      {/* Full-bleed background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bg}')` }}
      />
      {/* Optional overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_20%,color-mix(in_oklab,transparent,transparent)_0%,color-mix(in_oklab,var(--foreground)_20%,transparent)_60%,color-mix(in_oklab,var(--foreground)_45%,transparent)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-14">
        <div className="flex min-h-[calc(68vh-3.5rem)] flex-col items-center justify-center text-center">
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
            {heading || 'Find your next favorite movie'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            {subheading || 'Search across popular, top-rated, and upcoming titles.'}
          </p>

          {/* Search form */}
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
                placeholder="Search movies..."
                className="w-full rounded-xl border border-token bg-surface/80 py-3 pl-10 pr-28 text-sm text-foreground placeholder:text-muted outline-none ring-0 backdrop-blur focus:border-token"
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
      </div>
    </section>
  );
}
