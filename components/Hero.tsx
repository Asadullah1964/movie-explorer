'use client';

import SearchBar from './SearchBar';

type HeroProps = {
  backdrop?: string; // optional, defaults to hero_pic.jpg
  heading?: string;
  subheading?: string;
};

export default function Hero({ backdrop, heading, subheading }: HeroProps) {
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

          {/* Shared SearchBar (large variant) */}
          <div className="mt-6 w-full flex justify-center">
            <SearchBar size="lg" className="w-full" placeholder="Search movies, TV shows, people..." />
          </div>
        </div>
      </div>
    </section>
  );
}
