import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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

export default async function MoviesPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch data server-side
  const [trendData, popData, trailerData, freeData] = await Promise.all([
    fetchTrendingMovies(),
    fetchPopularMovies(),
    fetchLatestTrailers(),
    fetchFreeToWatch(),
  ]);

  const trending = trendData?.results ?? [];
  const popular = popData?.results ?? [];
  const trailers = trailerData?.results ?? [];
  const freeToWatch = freeData?.results ?? [];

  return (
    <>
      <Hero />

      <main className="mx-auto max-w-7xl px-4 md:px-6 bg-background text-foreground">
        <section className="mt-8 space-y-4">
          <SectionTitle title="Trending Now" />
          <MovieCarousel movies={trending} />
        </section>

        <section className="mt-10 space-y-4">
          <SectionTitle title="Popular Movies" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {popular.map((movie: Movie) => (
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
    </>
  );
}