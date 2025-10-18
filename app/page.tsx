'use client';

import { useEffect, useState } from 'react';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchLatestTrailers,
  fetchFreeToWatch,
} from '@/lib/api';
import Hero from '@/components/Hero';
import SectionTitle from '@/components/SectionTitle';
import MovieCarousel from '@/components/MovieCarousel';
import MovieCard from '@/components/MovieCard';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  [key: string]: any;
}

export default function MoviesPage() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [trailers, setTrailers] = useState<Movie[]>([]);
  const [freeToWatch, setFreeToWatch] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [trendData, popData, trailerData, freeData] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies(),
          fetchLatestTrailers(),
          fetchFreeToWatch(),
        ]);

        setTrending(trendData?.results ?? []);
        setPopular(popData?.results ?? []);
        setTrailers(trailerData?.results ?? []);
        setFreeToWatch(freeData?.results ?? []);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    })();
  }, []);

  return (
    <>
      {/* Full-bleed hero with default image */}
      <Hero />

      {/* Constrained content starts */}
      <main className="mx-auto max-w-7xl px-4 md:px-6 bg-background text-foreground">
        {/* Trending Movies */}
        <section className="mt-8 space-y-4">
          <SectionTitle title="Trending Now" />
          <MovieCarousel movies={trending} />
        </section>

        {/* Popular Movies */}
        <section className="mt-10 space-y-4">
          <SectionTitle title="Popular Movies" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {popular.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Latest Trailers */}
        <section className="mt-10 space-y-4">
          <SectionTitle title="Latest Trailers" />
          <MovieCarousel movies={trailers} />
        </section>

        {/* Free to Watch */}
        <section className="mt-10 space-y-4">
          <SectionTitle title="Free to Watch" />
          <MovieCarousel movies={freeToWatch} />
        </section>
      </main>
    </>
  );
}
