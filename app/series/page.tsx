"use client";
import { useEffect, useState } from "react";
import {
  fetchTrendingSeries,
  fetchPopularSeries,
  fetchTopRatedSeries,
  fetchOnTheAirSeries,
} from "@/lib/api";
// import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";

export default function SeriesPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [onAir, setOnAir] = useState<any[]>([]);

  useEffect(() => {
    fetchTrendingSeries().then(setTrending);
    fetchPopularSeries().then(setPopular);
    fetchTopRatedSeries().then(setTopRated);
    fetchOnTheAirSeries().then(setOnAir);
  }, []);

  return (
    <main className="p-8 space-y-12">
      <section>
        <h1 className="text-3xl font-bold mb-6">🔥 Trending Series</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trending.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">🌟 Popular Series</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popular.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">🏆 Top Rated Series</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topRated.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">📺 Currently Airing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {onAir.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>
    </main>
  );
}
