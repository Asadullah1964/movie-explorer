'use client';

import { useEffect, useState } from 'react';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchLatestTrailers,
  fetchFreeToWatch,
} from '@/lib/api';
import MovieCarousel from '@/components/MovieCarousel';
import MovieCard from '@/components/MovieCard';
import SectionTitle from '@/components/SectionTitle';
import Hero from '@/components/Hero';

export default function MoviesPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<any[]>([]);
  const [heroBackdrop, setHeroBackdrop] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [trendData, popData, trailerData, freeData] = await Promise.all([
        fetchTrendingMovies(),
        fetchPopularMovies(),
        fetchLatestTrailers(),
        fetchFreeToWatch(),
      ]);

      // Compute hero backdrop from fetched trending results
      const firstBackdrop = trendData?.results?.[0]?.backdrop_path ?? null;

      setTrending(trendData?.results ?? []);
      setPopular(popData?.results ?? []);
      setTrailers(trailerData?.results ?? []);
      setFreeToWatch(freeData?.results ?? []);
      setHeroBackdrop(firstBackdrop);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 bg-background text-foreground">
      {/* Show Hero as soon as backdrop is known; Hero can also handle null safely if coded with fallback */}
      <Hero backdrop={heroBackdrop ?? undefined} />

      <section className="mt-8 space-y-4">
        <SectionTitle title="Trending Now" />
        <MovieCarousel movies={trending} />
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Popular Movies" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popular.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Latest Trailers" />
        <MovieCarousel movies={trailers} />
      </section>

      <section className="mt-10 space-y-4">
        <SectionTitle title="Free to Watch" />
        <MovieCarousel movies={freeToWatch} />
      </section>
    </main>
  );
}
