'use client';

import { useEffect, useState } from 'react';
import {
  fetchTrendingTV,
  fetchPopularTV,
  fetchTopRatedTV,
  fetchOnAirTV,
  fetchFreeToWatchTV,
} from '@/lib/api';
import MovieCarousel from '@/components/MovieCarousel';
import TVCard from '@/components/TVCard';
import SectionTitle from '@/components/SectionTitle';

export default function TVShowsPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [onAir, setOnAir] = useState<any[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [trend, pop, top, air, free] = await Promise.all([
        fetchTrendingTV(),
        fetchPopularTV(),
        fetchTopRatedTV(),
        fetchOnAirTV(),
        fetchFreeToWatchTV(),
      ]);

      setTrending(trend?.results ?? []);
      setPopular(pop?.results ?? []);
      setTopRated(top?.results ?? []);
      setOnAir(air?.results ?? []);
      setFreeToWatch(free?.results ?? []);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 bg-background text-foreground">
      <section className="space-y-4">
        <SectionTitle title="Trending TV Shows" />
        <MovieCarousel movies={trending} />
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Popular Shows" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popular.map((show) => (
            <TVCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Top Rated Shows" />
        <MovieCarousel movies={topRated} />
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Currently Airing" />
        <MovieCarousel movies={onAir} />
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Free to Watch" />
        <MovieCarousel movies={freeToWatch} />
      </section>
    </main>
  );
}
