'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
};

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const step = card ? card.offsetWidth + 16 /* gap */ : 240;
    el.scrollBy({ left: dir === 'left' ? -step * 3 : step * 3, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Controls */}
      <button
        aria-label="Previous"
        onClick={() => scrollByCards('left')}
        className="group absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-300/70 bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white dark:border-white/15 dark:bg-zinc-900/70"
      >
        <svg className="h-5 w-5 text-zinc-800 group-hover:scale-110 transition dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        aria-label="Next"
        onClick={() => scrollByCards('right')}
        className="group absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-zinc-300/70 bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white dark:border-white/15 dark:bg-zinc-900/70"
      >
        <svg className="h-5 w-5 text-zinc-800 group-hover:scale-110 transition dark:text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="relative flex gap-4 overflow-x-auto pb-2 pl-1 pr-1 snap-x snap-mandatory scroll-smooth
        [--mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [mask-image:var(--mask)]
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {movies.map((movie) => {
  const title = movie.title || movie.name || 'Untitled';
  const src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.svg';

  return (
    <Link key={movie.id} href={`/${movie.id}`} className="snap-start min-w-[180px] max-w-[180px] sm:min-w-[200px] sm:max-w-[200px] flex-shrink-0">
      <div data-card className="group relative overflow-hidden rounded-xl border border-token bg-surface shadow-sm transition hover:shadow-md">
        <Image
          src={src}
          alt={title}
          width={200}
          height={300}
          className="h-[270px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          placeholder="empty"
        />
        {typeof movie.vote_average === 'number' && (
          <div className="absolute right-2 top-2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_90%,transparent)] px-2 py-0.5 text-xs text-[var(--background)] backdrop-blur">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-center text-sm font-medium text-foreground">
        {title}
      </h3>
    </Link>
  );
})}

      </div>
    </div>
  );
}
