'use client';

import SearchBar from './SearchBar';

type HeroProps = {
  backdrop?: string;
  heading?: string;
  subheading?: string;
};

export default function Hero({ backdrop, heading, subheading }: HeroProps) {
  const bg = backdrop || '/hero_pic.jpg';

  return (
    <section className="relative left-1/2 right-1/2 min-h-[68vh] w-screen -ml-[50vw] -mr-[50vw] overflow-hidden">
      {/* Full-bleed background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bg}')` }}
      />

      {/* Light + dark readable overlays */}
      <div className="absolute inset-0 z-0 bg-black/20 dark:bg-black/55" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/20 via-background/45 to-background/85 dark:from-background/10 dark:via-background/35 dark:to-background/80" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent dark:from-background/80 dark:via-background/35 dark:to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 md:px-6">
        <div className="flex min-h-[calc(68vh-3.5rem)] flex-col items-center justify-center text-center">
          <div className="max-w-3xl rounded-2xl border border-border/60 bg-background/55 px-4 py-6 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-background/35 sm:px-6 md:px-8 md:py-8">
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              {heading || 'Find your next favorite movie'}
            </h1>

            <p className="mt-3 max-w-2xl mx-auto text-sm text-white/90 md:text-base">
              {subheading || 'Search across popular, top-rated, and upcoming titles.'}
            </p>

            <div className="mt-6 flex w-full justify-center">
              <SearchBar
                size="lg"
                className="w-full max-w-2xl"
                placeholder="Search movies, TV shows, people..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}